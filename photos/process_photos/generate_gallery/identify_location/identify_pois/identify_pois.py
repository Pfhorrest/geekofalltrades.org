from colorist import BrightColor
from datetime import datetime, timezone
import math
import re
import time
import requests
from shapely import Point
from tqdm import tqdm
from .haversine import haversine
from .safe_polygon_from_coords import safe_polygon_from_coords

def fetch_overpass_wait_time(headers, state={"delay": 1}):
    """Queries the Overpass status endpoint and returns the required wait time in seconds.

    Args:
        state (dict, optional): A dictionary containing the current delay state. Defaults to {"delay": 1}.

    Returns:
        float: The required wait time in seconds.
    
    Raises:
        requests.exceptions.RequestException: If the request fails.
        ValueError: If the required wait time is less than the minimum delay.
    """
    status_url = "https://overpass-api.de/api/status"

    try:
        response = requests.get(status_url, headers=headers, timeout=10)
        response.raise_for_status()
        status_text = response.text

        # Look for "Slot available after: 2026-10-07T17:08:15Z"
        match = re.search(
            r"Slot available after:\s*([\d\-TZ:]+)", status_text
        )

        if match:
            # Extract timestamp string
            timestamp_str = match.group(1)

            # Parse ISO 8601 string to a UTC-aware datetime object
            # Note: '%Y-%m-%dT%H:%M:%SZ' requires standard ISO format
            available_time = datetime.strptime(
                timestamp_str, "%Y-%m-%dT%H:%M:%SZ"
            ).replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)

            # Calculate seconds remaining
            time_remaining = math.ceil(max(1, (available_time - now).total_seconds()))

            # Return calculated delay, but never drop below your baseline minimum
            tqdm.write(f"{BrightColor.MAGENTA}[OSM]{BrightColor.OFF} Overpass says to wait {time_remaining} seconds before next request.")
            return time_remaining

    except Exception as e:
        # Fallback if the status endpoint itself times out or fails
        tqdm.write(f"{BrightColor.RED}[OSM]{BrightColor.OFF} Overpass could not check status ({e}). Doubling delay for safety.")
        state["delay"] = max(1,state["delay"] * 2)
        return state["delay"]

    # No "Slot available after" string found means a slot is free right now
    tqdm.write(f"{BrightColor.BLUE}[OSM]{BrightColor.OFF} Overpass gives no wait time!")
    return 0
    return 0

def overpass_request(query, state={"delay": 1}, max_retries=5):
    """Submit a query to the Overpass API with adaptive retry on failure.

    Retries on 429 (rate limit), 502 (bad gateway), and other transient
    errors using exponential backoff. Raises on persistent failure.

    Args:
        query (str): The Overpass QL query string.
        max_retries (int): Maximum number of attempts before giving up.

    Returns:
        dict: Parsed JSON response from the Overpass API.

    Raises:
        RuntimeError: If all retries are exhausted.
    """
    overpass_url = "https://overpass-api.de/api/interpreter"
    headers = {
        "User-Agent": "Photo Metadata Script (forrest@geekofalltrades.org)",
        "Accept": "application/json"
    }

    for attempt in range(max_retries):
        try:
            state["delay"] = fetch_overpass_wait_time(headers, state)
            tqdm.write(f"{BrightColor.MAGENTA}[OSM]{BrightColor.OFF} Overpass attempt {attempt+1}/{max_retries} @ {datetime.now().time().replace(microsecond=0)} {('waiting ' + state['delay'] + 's before query...') if state['delay'] > 0 else 'running immediately...'}")
            time.sleep(state["delay"])
            response = requests.post(
                overpass_url,
                data={"data": query},
                headers=headers,
                timeout=30
            )
            if response.status_code is int and response.status_code != 200:
                tqdm.write(f"{BrightColor.RED}[OSM]{BrightColor.OFF} Overpass server error ({response.status_code}), retrying after delay...")
                continue
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout:
            tqdm.write(f"{BrightColor.RED}[OSM]{BrightColor.OFF} Overpass timeout on attempt {attempt + 1}, retrying after delay...")
        except Exception as e:
            tqdm.write(f"{BrightColor.RED}[OSM]{BrightColor.OFF} Overpass error on attempt {attempt + 1}: {e}")

    raise RuntimeError(f"{BrightColor.RED}[OSM]{BrightColor.OFF} Overpass API failed after {max_retries} attempts")

def identify_pois(lat, lon, state={"delay": 1}):
    """Identify points of interest (POIs) near given GPS coordinates.

    Returns all named POIs found within the search radius, ordered by:
    containing POIs first (smallest area to largest), then non-containing
    POIs (nearest to farthest). Each entry is prefixed with "at" for
    containing POIs and "near" for non-containing POIs.

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.

    Returns:
        list of str: Prefixed location strings e.g. ["at Surfrider Beach",
            "near Malibu Pier"], or empty list if none found or on error.
    """
    radius = 100  # meters

    features = ['education', 'geological', 'historic', 'leisure', 'man_made', 'military', 'natural', 'tourism']
    query_lines = []
    for feature in features:
        line = f'  nwr["{feature}"]["name"](around:{radius},{lat},{lon});'
        query_lines.append(line)
    inner_block = "\n".join(query_lines)
    
    query = f"""
    [out:json][timeout:45];
    (
        {inner_block}
    );
    out body geom;
    """

    try:
        data = overpass_request(query, state)
    except RuntimeError as e:
        tqdm.write(f"{BrightColor.RED}[OSM]{BrightColor.OFF} OVERPASS ERROR: {e}")
        return []

    elements = data.get("elements", [])
    named_nodes = []
    named_ways = []
    named_relations = []

    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue

        # tqdm.write(f"[OSM] {el['type']} {name}")
        el["__name"] = name
        el["__tags"] = tags

        if el["type"] == "node":
            named_nodes.append(el)

        elif el["type"] == "way" and "geometry" in el:
            coords = [(pt["lon"], pt["lat"]) for pt in el["geometry"]]
            poly = safe_polygon_from_coords(coords)
            if poly:
                el["__geometry"] = poly
                named_ways.append(el)
            else:
                if coords:
                    avg_lon = sum(c[0] for c in coords) / len(coords)
                    avg_lat = sum(c[1] for c in coords) / len(coords)
                    el["__geometry"] = Point(avg_lon, avg_lat).buffer(1e-6)
                    named_ways.append(el)

        elif el["type"] == "relation" and "members" in el:
            outer_polys = []
            inner_polys = []
            for member in el["members"]:
                if member.get("geometry") and member.get("role") in ["outer", "inner"]:
                    coords = [(pt["lon"], pt["lat"]) for pt in member["geometry"]]
                    poly = safe_polygon_from_coords(coords)
                    if not poly:
                        continue
                    if member["role"] == "outer":
                        outer_polys.append(poly)
                    elif member["role"] == "inner":
                        inner_polys.append(poly)
            if outer_polys:
                el["__geometry_outer"] = outer_polys
                el["__geometry_inner"] = inner_polys
                named_relations.append(el)

    point = Point(lon, lat)
    containing = []   # (name, area)
    non_containing = []  # (name, distance)

    # --- Containment check for ways ---
    for way in named_ways:
        if way["__geometry"].contains(point):
            containing.append((way["__name"], way["__geometry"].area))
        else:
            dist = way["__geometry"].distance(point) * 111320
            non_containing.append((way["__name"], dist))

    # --- Containment check for relations ---
    for rel in named_relations:
        is_contained = any(poly.contains(point) for poly in rel["__geometry_outer"])
        is_within_hole = any(poly.contains(point) for poly in rel["__geometry_inner"])
        if is_contained and not is_within_hole:
            area = sum(p.area for p in rel["__geometry_outer"]) - sum(p.area for p in rel["__geometry_inner"])
            containing.append((rel["__name"], area))
        else:
            all_polys = rel["__geometry_outer"] + rel["__geometry_inner"]
            dists = [poly.distance(point) * 111320 for poly in all_polys]
            if dists:
                non_containing.append((rel["__name"], min(dists)))

    # --- Nodes are always non-containing ---
    for node in named_nodes:
        dist = haversine(lat, lon, node["lat"], node["lon"])
        non_containing.append((node["__name"], dist))

    # --- Sort and prefix ---
    containing.sort(key=lambda x: x[1])   # smallest area first
    non_containing.sort(key=lambda x: x[1])  # nearest first

    result = [f"at {name}" for name, _ in containing]
    result += [f"near {name}" for name, _ in non_containing]

    # if result:
    #     tqdm.write(f"[OSM] POIs: {', '.join(result)}")
    # else:
    #     tqdm.write("[OSM] No POIs found")

    return result