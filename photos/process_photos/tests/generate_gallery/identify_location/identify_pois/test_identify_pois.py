import pytest
from unittest.mock import patch, Mock
from process_photos.generate_gallery.identify_location.identify_pois.identify_pois import identify_pois

def mock_post_with(data):
    mock_resp = Mock()
    mock_resp.json.return_value = data
    mock_resp.raise_for_status.return_value = None
    return mock_resp

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_overpass_error_returns_empty_list(mock_post, _):
    mock_post.side_effect = Exception("boom")
    result = identify_pois(0, 0)
    assert result == []

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_empty_response_returns_empty_list(mock_post, _):
    mock_post.return_value = mock_post_with({"elements": []})
    result = identify_pois(0, 0)
    assert result == []

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_containing_way_prefixed_at(mock_post, _):
    geometry = [
        {"lat": -0.001, "lon": -0.001},
        {"lat": -0.001, "lon":  0.001},
        {"lat":  0.001, "lon":  0.001},
        {"lat":  0.001, "lon": -0.001},
    ]
    mock_post.return_value = mock_post_with({
        "elements": [{"type": "way", "tags": {"name": "Test Park"}, "geometry": geometry}]
    })
    result = identify_pois(0, 0)
    assert result == ["at Test Park"]

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_non_containing_way_prefixed_near(mock_post, _):
    geometry = [
        {"lat": 0.01, "lon": 0.01},
        {"lat": 0.01, "lon": 0.02},
        {"lat": 0.02, "lon": 0.02},
        {"lat": 0.02, "lon": 0.01},
    ]
    mock_post.return_value = mock_post_with({
        "elements": [{"type": "way", "tags": {"name": "Distant Park"}, "geometry": geometry}]
    })
    result = identify_pois(0, 0)
    assert len(result) == 1
    assert result[0].startswith("near ")

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_containing_before_non_containing(mock_post, _):
    containing_geometry = [
        {"lat": -0.001, "lon": -0.001},
        {"lat": -0.001, "lon":  0.001},
        {"lat":  0.001, "lon":  0.001},
        {"lat":  0.001, "lon": -0.001},
    ]
    nearby_geometry = [
        {"lat": 0.01, "lon": 0.01},
        {"lat": 0.01, "lon": 0.02},
        {"lat": 0.02, "lon": 0.02},
        {"lat": 0.02, "lon": 0.01},
    ]
    mock_post.return_value = mock_post_with({
        "elements": [
            {"type": "way", "tags": {"name": "Nearby Park"}, "geometry": nearby_geometry},
            {"type": "way", "tags": {"name": "Containing Park"}, "geometry": containing_geometry},
        ]
    })
    result = identify_pois(0, 0)
    assert result[0] == "at Containing Park"
    assert result[1].startswith("near ")

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_containing_sorted_smallest_first(mock_post, _):
    small = [
        {"lat": -0.001, "lon": -0.001},
        {"lat": -0.001, "lon":  0.001},
        {"lat":  0.001, "lon":  0.001},
        {"lat":  0.001, "lon": -0.001},
    ]
    large = [
        {"lat": -0.01, "lon": -0.01},
        {"lat": -0.01, "lon":  0.01},
        {"lat":  0.01, "lon":  0.01},
        {"lat":  0.01, "lon": -0.01},
    ]
    mock_post.return_value = mock_post_with({
        "elements": [
            {"type": "way", "tags": {"name": "Large Park"}, "geometry": large},
            {"type": "way", "tags": {"name": "Small Park"}, "geometry": small},
        ]
    })
    result = identify_pois(0, 0)
    assert result[0] == "at Small Park"
    assert result[1] == "at Large Park"

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_non_containing_sorted_nearest_first(mock_post, _):
    near_geometry = [
        {"lat": 0.005, "lon": 0.005},
        {"lat": 0.005, "lon": 0.006},
        {"lat": 0.006, "lon": 0.006},
        {"lat": 0.006, "lon": 0.005},
    ]
    far_geometry = [
        {"lat": 0.05, "lon": 0.05},
        {"lat": 0.05, "lon": 0.06},
        {"lat": 0.06, "lon": 0.06},
        {"lat": 0.06, "lon": 0.05},
    ]
    mock_post.return_value = mock_post_with({
        "elements": [
            {"type": "way", "tags": {"name": "Far Park"}, "geometry": far_geometry},
            {"type": "way", "tags": {"name": "Near Park"}, "geometry": near_geometry},
        ]
    })
    result = identify_pois(0, 0)
    assert result[0] == "near Near Park"
    assert result[1] == "near Far Park"

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_relation_containment_excludes_inner_hole(mock_post, _):
    outer = [
        {"lat": -0.01, "lon": -0.01},
        {"lat": -0.01, "lon":  0.01},
        {"lat":  0.01, "lon":  0.01},
        {"lat":  0.01, "lon": -0.01},
    ]
    inner = [
        {"lat": -0.001, "lon": -0.001},
        {"lat": -0.001, "lon":  0.001},
        {"lat":  0.001, "lon":  0.001},
        {"lat":  0.001, "lon": -0.001},
    ]
    mock_post.return_value = mock_post_with({
        "elements": [{
            "type": "relation",
            "tags": {"name": "Big Reserve"},
            "members": [
                {"role": "outer", "geometry": outer},
                {"role": "inner", "geometry": inner},
            ]
        }]
    })
    # Point is inside the hole, so should NOT be "at"
    result = identify_pois(0, 0)
    assert not any(r.startswith("at ") for r in result)

@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.time.sleep")
@patch("process_photos.generate_gallery.identify_location.identify_pois.identify_pois.requests.post")
def test_node_prefixed_near(mock_post, _):
    mock_post.return_value = mock_post_with({
        "elements": [{
            "type": "node",
            "lat": 0.001,
            "lon": 0.001,
            "tags": {"name": "Nearby Statue"}
        }]
    })
    result = identify_pois(0, 0)
    assert result == ["near Nearby Statue"]