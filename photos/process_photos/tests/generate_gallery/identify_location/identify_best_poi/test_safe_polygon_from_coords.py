from process_photos.generate_gallery.identify_location.identify_best_poi.safe_polygon_from_coords import safe_polygon_from_coords


def test_empty_coords():
    assert safe_polygon_from_coords([]) is None


def test_too_few_points():
    coords = [(0, 0), (1, 0)]
    assert safe_polygon_from_coords(coords) is None


def test_auto_closes_polygon():
    coords = [
        (0, 0),
        (1, 0),
        (1, 1),
        (0, 1),
    ]
    poly = safe_polygon_from_coords(coords)
    assert poly is not None
    assert poly.exterior.coords[0] == poly.exterior.coords[-1]


def test_valid_polygon():
    coords = [
        (0, 0),
        (2, 0),
        (2, 2),
        (0, 2),
        (0, 0),
    ]
    poly = safe_polygon_from_coords(coords)
    assert poly is not None
    assert poly.is_valid


def test_invalid_polygon_returns_none():
    # Self-intersecting "bowtie"
    coords = [
        (0, 0),
        (2, 2),
        (0, 2),
        (2, 0),
        (0, 0),
    ]
    assert safe_polygon_from_coords(coords) is None
