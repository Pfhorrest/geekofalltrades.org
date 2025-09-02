import piexif
from PIL import Image
from datetime import datetime

def extract_exif_data(image_path):
    try:
        img = Image.open(image_path)
        exif_data = piexif.load(img.info.get("exif", b""))
        img.close()

        camera_model = exif_data["0th"].get(piexif.ImageIFD.Model, b"").decode("utf-8", errors="ignore")

        date_taken_raw = exif_data["0th"].get(piexif.ImageIFD.DateTime, b"").decode("utf-8", errors="ignore")

        date_taken = None
        full_timestamp = None

        if date_taken_raw:
            try:
                dt = datetime.strptime(date_taken_raw, "%Y:%m:%d %H:%M:%S")
                date_taken = dt.strftime("%Y-%m-%d")               # e.g. 2025-06-10
                full_timestamp = dt.strftime("%Y-%m-%dT%H:%M:%S")   # e.g. 2025-06-10T14:37:22
            except ValueError:
                date_taken = None
        else:
            date_taken = None

        gps_data = exif_data.get("GPS", {})
        gps = None
        if gps_data:
            def to_degrees(value):
                d, m, s = value
                return d[0] / d[1] + m[0] / m[1] / 60 + s[0] / s[1] / 3600

            lat = lon = None
            if piexif.GPSIFD.GPSLatitude in gps_data and piexif.GPSIFD.GPSLatitudeRef in gps_data:
                lat = to_degrees(gps_data[piexif.GPSIFD.GPSLatitude])
                if gps_data[piexif.GPSIFD.GPSLatitudeRef] == b"S":
                    lat = -lat
            if piexif.GPSIFD.GPSLongitude in gps_data and piexif.GPSIFD.GPSLongitudeRef in gps_data:
                lon = to_degrees(gps_data[piexif.GPSIFD.GPSLongitude])
                if gps_data[piexif.GPSIFD.GPSLongitudeRef] == b"W":
                    lon = -lon
            if lat is not None and lon is not None:
                gps = (lat, lon)

        return {"camera": camera_model or None, "date": date_taken, "gps": gps, "timestamp": full_timestamp}
    except Exception as e:
        print(f"Error reading EXIF from {image_path}: {e}")
        return {}
