import pytest
from shapely.geometry import Polygon
from unittest.mock import patch, Mock

from process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi import identify_best_poi


@pytest.fixture
def mock_overpass_response():
    return {
        "elements": []
    }


def mock_post_with(data):
    mock_resp = Mock()
    mock_resp.json.return_value = data
    mock_resp.raise_for_status.return_value = None
    return mock_resp


@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.requests.post")
def test_overpass_error_returns_none(mock_post, _):
    mock_post.side_effect = Exception("boom")

    name, prefix = identify_best_poi(0, 0)
    assert name is None
    assert prefix is None


@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.requests.post")
def test_containing_way_wins(mock_post, _):
    # Square around (0,0)
    geometry = [
        {"lat": -0.001, "lon": -0.001},
        {"lat": -0.001, "lon": 0.001},
        {"lat": 0.001, "lon": 0.001},
        {"lat": 0.001, "lon": -0.001},
    ]

    mock_post.return_value = mock_post_with({
        "elements": [
            {
                "type": "way",
                "tags": {"name": "Test Park"},
                "geometry": geometry
            }
        ]
    })

    name, prefix = identify_best_poi(0, 0)
    assert name == "Test Park"
    assert prefix == "at"


@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.requests.post")
def test_relation_containment_excludes_inner_hole(mock_post, _):
    outer = [
        {"lat": -0.01, "lon": -0.01},
        {"lat": -0.01, "lon": 0.01},
        {"lat": 0.01, "lon": 0.01},
        {"lat": 0.01, "lon": -0.01},
    ]

    inner = [
        {"lat": -0.001, "lon": -0.001},
        {"lat": -0.001, "lon": 0.001},
        {"lat": 0.001, "lon": 0.001},
        {"lat": 0.001, "lon": -0.001},
    ]

    mock_post.return_value = mock_post_with({
        "elements": [
            {
                "type": "relation",
                "tags": {"name": "Big Reserve"},
                "members": [
                    {"role": "outer", "geometry": outer},
                    {"role": "inner", "geometry": inner},
                ]
            }
        ]
    })

    # Inside the hole → should NOT match CONTAINMENT, but maybe distance
    name, prefix = identify_best_poi(0, 0)
    assert prefix is not "at"

@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.requests.post")
def test_distance_fallback_node(mock_post, _):
    mock_post.return_value = mock_post_with({
        "elements": [
            {
                "type": "node",
                "lat": 0.001,
                "lon": 0.001,
                "tags": {"name": "Nearby Statue"}
            }
        ]
    })

    name, prefix = identify_best_poi(0, 0)
    assert name == "Nearby Statue"
    assert prefix == "near"


@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_best_poi.identify_best_poi.requests.post")
def test_empty_response_returns_none(mock_post, _):
    mock_post.return_value = mock_post_with({"elements": []})

    name, prefix = identify_best_poi(0, 0)
    assert name is None
    assert prefix is None
