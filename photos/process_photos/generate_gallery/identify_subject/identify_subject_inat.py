import json
import time
import requests
import io
from pathlib import Path
from tqdm import tqdm
from colorist import BrightColor
import browser_cookie3
from ... import config  # For INAT_TOKEN_CACHE_FILE

INAT_TOKEN = None
INAT_TOKEN_TIMESTAMP = 0
TOKEN_MAX_AGE = 23 * 3600

def get_inat_token(force_refresh=False):
    """Obtain a valid iNaturalist API token from memory, disk cache, or browser cookies.

    Uses browser-cookie3 to extract the iNaturalist session cookie from the
    default browser (tries Firefox, Safari, and Chrome in order), then
    exchanges it for an API JWT token. Caches the result for 23 hours.

    Returns:
        str: A JWT API token, or None if the token could not be obtained.
    """
    global INAT_TOKEN, INAT_TOKEN_TIMESTAMP
    now = time.time()

    # 1. Return in-memory token if still fresh
    if not force_refresh and INAT_TOKEN and (now - INAT_TOKEN_TIMESTAMP < TOKEN_MAX_AGE):
        return INAT_TOKEN

    # 2. Check disk cache (useful across separate script runs)
    if not force_refresh and config.INAT_TOKEN_CACHE_FILE.exists():
        try:
            cache = json.loads(config.INAT_TOKEN_CACHE_FILE.read_text())
            cached_ts = cache.get("timestamp", 0)
            if now - cached_ts < TOKEN_MAX_AGE and cache.get("token"):
                INAT_TOKEN = cache["token"]
                INAT_TOKEN_TIMESTAMP = cached_ts
                return INAT_TOKEN
        except Exception:
            pass

    # 3. Fetch a brand-new token from iNaturalist using browser cookies
    tqdm.write(f"{BrightColor.BLUE}[NOTICE]{BrightColor.OFF} Retrieving new iNat token")
    cookies = None
    for loader in [browser_cookie3.firefox, browser_cookie3.safari, browser_cookie3.chrome]:
        try:
            jar = loader(domain_name=".inaturalist.org")
            if any(c.name for c in jar):
                cookies = jar
                break
        except Exception:
            continue

    if not cookies:
        tqdm.write(f"{BrightColor.RED}[WARN]{BrightColor.OFF} No iNaturalist session cookie found in any browser.")
        INAT_TOKEN = None
        INAT_TOKEN_TIMESTAMP = 0
        return None

    try:
        response = requests.get(
            "https://www.inaturalist.org/users/api_token",
            cookies=cookies,
            timeout=15
        )
        if not response.ok:
            tqdm.write(f"{BrightColor.RED}[WARN]{BrightColor.OFF} iNat token request failed: {response.status_code}")
            return None

        token = response.json().get("api_token")
        if not token:
            tqdm.write(f"{BrightColor.RED}[WARN]{BrightColor.OFF} iNat token response missing api_token")
            return None

        now = time.time()
        config.INAT_TOKEN_CACHE_FILE.write_text(json.dumps({
            "token": token,
            "timestamp": now
        }))
        INAT_TOKEN = token
        INAT_TOKEN_TIMESTAMP = now
        return INAT_TOKEN

    except Exception as e:
        tqdm.write(f"{BrightColor.RED}[WARN]{BrightColor.OFF} iNat token retrieval error: {e}")
        return None


def identify_subject_inat(image, state=None):
    """Identify the subject of an image using the iNaturalist computer vision API.

    Args:
        image (PIL.Image): The image to identify.
        state (dict, optional): A dictionary containing persistent state across all images. Defaults to {}.

    Returns:
        str: A comma-separated string of identified subject labels, or empty
            string if the API call fails or INAT_TOKEN is not set.
    """
    state = state if state is not None else {}
    token = get_inat_token()
    if not token:
        return []

    try:
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        image_bytes = buffer.getvalue()

        # Rate limit: 10k requests/day in retroactive mode
        delay = (60 * 60 * 24 / 10000) if getattr(state.get("args"), "retroactive", False) else 1
        last_run = state.get("last_run", {}).get("inat")
        if last_run is not None:
            time.sleep(max(0.0, delay - (time.monotonic() - last_run)))

        def post_image(auth_token):
            return requests.post(
                "https://api.inaturalist.org/v1/computervision/score_image",
                headers={"Authorization": f"Bearer {auth_token}"},
                files={"image": ("image.jpg", io.BytesIO(image_bytes), "image/jpeg")},
                params={"locale": "en"},
                timeout=30
            )

        response = post_image(token)
        state.setdefault("last_run", {})["inat"] = time.monotonic()

        # Reactive fallback: if token expired early, force-refresh once and retry
        if response.status_code == 401:
            tqdm.write(f"{BrightColor.YELLOW}[NOTICE]{BrightColor.OFF} iNat token returned 401; refreshing and retrying...")
            token = get_inat_token(force_refresh=True)
            if not token:
                return []
            time.sleep(1)
            response = post_image(token)

            # Update last run time for iNat API
            state.setdefault("last_run", {})["inat"] = time.monotonic()

        if not response.ok:
            tqdm.write(f"{BrightColor.RED}[WARN]{BrightColor.OFF} iNat API failed: {response.status_code}")
            return []

        results = response.json().get("results", [])
        labels = []
        for result in results[:1]:
            taxon = result.get("taxon", {})
            name = taxon.get("name", "")
            common = taxon.get("preferred_common_name", "")
            if common:
                labels.append(common)
            if name and name.lower() != common.lower():
                labels.append(name)
        return labels

    except Exception as e:
        tqdm.write(f"{BrightColor.RED}[WARN]{BrightColor.OFF} iNat API error: {e}")
        return []
