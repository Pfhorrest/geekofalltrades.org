import json
import time
import requests
import io
from pathlib import Path
from tqdm import tqdm
import browser_cookie3
from ...config import INAT_TOKEN_CACHE_FILE

INAT_TOKEN = None

def get_inat_token():
    """Obtain an iNaturalist API token using the browser session cookie.

    Uses browser-cookie3 to extract the iNaturalist session cookie from the
    default browser (tries Firefox, Safari, and Chrome in order), then
    exchanges it for an API JWT token. Caches the result for 23 hours.

    Returns:
        str: A JWT API token, or None if the token could not be obtained.
    """
    tqdm.write(f"[NOTICE] Retrieving new iNat token")
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
        tqdm.write("[WARN] No iNaturalist session cookie found in any browser.")
        return None

    try:
        response = requests.get(
            "https://www.inaturalist.org/users/api_token",
            cookies=cookies
        )
        if not response.ok:
            tqdm.write(f"[WARN] iNat token request failed: {response.status_code}")
            return None

        token = response.json().get("api_token")
        if not token:
            tqdm.write("[WARN] iNat token response missing api_token")
            return None

        INAT_TOKEN_CACHE_FILE.write_text(json.dumps({
            "token": token,
            "timestamp": time.time()
        }))
        tqdm.write(f"Caching iNat token to {INAT_TOKEN_CACHE_FILE}")
        return token

    except Exception as e:
        tqdm.write(f"[WARN] iNat token retrieval error: {e}")
        return None

def identify_subject_inat(image):
    """Identify the subject of an image using the iNaturalist computer vision API.

    Args:
        image (PIL.Image): The image to identify.

    Returns:
        str: A comma-separated string of identified subject labels, or empty
            string if the API call fails or INAT_TOKEN is not set.
    """
    global INAT_TOKEN
    if not INAT_TOKEN:
        if INAT_TOKEN_CACHE_FILE.exists():
            try:
                cache = json.loads(INAT_TOKEN_CACHE_FILE.read_text())
                age = time.time() - cache.get("timestamp", 0)
                if age < 23 * 3600:
                    # tqdm.write(f"Using cached iNat token (age {age/3600:.1f}h)")
                    INAT_TOKEN = cache["token"]
            except Exception:
                pass
        if not INAT_TOKEN:
            try:
                INAT_TOKEN = get_inat_token()
            except Exception:
                tqdm.write("[WARN] Failed to get iNat token")
                return []

    try:
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        buffer.seek(0)

        response = requests.post(
            "https://api.inaturalist.org/v1/computervision/score_image",
            headers={"Authorization": f"Bearer {INAT_TOKEN}"},
            files={"image": ("image.jpg", buffer, "image/jpeg")},
            params={"locale": "en"}
        )
        if not response.ok:
            tqdm.write(f"[WARN] iNat API failed: {response.status_code}")
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
        #DEBUG: show raw API results
        # tqdm.write(f"iNat API labels: {', '.join(labels)}")
        return labels

    except Exception as e:
        tqdm.write(f"[WARN] iNat API error: {e}")
        return []
