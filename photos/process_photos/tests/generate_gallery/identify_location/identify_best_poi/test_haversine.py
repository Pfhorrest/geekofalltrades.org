import math
from process_photos.generate_gallery.identify_location.identify_best_poi.haversine import haversine


def test_zero_distance():
    assert haversine(0, 0, 0, 0) == 0


def test_known_distance_equator():
    # 1 degree of longitude at equator ≈ 111,319 meters
    d = haversine(0, 0, 0, 1)
    assert math.isclose(d, 111_319, rel_tol=0.01)


def test_distance_is_symmetric():
    d1 = haversine(34.0, -120.0, 35.0, -121.0)
    d2 = haversine(35.0, -121.0, 34.0, -120.0)
    assert math.isclose(d1, d2)
