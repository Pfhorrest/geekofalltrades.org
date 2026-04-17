from PIL import Image
from tqdm import tqdm
from ...config import base_dir
from .identify_subject_inat import identify_subject_inat
from .identify_subject_local import identify_subject_local

def identify_subject(image_path):
    """Identify the subject of an image using the iNaturalist computer vision API
    or a local ensemble of pre-trained models

    Args:
        image_path (Path or str): Path to the image file.

    Returns:
        str: A comma-separated string of identified subject labels. iNat
            results appear first if available, followed by ensemble model
            results filtered to the consensus threshold.
    """
    image = Image.open(image_path).convert("RGB")

    inat_labels = identify_subject_inat(image)
    local_labels = identify_subject_local(image)
    output = ", ".join(inat_labels + local_labels)

    tqdm.write(f"Identified subject for {image_path.relative_to(base_dir)}: {output}")
    return output