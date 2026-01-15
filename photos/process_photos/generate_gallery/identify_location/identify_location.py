import json
import time
import requests
from pathlib import Path
from shapely.geometry import Point
from tqdm import tqdm
from ...config import LOCATION_CACHE_FILE
from .identify_best_poi import identify_best_poi


def load_location_cache(cache_file=LOCATION_CACHE_FILE):
    if cache_file.exists():
        with open(cache_file) as f:
            return json.load(f)
    return {}

def save_location_cache(location_cache=None):
    """Save the location cache to a JSON file."""
    with open(LOCATION_CACHE_FILE, "w") as f:
        json.dump(location_cache, f, indent=2)

def identify_location(lat, lon, *, location_cache=None):
    """Identify the location and prefix for given GPS coordinates.

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.
    Returns:
        tuple: A tuple containing the location name and prefix.
    """

    # Return cached result if available
    if location_cache is None:
            location_cache = load_location_cache()

    key = f"{lat:.5f},{lon:.5f}"

    if key in location_cache:
        return location_cache[key]

    headers = {"User-Agent": "Photo Metadata Script (forrest@geekofalltrades.org)"}
    location, prefix = None, None

    # Step 1: Nominatim reverse geocode
    nominatim_url = "https://nominatim.openstreetmap.org/reverse"
    try:
        time.sleep(2)  # prevent rate-limiting
        r = requests.get(nominatim_url, params={
            "format": "json",
            "lat": lat,
            "lon": lon,
            "zoom": 18,
            "addressdetails": 1
        }, headers=headers, timeout=10)
        r.raise_for_status()
        data = r.json()
        address = data.get("address", {})
        for field in ("neighbourhood", "suburb", "hamlet", "village", "town", "city", "county", "state", "country"):
            if field in address:
                location = address[field].split("(", 1)[1].split(")", 1)[0].strip() if "(" in address[field] and ")" in address[field] else address[field]
                prefix = "in"
                break
    except Exception as e:
        tqdm.write(f"[OSM] NOMINATIM ERROR: {e}")

    # Step 2: Overpass query
    best_poi = identify_best_poi(lat, lon)

    if best_poi and best_poi[0]:
        selected_name, selected_prefix = best_poi
        tqdm.write(f"[OSM] Using POI: {selected_name}")
    elif location:
        selected_name = location
        selected_prefix = prefix
        tqdm.write(f"[OSM] Falling back to Nominatim: {selected_name}")
    else:
        selected_name = None
        selected_prefix = None
        tqdm.write(f"[OSM] No POI or Nominatim location found")

    # Save to cache
    if selected_name and selected_prefix:
        location_cache[key] = (selected_name, selected_prefix)
        save_location_cache(location_cache)

    return selected_name, selected_prefix
