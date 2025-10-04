def safe_polygon_from_coords(coords):
    """Create a valid Shapely Polygon from a list of (lon, lat) coordinates.

    Args:
        coords (list): List of (lon, lat) tuples representing the polygon vertices.

    Returns:
        Polygon or None: A valid Shapely Polygon object, or None if invalid.
    """
    if not coords:
        return None
    if coords[0] != coords[-1]:
        coords = coords + [coords[0]]
    if len(coords) < 4:
        return None
    try:
        poly = Polygon(coords)
        if not poly.is_valid:
            return None
        return poly
    except Exception:
        return None

