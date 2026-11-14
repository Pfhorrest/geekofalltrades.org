from datetime import datetime, timedelta
from pathlib import Path
import re
from tqdm import tqdm
from .. import config  # For image_extensions, THUMB_SUFFIX
from ..extract_exif_data import extract_exif_data
from ..find_images_array import find_images_array
from ..parse_images_from_php import parse_images_from_php
from ..write_gallery import write_gallery
from .identify_subject import identify_subject
from .identify_location import identify_location

def generate_gallery(path, state={}):
    """Generate image metadata, or maintain an existing gallery retroactively.

    In retroactive mode an existing `$images` array is the source of truth: its
    entries are enriched in place (missing keys only), never rebuilt from the
    directory listing. This preserves manually curated and otherwise unmatched
    entries.

    Args:
        path (Path): Path to the directory containing images or the PHP file.
        state (dict, optional): A dictionary containing persistent state across all images. Defaults to {}.
    
    Returns:
        list: A list of dictionaries containing image metadata. None if no images were found.
    """
    path = Path(path)
    state = state if state is not None else {"delay": 1}
    def generate_image(filepath, state={}, existing=None):
        """Generate only the metadata fields missing from an existing entry.

        With ``existing=None``, generate the complete metadata record used for a
        new gallery. Otherwise, existing keys are treated as authoritative and
        only absent keys are considered for generation.
        
        Args:
            filepath (Path): The path to the image file.
            state (dict, optional): A dictionary containing persistent state across all images. Defaults to {}.
            existing (dict, optional): An existing metadata record to update. Defaults to None.

        Returns:
            dict: A dictionary containing metadata for the image.
        """
        try:
            retroactive = existing is not None
            existing = existing or {}
            needs = lambda key: not retroactive or key not in existing

            needs_subjects = needs("subjects")
            needs_locations = needs("locations")
            needs_title = needs("title")
            needs_description = needs("description")
            needs_times = needs("times")
            needs_technicals = needs("technicals")
            needs_sort_timestamp = needs("_sort_timestamp")

            needs_exif = any((
                needs_locations,
                needs_description,
                needs_times,
                needs_technicals,
                needs_sort_timestamp,
            ))
            exif = extract_exif_data(filepath) if needs_exif else {}

            # Get subject name
            subjects = identify_subject(filepath, state) if needs_subjects else existing.get("subjects")
            subject = subjects.split(",")[0].strip() if subjects else None # Most likely subject

            # Get location name
            location = None
            locations = []

            if needs_locations:
                if exif.get("gps"):
                    locations = identify_location(*exif["gps"], state)
            else:
                existing_locations = existing.get("locations")

                if isinstance(existing_locations, str) and existing_locations:
                    locations = [
                        part.strip()
                        for part in existing_locations.split(",")
                        if part.strip()
                    ]
                elif isinstance(existing_locations, (list, tuple)):
                    locations = list(existing_locations)

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
            title = None

            if needs_title:
                if subject and location:
                    title = f"{subject} {location}"
                elif subject:
                    title = subject
                elif location:
                    title = location.split(" ", 1)[-1]  # Remove "at"/"in"/"on"/etc prefix for title

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
            description = None
            if needs_description:
                desc_parts = []
                if exif.get("camera"):
                    desc_parts.append(exif["camera"])
                if exif.get("date"):
                    desc_parts.append(exif["date"])
                description = ", ".join(desc_parts) if desc_parts else None

            # Generate times keywords from timestamp
            times = None
            if needs_times and exif.get("timestamp"):
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
            if needs_technicals:
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
            image = {}
            if title:
                image["title"] = title
            if description:
                image["description"] = description
            if not retroactive:
                image["filename"] = filepath.name
            if needs_subjects and subjects:
                image["subjects"] = subjects
            if needs_locations and locations:
                image["locations"] = ", ".join(locations)
            if times:
                image["times"] = times
            if technicals:
                image["technicals"] = technicals
            if needs_sort_timestamp:
                image["_sort_timestamp"] = exif.get("timestamp")
            return image
        except Exception as e:
            tqdm.write(f"Warning: Skipping file {filepath} due to error: {e}")
            return None
    if getattr(state.get("args"), "retroactive", False):
        main_path = path / "__main.php"
        def has_images_array(path_or_text):
            """Return whether a PHP file or source string contains an images array.
            
            Args:
                path_or_text (Union[Path, str]): Path to a PHP file or the source string.

            Returns:
                bool: Whether the PHP file or source string contains an images array.
            """
            if isinstance(path_or_text, Path):
                text = path_or_text.read_text(encoding="utf-8")
            elif isinstance(path_or_text, str):
                try:
                    candidate = Path(path_or_text)
                    text = candidate.read_text(encoding="utf-8") if candidate.is_file() else path_or_text
                except OSError:
                    text = path_or_text
            else:
                text = str(path_or_text)
            return find_images_array(text) is not None

        if main_path.is_file() and has_images_array(main_path):
            def maintain_existing_gallery(path, state):
                """Enrich and sort only entries already present in an existing PHP gallery.
                
                Args:
                    path (Path): Path to the PHP file containing the existing gallery.
                    state (dict): A dictionary containing persistent state across all images.
                
                Returns:
                    bool: Whether the file was updated.
                """
                path = Path(path)
                original_text = path.read_text(encoding="utf-8")
                bounds = find_images_array(original_text)
                if not bounds:
                    return False

                existing_images = parse_images_from_php(path)
                on_disk_count = original_text.count("'filename' =>")
                if len(existing_images) < on_disk_count:
                    tqdm.write(
                        f"Refusing to update {path.relative_to(config.base_dir)}: parsed {len(existing_images)} images, "
                        f"but the PHP source contains {on_disk_count} filename entries."
                    )
                    return False

                enriched_images = []
                for existing in tqdm(existing_images, desc=f"Enriching images in {path.parent.relative_to(config.base_dir)}", unit="img", leave=False):
                    image = dict(existing)
                    filename = image.get("filename")
                    if filename:
                        filepath = path.parent / Path(filename)
                        if filepath.is_file():
                            generated = generate_image(filepath, state, existing=image)
                            if generated:
                                for key, value in generated.items():
                                    if key not in image:
                                        image[key] = value
                    enriched_images.append(image)

                def image_sort_key(img, directory):
                    """Return the legacy path/date sort key and a copy with cached timestamp.
                    
                    Args:
                        img (dict): Image dict.
                        directory (Path): Directory path.

                    Returns:
                        tuple: Legacy path/date sort key and a copy with cached timestamp.
                    """
                    filename = img.get("filename", "")
                    path_key = []
                    for part in filename.split("/"):
                        try:
                            path_key.append((0, int(part)))
                        except ValueError:
                            path_key.append((1, part))

                    timestamp = img.get("_sort_timestamp")
                    if not timestamp:
                        filepath = directory / Path(filename)
                        if filepath.is_file():
                            try:
                                timestamp = extract_exif_data(filepath).get("timestamp")
                            except Exception as e:
                                tqdm.write(f"Warning: could not extract EXIF from {filename}: {e}")
                    if not timestamp:
                        match = re.search(r"\d{4}-\d{2}-\d{2}", img.get("description", ""))
                        if match:
                            timestamp = match.group(0)

                    updated = {**img, "_sort_timestamp": timestamp} if timestamp and not img.get("_sort_timestamp") else img
                    if timestamp:
                        try:
                            date = datetime.fromisoformat(timestamp)
                        except (TypeError, ValueError):
                            try:
                                date = datetime.strptime(timestamp, "%Y-%m-%d")
                            except (TypeError, ValueError):
                                date = datetime.min
                    else:
                        date = datetime.min
                    return (path_key, date), updated
                sort_data = [image_sort_key(image, path.parent) for image in enriched_images]
                sorted_images = [image for sort_key, image in sorted(
                    sort_data, key=lambda item: item[0], reverse=True
                )]
                if sorted_images == existing_images:
                    return False

                # Independent guard: never serialize fewer records than the source contains.
                if len(sorted_images) < on_disk_count:
                    tqdm.write(f"Refusing to update {path.relative_to(config.base_dir)}: sorted image count would shrink the gallery.")
                    return False
                write_gallery(path, sorted_images)
                tqdm.write(f"Updated: {path.relative_to(config.base_dir)} (metadata enriched / sorted)")
                return True

            return maintain_existing_gallery(main_path, state)

    images = []
    for filepath in path.iterdir():
        if not filepath.is_file():
            continue
        if filepath.stem.endswith(f"-{config.THUMB_SUFFIX}"):
            continue
        if filepath.suffix.lower() not in config.image_extensions:
            continue
        image = generate_image(filepath, state)
        if image:
            images.append(image)

    images.sort(
        key=lambda image: (image.get("_sort_timestamp") is None, image.get("_sort_timestamp") or ""),
        reverse=True,
    )
    return images or None
