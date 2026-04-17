from tqdm import tqdm
from ...config import base_dir
from transformers import AutoImageProcessor, AutoModelForImageClassification
import torch
from collections import Counter
import re

# Fix for Intel Macs on older PyTorch (2.2.2)
if not hasattr(torch, "compiler"):
    class MockCompiler:
        def is_compiling(self): return False
    torch.compiler = MockCompiler()
elif not hasattr(torch.compiler, "is_compiling"):
    torch.compiler.is_compiling = lambda: False

from transformers import AutoModelForImageClassification, AutoImageProcessor

MODEL_NAMES = [
    "microsoft/swin-large-patch4-window12-384-in22k",
    "google/vit-large-patch16-224",
    "microsoft/beit-large-patch16-224-pt22k-ft22k",
    "facebook/convnext-large-224-22k",
]

MODEL_CACHE = {}

def load_model(model_name):
    """Load a model and its processor, caching them for future use.

    Args:
        model_name (str): The name of the model to load.

    Returns:
        tuple: A tuple containing the processor and model.
    """
    from transformers import logging as transformers_logging
    transformers_logging.set_verbosity_error()
    if model_name not in MODEL_CACHE:
        processor = AutoImageProcessor.from_pretrained(model_name, use_fast=True)
        model = AutoModelForImageClassification.from_pretrained(model_name)
        MODEL_CACHE[model_name] = (processor, model)
    return MODEL_CACHE[model_name]

def filter_by_consensus(label_counts):
    """Retain only labels matching the maximum agreement frequency.

    Only the most-agreed-upon labels survive. When no models agree (max
    frequency == 1), all labels are retained as a fallback.

    Args:
        label_counts (Counter): Mapping of canonical label to frequency.
        num_models (int): Total number of models in the ensemble (reserved
            for future use in threshold tuning).

    Returns:
        list of tuples: (label, count) pairs passing the threshold, sorted
            by descending frequency.
    """
    if not label_counts:
        return []
    max_freq = label_counts.most_common(1)[0][1]
    tolerance = 0
    threshold = min(1, max_freq - tolerance)
    return [(label, count) for label, count in label_counts.most_common()
            if count >= threshold]

def identify_subject_local(image):
    """Identify the subject of an image using a local ensemble of pre-trained models.

    Args:
        image (PIL.Image): The image to identify.

    Returns:
        list: A list of identified subject labels, filtered to the consensus
            threshold.
    """
    raw_labels = []  # list of (surface_form, model_name) tuples

    for model_name in MODEL_NAMES:
        try:
            processor, model = load_model(model_name)
            inputs = processor(images=image, return_tensors="pt")
            with torch.no_grad():
                logits = model(**inputs).logits
            top_k = 10
            top_indices = torch.topk(logits, k=min(top_k, logits.shape[-1]), dim=-1).indices[0].tolist()
            for idx in top_indices:
                raw_surface = model.config.id2label.get(idx, str(idx)).replace("_", " ").strip()
                for surface in raw_surface.split(","):
                    surface = surface.strip()
                    if surface:
                        raw_labels.append((surface, model_name))
        except Exception as e:
            tqdm.write(f"[WARN] {model_name} failed: {e}")

    # Normalize: group surface forms by their comparison key, sum frequencies
    norm_map = {}  # key -> {forms: list, count: int}
    for surface, _ in raw_labels:
        key = re.sub(r"[^a-z0-9]", "", surface.lower())
        if key not in norm_map:
            norm_map[key] = {"forms": [], "count": 0}
        norm_map[key]["forms"].append(surface)
        norm_map[key]["count"] += 1

    # Build a Counter of canonical forms -> frequency
    canonical_counts = Counter()
    for key, data in norm_map.items():
        preferred = min(data["forms"], key=lambda f: (not bool(re.match(r"^[A-Z][a-z]+ [a-z]+", f)), len(f)))
        canonical_counts[preferred] = data["count"]

    # Filter by consensus threshold
    filtered = filter_by_consensus(canonical_counts, len(MODEL_NAMES))
    ensemble_labels = [label for label, _ in filtered]

    # DEBUG: show which models contributed each label
    # label_sources = {}
    # for surface, model_name in raw_labels:
    #     key = re.sub(r"[^a-z0-9]", "", surface.lower())
    #     preferred = min(norm_map[key]["forms"], key=lambda f: (not bool(re.match(r"^[A-Z][a-z]+ [a-z]+", f)), len(f)))
    #     if preferred in [l for l, _ in filtered]:
    #         label_sources.setdefault(preferred, []).append(model_name.split("/")[1].split("-")[0])
    # debug_labels = [f"{l} ({', '.join(label_sources.get(l, []))})" for l in ensemble_labels]
    # tqdm.write(f"Ensemble: {', '.join(debug_labels)}")

    return ensemble_labels
