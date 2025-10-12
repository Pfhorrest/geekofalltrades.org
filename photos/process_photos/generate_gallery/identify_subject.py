from tqdm import tqdm
from ..config import base_dir
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
from collections import Counter

# List of models to use
MODEL_NAMES = [
    # General-purpose
    "microsoft/swin-large-patch4-window12-384-in22k",

    # Domain-specific
    # "Sisigoks/FloraSense",  # plants / flowers
    # "prithivMLmods/Bird-Species-Classifier-526",  # birds
    # "mmgyorke/vit-world-landmarks",  # world landmarks
]

# Cache processors and models to avoid reloading
MODEL_CACHE = {}

def load_model(model_name):
    """Load a model and its processor, caching them for future use.

    Args:
        model_name (str): The name of the model to load.

    Returns:
        tuple: A tuple containing the processor and model.
    """
    if model_name not in MODEL_CACHE:
        processor = AutoImageProcessor.from_pretrained(model_name)
        model = AutoModelForImageClassification.from_pretrained(model_name)
        MODEL_CACHE[model_name] = (processor, model)
    return MODEL_CACHE[model_name]

def identify_subject(image_path):
    """Identify the subject of an image using multiple pre-trained models.

    Args:
        image_path (Path or str): Path to the image file.

    Returns:
        str: A string describing the identified subject(s) of the image.
    """
    image = Image.open(image_path).convert("RGB")
    all_labels = []

    for model_name in MODEL_NAMES:
        try:
            processor, model = load_model(model_name)
            inputs = processor(images=image, return_tensors="pt")

            with torch.no_grad():
                logits = model(**inputs).logits

            # Get top-k predictions
            top_k = 1
            top_indices = torch.topk(logits, k=top_k, dim=-1).indices[0].tolist()
            labels = [model.config.id2label.get(idx, str(idx)).replace("_", " ").strip() for idx in top_indices]

            all_labels.extend(labels)

        except Exception as e:
            tqdm.write(f"[WARN] {model_name} failed: {e}")

    # Count occurrences of each label
    label_counts = Counter(all_labels)

    # Deduplicate while sorting by frequency (highest first)
    seen = set()
    sorted_labels = []
    for label, _ in label_counts.most_common():
        label = label.replace("_", " ").strip()
        if label not in seen:
            seen.add(label)
            sorted_labels.append(label)

    output = ", ".join(sorted_labels)
    tqdm.write(f"Identified subject for {image_path.relative_to(base_dir)}: {output}")
    return output
