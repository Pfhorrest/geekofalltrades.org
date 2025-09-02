import json
from pathlib import Path
from google.cloud import vision
from ..config import base_dir, SUBJECT_CACHE_FILE

vision_client = vision.ImageAnnotatorClient()

if Path(SUBJECT_CACHE_FILE).exists():
    with open(SUBJECT_CACHE_FILE, "r") as f:
        subject_cache = json.load(f)
else:
    subject_cache = {}

def save_subject_cache():
    with open(SUBJECT_CACHE_FILE, "w") as f:
        json.dump(subject_cache, f, indent=2)

def identify_subject(image_path):
    key = f"subject:{Path(image_path).relative_to(base_dir)}"

    # Return cached result if available
    if key in subject_cache:
        value = subject_cache[key]
        return value.get("label")

    try:
        with open(image_path, "rb") as img_file:
            content = img_file.read()
        image = vision.Image(content=content)

        candidates = []
        selected = None

        # First: best_guess_labels
        web_response = vision_client.web_detection(image=image)
        web_data = web_response.web_detection
        if web_data:
            if web_data.best_guess_labels:
                bgl = [lbl.label.strip() for lbl in web_data.best_guess_labels if lbl.label]
                print("[GCV] Best guess labels:", bgl[:5])
                candidates.extend(bgl)
                if not selected and bgl:
                    selected = bgl[0]

            # Then: web_entities
            if web_data.web_entities:
                entities = [ent.description.strip() for ent in web_data.web_entities if ent.description]
                print("[GCV] Web entities:", entities[:10])
                candidates.extend(entities)
                for name in entities:
                    if len(name.split()) >= 2 and name[0].islower():
                        selected = name
                        break

        # Fallback: label_detection
        if not selected:
            label_response = vision_client.label_detection(image=image)
            label_data = label_response.label_annotations
            label_candidates = [lbl.description.strip() for lbl in label_data if lbl.description]
            print("[GCV] Labels:", label_candidates[:10])
            candidates.extend(label_candidates)
            if label_candidates:
                selected = label_candidates[0]

        result = {
            "label": selected,
            "candidates": candidates[:20],
        }
        subject_cache[key] = result
        save_subject_cache()
        return selected

    except Exception as e:
        print(f"[GCV] ERROR: {e}")
        return None
