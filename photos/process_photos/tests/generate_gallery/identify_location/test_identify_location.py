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

@patch("process_photos.generate_gallery.identify_location.identify_location.identify_pois")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_poi_appears_first(mock_get, mock_poi):
    mock_poi.return_value = ["at Mission Canyon"]
    mock_get.return_value = mock_nominatim_response({"city": "Santa Barbara"})
    result = il.identify_location(34.4, -119.7)
    assert result[0] == "at Mission Canyon"

@patch("process_photos.generate_gallery.identify_location.identify_location.identify_pois")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_nominatim_hierarchy_follows_pois(mock_get, mock_poi):
    mock_poi.return_value = ["at Mission Canyon"]
    mock_get.return_value = mock_nominatim_response({
        "city": "Santa Barbara",
        "county": "Santa Barbara County",
        "state": "California",
    })
    result = il.identify_location(34.4, -119.7)
    assert "in Santa Barbara" in result
    assert "in Santa Barbara County" in result
    assert "in California" in result
    assert result.index("at Mission Canyon") < result.index("in Santa Barbara")

@patch("process_photos.generate_gallery.identify_location.identify_location.identify_pois")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_nominatim_fallback_when_no_poi(mock_get, mock_poi):
    mock_poi.return_value = []
    mock_get.return_value = mock_nominatim_response({"city": "Santa Barbara"})
    result = il.identify_location(34.4, -119.7)
    assert result == ["in Santa Barbara"]

@patch("process_photos.generate_gallery.identify_location.identify_location.identify_pois")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_no_location_found_returns_empty_list(mock_get, mock_poi):
    mock_poi.return_value = []
    mock_get.return_value = mock_nominatim_response({})
    result = il.identify_location(0.0, 0.0)
    assert result == []

@patch("process_photos.generate_gallery.identify_location.identify_location.identify_pois")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_multiple_pois_all_included(mock_get, mock_poi):
    mock_poi.return_value = ["at Surfrider Beach", "near Malibu Pier"]
    mock_get.return_value = mock_nominatim_response({"city": "Malibu"})
    result = il.identify_location(34.0, -118.7)
    assert "at Surfrider Beach" in result
    assert "near Malibu Pier" in result
    assert "in Malibu" in result

@patch("process_photos.generate_gallery.identify_location.identify_location.identify_pois")
@patch("process_photos.generate_gallery.identify_location.identify_location.requests.get")
def test_nominatim_address_hierarchy_order(mock_get, mock_poi):
    mock_poi.return_value = []
    mock_get.return_value = mock_nominatim_response({
        "suburb": "Montecito",
        "city": "Santa Barbara",
        "county": "Santa Barbara County",
        "state": "California",
        "country": "United States",
    })
    result = il.identify_location(34.4, -119.7)
    in_items = [r for r in result if r.startswith("in ")]
    names = [r[3:] for r in in_items]
    # Should go from most specific to least specific
    assert names.index("Montecito") < names.index("Santa Barbara")
    assert names.index("Santa Barbara") < names.index("Santa Barbara County")
    assert names.index("Santa Barbara County") < names.index("California")