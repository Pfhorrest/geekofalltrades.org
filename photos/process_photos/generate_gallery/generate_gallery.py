from datetime import datetime, timedelta
from tqdm import tqdm
from ..config import image_extensions, THUMB_SUFFIX
from ..extract_exif_data import extract_exif_data
from .identify_subject import identify_subject
from .identify_location import identify_location

def generate_gallery(path):
    """Generate a gallery of images from a directory.

    Args:
        path (Path or str): Path to the directory containing images.

    Returns:
        list: A list of dictionaries, each representing an image and its metadata.
        Returns None if no valid images are found.
    """
    images = []
    for filepath in path.iterdir():
        if not filepath.is_file():
            continue

        # Skip thumbnails
        if filepath.stem.endswith(f"-{THUMB_SUFFIX}"):
            continue

        # Skip non-images
        if filepath.suffix.lower() not in image_extensions:
            continue

        try:
            exif = extract_exif_data(filepath)

            # Get subject name
            subjects = identify_subject(filepath) # Comma-separated string of possible subjects
            subject = subjects.split(",")[0].strip() if subjects else None # Most likely subject

            # Get location name
            location = None
            locations = []
            if exif.get("gps"):
                locations = identify_location(*exif["gps"])
                first_location = locations[0] if locations else None
                first_in = next((l for l in locations if l.startswith("in ")), None)

                if first_location:
                    first_location_name = first_location.split(" ", 1)[1]
                    first_in_name = first_in.split(" ", 1)[1] if first_in else None

                    if first_in and first_in_name.lower() not in first_location_name.lower():
                        location = f"{first_location} {first_in}"
                    else:
                        location = f"{first_location}"

            # Compose title
            if subject and location:
                title = f"{subject} {location}"
            elif subject:
                title = subject
            elif location:
                title = location.split(" ", 1)[-1]  # Remove "at"/"in"/"on"/etc prefix for title
            else:
                title = None

            # Capitalize all words except short prepositions, unless first word
            def smart_title_case(text):
                """Convert a string to title case, ignoring certain short words.

                Args:
                    text (str): The string to convert.

                Returns:
                    str: The title-cased string.
                """
                skip_words = {"at", "in", "on", "to", "for", "by", "of", "and", "but", "or", "nor", "a", "an", "the", "near"}
                words = text.split()
                if not words:
                    return "Untitled"
                titled = []
                for i, word in enumerate(words):
                    dehyphenated = word.split("-")
                    rehyphenated = []
                    for j, part in enumerate(dehyphenated):
                        if i == 0 and j == 0:
                            rehyphenated.append(part.capitalize())
                        elif part.lower() in skip_words:
                            rehyphenated.append(part.lower())
                        else:
                            rehyphenated.append(part.capitalize())
                    titled.append("-".join(rehyphenated))
                return " ".join(titled)

            title = smart_title_case(title) if title else None

            # Compose description
            desc_parts = []
            if exif.get("camera"):
                desc_parts.append(exif["camera"])
            if exif.get("date"):
                desc_parts.append(exif["date"])
            description = ", ".join(desc_parts) if desc_parts else None

            # Generate times keywords from timestamp
            times = None
            if exif.get("timestamp"):
                dt = datetime.fromisoformat(exif["timestamp"])
                month = dt.month

                if month in (3, 4, 5):
                    season = "spring"
                elif month in (6, 7, 8):
                    season = "summer"
                elif month in (9, 10, 11):
                    season = "autumn"
                else:
                    season = "winter"

                # Determine time of day using astral if GPS available
                if exif.get("gps"):
                    # tqdm.write(f"[DEBUG] timestamp={exif.get('timestamp')}, gps={exif.get('gps')}")
                    try:
                        from astral import LocationInfo
                        from astral.sun import sun
                        import zoneinfo

                        lat, lon = exif["gps"]
                        loc = LocationInfo(latitude=lat, longitude=lon)
                        s = sun(loc.observer, date=dt.date())

                        # astral returns UTC-aware datetimes; make dt UTC-aware too
                        # iPhone timestamps are local time, so we need the local timezone
                        try:
                            from timezonefinder import TimezoneFinder
                            tz_name = TimezoneFinder().timezone_at(lat=lat, lng=lon)
                            tz = zoneinfo.ZoneInfo(tz_name)
                        except Exception:
                            # Fall back to UTC offset from longitude (rough approximation)
                            import pytz
                            offset_hours = round(lon / 15)
                            tz = pytz.FixedOffset(offset_hours * 60)

                        dt_aware = dt.replace(tzinfo=tz)

                        sun_times = [
                            s["dawn"],
                            s["sunrise"],
                            s["noon"],
                            s["sunset"],
                            s["dusk"],
                        ]

                        # Normalize: each time must be after the previous one
                        for i in range(1, len(sun_times)):
                            while sun_times[i] <= sun_times[i - 1]:
                                sun_times[i] += timedelta(days=1)

                        dawn, sunrise, noon, sunset, dusk = sun_times

                        golden_morning_end = sunrise + (noon - sunrise) * 0.15
                        golden_evening_start = sunset - (sunset - noon) * 0.15

                        if dt_aware < dawn:
                            time_of_day = "night"
                        elif dt_aware < sunrise:
                            time_of_day = "dawn"
                        elif dt_aware < golden_morning_end:
                            time_of_day = "golden hour"
                        elif dt_aware < noon:
                            time_of_day = "morning"
                        elif dt_aware < noon + (sunset - noon) * 0.5:
                            time_of_day = "midday"
                        elif dt_aware < golden_evening_start:
                            time_of_day = "afternoon"
                        elif dt_aware < sunset:
                            time_of_day = "golden hour"
                        elif dt_aware < dusk:
                            time_of_day = "dusk"
                        else:
                            time_of_day = "night"

                    except Exception as e:
                        tqdm.write(f"[WARN] astral time-of-day failed: {e}")
                        time_of_day = None
                else:
                    time_of_day = None

                times = ", ".join(filter(None, [season, time_of_day]))

            # Generate technicals keywords from EXIF
            technicals = None
            tech_parts = []
            if exif.get("camera"):
                tech_parts.append(exif["camera"])
            if exif.get("lens") and exif.get("camera"):
                camera = exif["camera"].lower()
                lens = exif["lens"].lower()
                # Skip lens if it just restates the camera name and technical specs we already have
                if camera not in lens:
                    tech_parts.append(exif["lens"])
            if exif.get("focal_length"):
                tech_parts.append(f"{exif['focal_length']}mm")
            if exif.get("f_number"):
                tech_parts.append(f"f/{exif['f_number']:.2f}".rstrip("0").rstrip("."))
            if exif.get("iso"):
                tech_parts.append(f"ISO {exif['iso']}")
            if exif.get("shutter"):
                shutter_val = exif["shutter"]
                if shutter_val >= 1:
                    shutter_str = f"{round(shutter_val)}s"
                else:
                    shutter_str = f"1/{round(1/shutter_val)}s"
                tech_parts.append(shutter_str)
            # tqdm.write(f"[DEBUG] tech_parts: {tech_parts}, exif keys: {list(exif.keys())}, focal={exif.get('focal_length')}, f={exif.get('f_number')}, iso={exif.get('iso')}, shutter={exif.get('shutter')}, lens={exif.get('lens')}")
            if tech_parts:
                technicals = ", ".join(tech_parts)

            # Add to array
            images.append({
                **({"title": title} if title else {}),
                **({"description": description} if description else {}),
                "filename": filepath.name,
                **({"subjects": subjects} if subjects else {}),
                **({"locations": ", ".join(locations)} if locations else {}),
                **({"times": times} if times else {}),
                **({"technicals": technicals} if technicals else {}),
                "_sort_timestamp": exif.get("timestamp")  # ISO 8601 expected
            })

        except Exception as e:
            tqdm.write(f"Warning: Skipping file {filepath} due to error: {e}")

    # SORT: sort by _sort_timestamp (None last)
    images.sort(
        key=lambda img: (img["_sort_timestamp"] is None, img["_sort_timestamp"]),
        reverse=True
    )

    # REMOVE _sort_timestamp before returning
    for img in images:
        img.pop("_sort_timestamp", None)

    return images if images else None
