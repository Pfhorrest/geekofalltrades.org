import pytest
from unittest.mock import patch, Mock
from datetime import datetime

import process_photos.generate_gallery.identify_weather as iw


def mock_openmeteo_response(weather_codes):
    resp = Mock()
    resp.raise_for_status.return_value = None
    resp.json.return_value = {"hourly": {"weather_code": weather_codes}}
    return resp


# ------------------------
# TESTS
# ------------------------

@pytest.mark.parametrize(
    ("weather_code", "expected"),
    [
        (0, "Clear"),
        (1, "Mainly Clear"),
        (2, "Partly Cloudy"),
        (3, "Overcast"),
        (45, "Foggy"),
        (48, "Depositing Rime Fog"),
        (51, "Light Drizzle"),
        (53, "Moderate Drizzle"),
        (55, "Dense Drizzle"),
        (61, "Slight Rain"),
        (63, "Moderate Rain"),
        (65, "Heavy Rain"),
        (71, "Slight Snow"),
        (73, "Moderate Snow"),
        (75, "Heavy Snow"),
        (80, "Slight Rain Showers"),
        (81, "Moderate Rain Showers"),
        (82, "Violent Rain Showers"),
        (95, "Thunderstorm"),
        (96, "Thunderstorm with Hail"),
        (99, "Thunderstorm with Heavy Hail"),
    ],
)
@patch("process_photos.generate_gallery.identify_weather.tqdm.write")
@patch("process_photos.generate_gallery.identify_weather.time.sleep")
@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_identifies_all_supported_weather_codes(
    mock_get, mock_sleep, mock_write, weather_code, expected
):
    weather_codes = [0] * 24
    weather_codes[14] = weather_code
    mock_get.return_value = mock_openmeteo_response(weather_codes)

    result = iw.identify_weather(34.4, -119.3, "2024-06-15T14:30:00")

    assert result == expected
    assert any(expected in str(call.args[0]) for call in mock_write.call_args_list)


@patch("process_photos.generate_gallery.identify_weather.time.sleep")
@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_accepts_datetime_objects_and_requests_the_correct_date(mock_get, mock_sleep):
    weather_codes = [0] * 24
    weather_codes[14] = 75
    mock_get.return_value = mock_openmeteo_response(weather_codes)

    result = iw.identify_weather(
        34.4, -119.3, datetime(2024, 6, 15, 14, 30)
    )

    assert result == "Heavy Snow"
    mock_get.assert_called_once_with(
        "https://archive-api.open-meteo.com/v1/archive",
        params={
            "latitude": 34.4,
            "longitude": -119.3,
            "start_date": "2024-06-15",
            "end_date": "2024-06-15",
            "hourly": "weather_code",
            "timezone": "auto",
        },
        timeout=10,
    )


@patch("process_photos.generate_gallery.identify_weather.time.sleep")
@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_uses_the_photo_hour_not_the_minute(mock_get, mock_sleep):
    weather_codes = [0] * 24
    weather_codes[14] = 65
    mock_get.return_value = mock_openmeteo_response(weather_codes)

    result = iw.identify_weather(34.4, -119.3, "2024-06-15T14:59:59")

    assert result == "Heavy Rain"


@patch("process_photos.generate_gallery.identify_weather.tqdm.write")
@patch("process_photos.generate_gallery.identify_weather.time.sleep")
@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_returns_none_for_an_unmapped_weather_code(mock_get, mock_sleep, mock_write):
    weather_codes = [0] * 24
    weather_codes[14] = 999
    mock_get.return_value = mock_openmeteo_response(weather_codes)

    result = iw.identify_weather(34.4, -119.3, "2024-06-15T14:00:00")

    assert result is None
    assert not any(
        "WEATHER" in str(call.args[0]) for call in mock_write.call_args_list
    )


# ------------------------
# RATE-LIMIT TESTS
# ------------------------

@pytest.mark.parametrize(
    ("retroactive", "last_run", "now", "expected_sleep"),
    [
        (None, None, 100.0, 1.0),    # Default interval, no previous call
        (False, None, 100.0, 1.0),   # Normal interval, no previous call
        (False, 99.5, 100.0, 0.5),   # Normal interval, partially elapsed
        (False, 98.0, 100.0, 0.0),   # Normal interval, fully elapsed
        (True, None, 100.0, 8.64),   # Retroactive interval, no previous call
        (True, 95.0, 100.0, 3.64),   # Retroactive interval, partially elapsed
    ],
)
@patch("process_photos.generate_gallery.identify_weather.time.sleep")
@patch("process_photos.generate_gallery.identify_weather.time.monotonic")
@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_openmeteo_rate_limit(
    mock_get, mock_monotonic, mock_sleep,
    retroactive, last_run, now, expected_sleep
):
    mock_get.return_value = mock_openmeteo_response([0] * 24)
    mock_monotonic.return_value = now

    state = {}
    if retroactive is not None:
        state["args"] = Mock(retroactive=retroactive)
    if last_run is not None:
        state["last_run"] = {"openmeteo": last_run}

    iw.identify_weather(34.4, -119.3, "2024-06-15T14:00:00", state)

    mock_sleep.assert_called_once()
    assert mock_sleep.call_args.args[0] == pytest.approx(expected_sleep)
    assert state["last_run"]["openmeteo"] == now


@pytest.mark.parametrize(
    "failure",
    [
        RuntimeError("request failed"),
        ValueError("invalid JSON"),
        KeyError("hourly"),
        IndexError("hour unavailable"),
    ],
)
@patch("process_photos.generate_gallery.identify_weather.tqdm.write")
@patch("process_photos.generate_gallery.identify_weather.time.monotonic")
@patch("process_photos.generate_gallery.identify_weather.time.sleep")
@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_api_or_response_failures_return_none_and_update_state(
    mock_get, mock_sleep, mock_monotonic, mock_write, failure
):
    if isinstance(failure, RuntimeError):
        mock_get.side_effect = failure
    else:
        response = Mock()
        response.raise_for_status.return_value = None
        if isinstance(failure, ValueError):
            response.json.side_effect = failure
        elif isinstance(failure, KeyError):
            response.json.return_value = {}
        else:
            response.json.return_value = {"hourly": {"weather_code": []}}
        mock_get.return_value = response

    mock_monotonic.return_value = 100.0
    state = {}

    result = iw.identify_weather(
        34.4, -119.3, "2024-06-15T14:00:00", state
    )

    assert result is None
    assert state["last_run"]["openmeteo"] == 100.0
    assert any(
        "Error retrieving weather" in str(call.args[0])
        for call in mock_write.call_args_list
    )


@patch("process_photos.generate_gallery.identify_weather.requests.get")
def test_invalid_timestamp_is_rejected_before_request(mock_get):
    with pytest.raises(ValueError):
        iw.identify_weather(34.4, -119.3, "not-a-timestamp")

    mock_get.assert_not_called()
