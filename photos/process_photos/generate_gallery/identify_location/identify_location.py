from colorist import BrightColor
import time
import requests
from tqdm import tqdm
from .identify_pois import identify_pois

NOMINATIM_ADDRESS_FIELDS = [
    ("road", "on"),
    ("neighbourhood", "in"),
    ("suburb", "in"),
    ("village", "in"),
    ("town", "in"),
    ("city", "in"),
    ("county", "in"),
    ("state", "in"),
    ("country", "in"),
]

def identify_location(lat, lon, state={}):
    """Identify a list of prefixed location strings for given GPS coordinates.

    Combines POIs from Overpass (prefixed "at" or "near") with the full
    address hierarchy from Nominatim (prefixed "in" or "on"), ordered from
    most to least specific.

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.
        state (dict, optional): A dictionary containing persistent state across all images. Defaults to {}.

    Returns:
        list of str: Prefixed location strings e.g. ["at Surfrider Beach",
            "near Malibu Pier", "on Main St", "in Malibu",
            "in Los Angeles County", "in California"], or empty list if
            nothing found.
    """
    headers = {"User-Agent": "Photo Metadata Script (forrest@geekofalltrades.org)"}

    # Step 1: Nominatim reverse geocode — collect full address hierarchy
    nominatim_locations = []
    nominatim_url = "https://nominatim.openstreetmap.org/reverse"

    # Rate limit: 4 requests/minute (1 request every 15 seconds)
    delay = (60/4) if getattr(state.get("args"), "retroactive", False) else 1
    time.sleep(max(0.0, delay - (time.monotonic() - getattr(state.get("last_run"), "nominatim", time.monotonic()))))

    try:
        r = requests.get(nominatim_url, params={
            "format": "json",
            "lat": lat,
            "lon": lon,
            "zoom": 18,
            "addressdetails": 1
        }, headers=headers, timeout=10)
        r.raise_for_status()
        address = r.json().get("address", {})
        for field, prefix in NOMINATIM_ADDRESS_FIELDS:
            if field in address:
                value = address[field]
                if "(" in value and ")" in value:
                    value = value.split("(", 1)[1].split(")", 1)[0].strip()
                nominatim_locations.append(f"{prefix} {value}")
    except Exception as e:
        tqdm.write(f"{BrightColor.RED}[OSM]{BrightColor.OFF} NOMINATIM ERROR: {e}")

    # Update last run time for Nominatim API
    state.setdefault("last_run", {})["nominatim"] = time.monotonic()

    # Step 2: Overpass POIs
    pois = identify_pois(lat, lon)

    # Combine: POIs first, then Nominatim hierarchy
    result = pois + nominatim_locations

    tqdm.write(f"{BrightColor.CYAN}LOCATIONS{BrightColor.OFF}: {', '.join(result) if result else 'None'}")

    return result