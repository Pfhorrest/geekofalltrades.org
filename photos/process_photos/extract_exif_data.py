import piexif
from pathlib import Path
from PIL import Image
from datetime import datetime
from tqdm import tqdm
from .config import base_dir

def extract_exif_data(image_path):
    # Sanitize the incoming path
    if not isinstance(image_path, Path):
        image_path = Path(image_path)
    image_path = Path(*[p.strip() for p in image_path.parts])
    if not image_path.is_file():
        raise FileNotFoundError(f"File does not exist or is not a file: {image_path}")

    relpath = image_path.relative_to(base_dir)
    strpath = str(image_path)

    try:
        # Open image
        img = Image.open(strpath)
        exif_bytes = img.info.get("exif")
        if exif_bytes:
            exif_data = piexif.load(exif_bytes)
        else:
            exif_data = {}
        img.close()

        # Safe access to "0th" IFD
        zeroth_ifd = exif_data.get("0th", {})

        camera_model = zeroth_ifd.get(piexif.ImageIFD.Model, b"").decode("utf-8", errors="ignore")
        date_taken_raw = zeroth_ifd.get(piexif.ImageIFD.DateTime, b"").decode("utf-8", errors="ignore")

        # Parse date
        date_taken = None
        full_timestamp = None
        if date_taken_raw:
            try:
                dt = datetime.strptime(date_taken_raw, "%Y:%m:%d %H:%M:%S")
                date_taken = dt.strftime("%Y-%m-%d")               # e.g. 2025-06-10
                full_timestamp = dt.strftime("%Y-%m-%dT%H:%M:%S") # e.g. 2025-06-10T14:37:22
            except ValueError:
                date_taken = None

        # Parse GPS
        gps_data = exif_data.get("GPS", {})
        gps = None
        if gps_data:
            def to_degrees(value):
                try:
                    d, m, s = value
                    return d[0]/d[1] + m[0]/m[1]/60 + s[0]/s[1]/3600
                except Exception:
                    return None

            lat_val = gps_data.get(piexif.GPSIFD.GPSLatitude)
            lat_ref = gps_data.get(piexif.GPSIFD.GPSLatitudeRef)
            lon_val = gps_data.get(piexif.GPSIFD.GPSLongitude)
            lon_ref = gps_data.get(piexif.GPSIFD.GPSLongitudeRef)

            lat = lon = None
            if isinstance(lat_val, (list, tuple)) and lat_ref in (b"N", b"S"):
                lat = to_degrees(lat_val)
                if lat_ref == b"S" and lat is not None:
                    lat = -lat
            if isinstance(lon_val, (list, tuple)) and lon_ref in (b"E", b"W"):
                lon = to_degrees(lon_val)
                if lon_ref == b"W" and lon is not None:
                    lon = -lon
            if lat is not None and lon is not None:
                gps = (lat, lon)

        return {
            "camera": camera_model or None,
            "date": date_taken,
            "gps": gps,
            "timestamp": full_timestamp
        }

    except Exception as e:
        tqdm.write(f"Error reading EXIF from {relpath}: {e}")
        return {}
