def safe_polygon_from_coords(coords):
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

