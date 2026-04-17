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

def identify_subject_local(image):
    """Identify the subject of an image using a local ensemble of pre-trained models.

    Args:
        image (PIL.Image): The image to identify.

    Returns:
        list: A list of identified subject labels, filtered to the consensus
            threshold.
    """
    per_model_labels = []  # list of (surface_form, model_name) tuples

    for model_name in MODEL_NAMES:
        try:
            processor, model = load_model(model_name)
            inputs = processor(images=image, return_tensors="pt")
            with torch.no_grad():
                logits = model(**inputs).logits
            top_k = len(MODEL_NAMES)
            top_indices = torch.topk(logits, k=min(top_k, logits.shape[-1]), dim=-1).indices[0].tolist()
            model_labels = []
            for idx in top_indices:
                raw_surface = model.config.id2label.get(idx, str(idx)).replace("_", " ").strip()
                for surface in raw_surface.split(","):
                    surface = surface.strip()
                    if surface:
                        model_labels.append((surface, model_name))
            per_model_labels.append(model_labels)
        except Exception as e:
            tqdm.write(f"[WARN] {model_name} failed: {e}")
            per_model_labels.append([])
    
    raw_labels = [
        label
        for rank in range(max((len(m) for m in per_model_labels), default=0))
        for model_labels in per_model_labels
        if rank < len(model_labels)
        for label in [model_labels[rank]]
    ]

    # DEBUG: show raw labels
    # short_raw_labels = [f"{s} ({m.split('/')[1].split('-')[0]})" for s, m in raw_labels]
    # tqdm.write(f"Raw labels: {', '.join(short_raw_labels)}")

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
    max_freq = canonical_counts.most_common(1)[0][1]
    tolerance = len(MODEL_NAMES) / 2
    threshold = max(1, max_freq - tolerance)
    filtered = [(label, count) for label, count in canonical_counts.most_common()
            if count >= threshold]
    ensemble_labels = [label for label, _ in filtered[:len(MODEL_NAMES)]]

    # DEBUG: show which models contributed each label
    # label_sources = {}
    # for surface, model_name in raw_labels:
    #     key = re.sub(r"[^a-z0-9]", "", surface.lower())
    #     preferred = min(norm_map[key]["forms"], key=lambda f: (not bool(re.match(r"^[A-Z][a-z]+ [a-z]+", f)), len(f)))
    #     if preferred in [l for l, _ in filtered]:
    #         label_sources.setdefault(preferred, []).append(model_name.split("/")[1].split("-")[0])
    # debug_labels = [f"{l} ({', '.join(label_sources.get(l, []))})" for l in ensemble_labels]
    # tqdm.write(f"Consolidated labels: {', '.join(debug_labels)}")

    return ensemble_labels
