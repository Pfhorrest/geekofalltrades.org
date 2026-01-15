import pytest
from unittest.mock import patch, Mock
import torch
from pathlib import Path

import process_photos.generate_gallery.identify_subject as isub


# ------------------------
# Helpers
# ------------------------

class FakeModel:
    def __init__(self, labels):
        self.config = Mock()
        self.config.id2label = {i: label for i, label in enumerate(labels)}

    def __call__(self, **kwargs):
        # Create fake logits with highest score for index 0
        logits = torch.zeros((1, len(self.config.id2label)))
        logits[0, 0] = 10.0
        return Mock(logits=logits)


class FakeProcessor:
    def __call__(self, images=None, return_tensors=None):
        return {"pixel_values": torch.zeros((1, 3, 224, 224))}


def fake_load_model_factory(label):
    def _fake_load_model(model_name):
        return FakeProcessor(), FakeModel([label])
    return _fake_load_model


# ------------------------
# TESTS
# ------------------------

@patch("process_photos.generate_gallery.identify_subject.Image.open")
@patch("process_photos.generate_gallery.identify_subject.load_model")
@patch("process_photos.generate_gallery.identify_subject.base_dir", Path("."))
def test_single_model_single_label(mock_load_model, mock_image_open):
    mock_image_open.return_value.convert.return_value = Mock()

    mock_load_model.side_effect = fake_load_model_factory("cat")

    result = isub.identify_subject(Path("fake.jpg"))

    assert result == "cat"


@patch("process_photos.generate_gallery.identify_subject.Image.open")
@patch("process_photos.generate_gallery.identify_subject.load_model")
@patch("process_photos.generate_gallery.identify_subject.base_dir", Path("."))
def test_multiple_models_aggregate_labels(mock_load_model, mock_image_open):
    mock_image_open.return_value.convert.return_value = Mock()

    mock_load_model.side_effect = [
        (FakeProcessor(), FakeModel(["cat"])),
        (FakeProcessor(), FakeModel(["dog"]))
    ]

    isub.MODEL_NAMES[:] = ["model1", "model2"]

    result = isub.identify_subject(Path("fake.jpg"))

    assert result == "cat, dog"


@patch("process_photos.generate_gallery.identify_subject.Image.open")
@patch("process_photos.generate_gallery.identify_subject.load_model")
@patch("process_photos.generate_gallery.identify_subject.base_dir", Path("."))
def test_duplicate_labels_deduplicated(mock_load_model, mock_image_open):
    mock_image_open.return_value.convert.return_value = Mock()

    mock_load_model.side_effect = [
        (FakeProcessor(), FakeModel(["cat"])),
        (FakeProcessor(), FakeModel(["cat"]))
    ]

    isub.MODEL_NAMES[:] = ["model1", "model2"]

    result = isub.identify_subject(Path("fake.jpg"))

    assert result == "cat"


@patch("process_photos.generate_gallery.identify_subject.Image.open")
@patch("process_photos.generate_gallery.identify_subject.load_model")
@patch("process_photos.generate_gallery.identify_subject.base_dir", Path("."))
def test_model_failure_is_skipped(mock_load_model, mock_image_open):
    mock_image_open.return_value.convert.return_value = Mock()

    def side_effect(model_name):
        if model_name == "bad":
            raise RuntimeError("boom")
        return FakeProcessor(), FakeModel(["cat"])

    mock_load_model.side_effect = side_effect

    isub.MODEL_NAMES[:] = ["bad", "good"]

    result = isub.identify_subject(Path("fake.jpg"))

    assert result == "cat"


@patch("process_photos.generate_gallery.identify_subject.Image.open")
@patch("process_photos.generate_gallery.identify_subject.load_model")
@patch("process_photos.generate_gallery.identify_subject.base_dir", Path("."))
def test_all_models_fail_returns_empty_string(mock_load_model, mock_image_open):
    mock_image_open.return_value.convert.return_value = Mock()

    mock_load_model.side_effect = RuntimeError("boom")

    isub.MODEL_NAMES[:] = ["bad1", "bad2"]

    result = isub.identify_subject(Path("fake.jpg"))

    assert result == ""
