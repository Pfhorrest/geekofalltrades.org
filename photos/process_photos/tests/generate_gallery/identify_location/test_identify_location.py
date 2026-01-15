import pytest
from unittest.mock import patch, Mock

import process_photos.generate_gallery.identify_location as il


def mock_nominatim_response(address):
    resp = Mock()
    resp.raise_for_status.return_value = None
    resp.json.return_value = {"address": address}
    return resp


# ------------------------
# TESTS
# ------------------------

def test_cache_hit_skips_network():
    cache = {"1.00000,2.00000": ("Cached Place", "in")}

    result = il.identify_location(1.0, 2.0, location_cache=cache)

    assert result == ("Cached Place", "in")


@patch("process_photos.generate_gallery.identify_location.identify_location.identify_best_poi")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_poi_overrides_nominatim(mock_get, mock_poi):
    cache = {}

    mock_get.return_value = mock_nominatim_response({"city": "Santa Barbara"})
    mock_poi.return_value = ("Mission Canyon", "at")

    name, prefix = il.identify_location(
        34.4, -119.7, location_cache=cache
    )

    assert name == "Mission Canyon"
    assert prefix == "at"

    # Cache should be updated
    assert cache["34.40000,-119.70000"] == ("Mission Canyon", "at")


@patch("process_photos.generate_gallery.identify_location.identify_location.identify_best_poi")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_nominatim_fallback_when_no_poi(mock_get, mock_poi):
    cache = {}

    mock_poi.return_value = (None, None)
    mock_get.return_value = mock_nominatim_response({"city": "Santa Barbara"})

    name, prefix = il.identify_location(
        34.4, -119.7, location_cache=cache
    )

    assert name == "Santa Barbara"
    assert prefix == "in"

    assert cache["34.40000,-119.70000"] == ("Santa Barbara", "in")


@patch("process_photos.generate_gallery.identify_location.identify_location.identify_best_poi")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_no_location_found(mock_get, mock_poi):
    cache = {}

    mock_poi.return_value = (None, None)
    mock_get.return_value = mock_nominatim_response({})

    name, prefix = il.identify_location(
        0.0, 0.0, location_cache=cache
    )

    assert name is None
    assert prefix is None
    assert cache == {}


@patch("process_photos.generate_gallery.identify_location.identify_location.identify_best_poi")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_location_is_cached(mock_get, mock_poi):
    cache = {}

    mock_get.return_value = mock_nominatim_response({"city": "Santa Barbara"})
    mock_poi.return_value = (None, None)

    il.identify_location(34.4, -119.7, location_cache=cache)

    assert "34.40000,-119.70000" in cache
    assert cache["34.40000,-119.70000"] == ("Santa Barbara", "in")


@patch("process_photos.generate_gallery.identify_location.identify_location.identify_best_poi")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_no_cache_entry_when_no_location(mock_get, mock_poi):
    cache = {}

    mock_poi.return_value = (None, None)
    mock_get.return_value = mock_nominatim_response({})

    il.identify_location(0.0, 0.0, location_cache=cache)

    assert cache == {}
