from colorist import BrightColor
import requests
import datetime
import time

from tqdm import tqdm

def identify_weather(lat, lon, photo_timestamp, state=None):
    """Identify the weather at a given location and time using the Open-Meteo Archive API.

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.
        photo_timestamp (str or datetime): Timestamp of the photo in ISO format or as a datetime object.
        state (dict, optional): State dictionary to track last API call time for rate limiting. Defaults to {}.

    Returns:
        str: A string describing the weather condition, or None if the API call fails.
    """
    state = state if state is not None else {}
    # Parse the incoming timestamp (assuming ISO string or datetime object)
    if isinstance(photo_timestamp, str):
        dt = datetime.datetime.fromisoformat(photo_timestamp)
    else:
        dt = photo_timestamp
        
    date_str = dt.strftime("%Y-%m-%d")
    target_hour = dt.hour # Match the closest hourly reading

    # Query the Open-Meteo Archive Endpoint
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": date_str,
        "end_date": date_str,
        "hourly": "weather_code",
        "timezone": "auto" # Automatically adjusts to the local time of coordinates
    }
    
    # Rate limit: 10k requests/day
    delay = (60*60*24/10000) if getattr(state.get("args"), "retroactive", False) else 1
    time.sleep(max(0.0, delay - (time.monotonic() - state.get("last_run", {}).get("openmeteo", time.monotonic()))))

    result = None
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Extract the hourly code array and match it to your target hour
        weather_code = data["hourly"]["weather_code"][target_hour]
        
        # Dictionary lookup for the target metadata strings
        wmo_mapping = {
            0: "Clear",
            1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing Rime Fog",
            51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
            61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
            71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
            80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
            95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Thunderstorm with Heavy Hail"
        }

        result = wmo_mapping.get(weather_code, None)
        
    except Exception as e:
        tqdm.write(f"{BrightColor.RED}[Open-Meteo]{BrightColor.OFF} Error retrieving weather for {lat}, {lon} at {date_str}: {e}")

    # Update last run time for Open-Meteo API
    state.setdefault("last_run", {})["openmeteo"] = time.monotonic()

    if result:
        tqdm.write(f"{BrightColor.MAGENTA}WEATHER{BrightColor.OFF}: {result}") 
    return result if result else None