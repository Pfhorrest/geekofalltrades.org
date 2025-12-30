import time
import requests
from shapely import Point
from tqdm import tqdm
from .haversine import haversine
from .safe_polygon_from_coords import safe_polygon_from_coords

def identify_best_poi(lat, lon):
    """Identify the best point of interest (POI) near given GPS coordinates.

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.

    Returns:
        tuple: A tuple containing the best POI name and prefix.
    """
    overpass_url = "https://overpass-api.de/api/interpreter"
    features = [
        "education", "geological", "historic", "leisure",
        "man_made", "military", "natural", "tourism"
    ]
    radius = 100  # meters
    feature_block = "\n".join(
        f'  {t}["{key}"]["name"](around:{radius},{lat},{lon});'
        for key in features
        for t in ("node", "way", "relation")
    )
    query = f"""
    [out:json][timeout:25];
    (
    {feature_block}
    );
    out body geom;
    """

    try:
        time.sleep(2)  # prevent rate-limiting
        response = requests.post(overpass_url, data={"data": query})
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        tqdm.write(f"[OSM] OVERPASS ERROR: {e}")
        return None, None

    elements = data.get("elements", [])
    named_nodes = []
    named_ways = []
    named_relations = []

    # --- Parse elements ---
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue

        tqdm.write(f"[OSM] {el['type']} {name}")
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
                # fallback: approximate with centroid of coords
                if coords:
                    avg_lon = sum(c[0] for c in coords) / len(coords)
                    avg_lat = sum(c[1] for c in coords) / len(coords)
                    el["__geometry"] = Point(avg_lon, avg_lat).buffer(1e-6)  # tiny polygon
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
    candidates = []

    # --- Containment check ---
    containing_ways = [
        (way["__name"], way["__geometry"].area, "at")
        for way in named_ways
        if way["__geometry"].contains(point)
    ]

    containing_rels = []
    for rel in named_relations:
        is_contained = any(poly.contains(point) for poly in rel["__geometry_outer"])
        is_within_hole = any(poly.contains(point) for poly in rel["__geometry_inner"])
        if is_contained and not is_within_hole:
            area = sum(p.area for p in rel["__geometry_outer"]) - sum(p.area for p in rel["__geometry_inner"])
            containing_rels.append((rel["__name"], area, "at"))

    if containing_ways or containing_rels:
        biggest_rel = max(containing_rels, key=lambda x: x[1], default=None)
        biggest_way = max(containing_ways, key=lambda x: x[1], default=None)
        if biggest_rel and biggest_way:
            best = max([biggest_rel, biggest_way], key=lambda x: x[1])
        else:
            best = biggest_rel or biggest_way
        candidates.append(best)

    # --- Distance fallback if nothing contains ---
    if not candidates:
        for node in named_nodes:
            dist = haversine(lat, lon, node["lat"], node["lon"])
            candidates.append((node["__name"], dist, "near"))

        for way in named_ways:
            dist = way["__geometry"].distance(point) * 111320  # meters approx
            candidates.append((way["__name"], dist, "near"))

        for rel in named_relations:
            all_polys = rel["__geometry_outer"] + rel["__geometry_inner"]
            dists = [poly.distance(point) * 111320 for poly in all_polys]
            if dists:
                candidates.append((rel["__name"], min(dists), "near"))

        if candidates:
            best = min(candidates, key=lambda x: x[1])
            tqdm.write(f"[OSM] Chose closest POI: {best[0]}")
            return best[0], best[2]

    # --- If containment was found ---
    if candidates:
        best = candidates[0]
        tqdm.write(f"[OSM] Chose containing POI: {best[0]}")
        return best[0], best[2]

    tqdm.write("[OSM] No POIs found at all")
    return None, None
