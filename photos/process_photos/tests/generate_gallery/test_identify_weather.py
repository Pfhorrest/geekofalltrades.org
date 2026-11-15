from datetime import datetime
from argparse import Namespace
from unittest.mock import patch

import pytest

from process_photos.generate_gallery.identify_weather import identify_weather


@pytest.fixture
def api_response():
    """Return a successful Open-Meteo response with one code per hour."""
    return {
        "hourly": {
            "weather_code": [0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65,
                             71, 73, 75, 80, 81, 82, 95, 96, 99, 999, 0, 0]
        }
    }


@pytest.fixture
def mocked_runtime():
    """Prevent real network requests, sleeps, and console output."""
    with (
        patch(
            "process_photos.generate_gallery.identify_weather.requests.get"
        ) as mock_get,
        patch(
            "process_photos.generate_gallery.identify_weather.time.sleep"
        ) as mock_sleep,
        patch(
            "process_photos.generate_gallery.identify_weather.time.monotonic",
            return_value=100.0,
        ),
        patch(
            "process_photos.generate_gallery.identify_weather.tqdm.write"
        ) as mock_write,
    ):
        yield mock_get, mock_sleep, mock_write


def make_response(payload):
    response = Namespace(
        json=lambda: payload,
        raise_for_status=lambda: None,
    )
    return response


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
def test_identifies_all_supported_weather_codes(
    weather_code, expected, mocked_runtime, api_response
):
    mock_get, _, mock_write = mocked_runtime
    api_response["hourly"]["weather_code"][14] = weather_code
    mock_get.return_value = make_response(api_response)

    result = identify_weather(34.4, -119.3, "2024-06-15T14:30:00")

    assert result == expected
    assert any(expected in str(call.args[0]) for call in mock_write.call_args_list)


def test_accepts_datetime_objects_and_requests_the_correct_date(
    mocked_runtime, api_response
):
    mock_get, _, _ = mocked_runtime
    mock_get.return_value = make_response(api_response)

    result = identify_weather(
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


def test_uses_the_photo_hour_not_the_minute(
    mocked_runtime, api_response
):
    mock_get, _, _ = mocked_runtime
    api_response["hourly"]["weather_code"][14] = 65
    mock_get.return_value = make_response(api_response)

    assert identify_weather(
        34.4, -119.3, "2024-06-15T14:59:59"
    ) == "Heavy Rain"


def test_returns_none_for_an_unmapped_weather_code(
    mocked_runtime, api_response
):
    mock_get, _, mock_write = mocked_runtime
    api_response["hourly"]["weather_code"][14] = 999
    mock_get.return_value = make_response(api_response)

    assert identify_weather(
        34.4, -119.3, "2024-06-15T14:00:00"
    ) is None
    assert not any(
        "WEATHER" in str(call.args[0]) for call in mock_write.call_args_list
    )


def test_uses_normal_rate_limit_by_default(mocked_runtime, api_response):
    mock_get, mock_sleep, _ = mocked_runtime
    mock_get.return_value = make_response(api_response)
    state = {}

    identify_weather(34.4, -119.3, "2024-06-15T14:00:00", state)

    mock_sleep.assert_called_once_with(1)
    assert state["last_run"]["openmeteo"] == 100.0


def test_uses_retroactive_rate_limit_from_state_args(
    mocked_runtime, api_response
):
    mock_get, mock_sleep, _ = mocked_runtime
    mock_get.return_value = make_response(api_response)
    state = {"args": Namespace(retroactive=True)}

    identify_weather(34.4, -119.3, "2024-06-15T14:00:00", state)

    mock_sleep.assert_called_once_with(pytest.approx(8.64))


def test_rate_limit_accounts_for_time_since_previous_call(
    mocked_runtime, api_response
):
    mock_get, mock_sleep, _ = mocked_runtime
    mock_get.return_value = make_response(api_response)
    state = {
        "last_run": {"openmeteo": 99.5},
    }

    identify_weather(34.4, -119.3, "2024-06-15T14:00:00", state)

    mock_sleep.assert_called_once_with(pytest.approx(0.5))


def test_does_not_sleep_when_rate_limit_interval_has_elapsed(
    mocked_runtime, api_response
):
    mock_get, mock_sleep, _ = mocked_runtime
    mock_get.return_value = make_response(api_response)
    state = {
        "last_run": {"openmeteo": 98.0},
    }

    identify_weather(34.4, -119.3, "2024-06-15T14:00:00", state)

    mock_sleep.assert_called_once_with(0.0)


@pytest.mark.parametrize(
    "failure",
    [
        RuntimeError("request failed"),
        ValueError("invalid JSON"),
        KeyError("hourly"),
        IndexError("hour unavailable"),
    ],
)
def test_api_or_response_failures_return_none_and_update_state(
    mocked_runtime, failure
):
    mock_get, _, mock_write = mocked_runtime
    mock_get.side_effect = failure
    state = {}

    result = identify_weather(
        34.4, -119.3, "2024-06-15T14:00:00", state
    )

    assert result is None
    assert state["last_run"]["openmeteo"] == 100.0
    assert any("Error retrieving weather" in str(call.args[0])
               for call in mock_write.call_args_list)


def test_invalid_timestamp_is_rejected_before_request(mocked_runtime):
    mock_get, _, _ = mocked_runtime

    with pytest.raises(ValueError):
        identify_weather(34.4, -119.3, "not-a-timestamp")

    mock_get.assert_not_called()