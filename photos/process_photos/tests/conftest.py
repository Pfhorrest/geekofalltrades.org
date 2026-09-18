import pytest

@pytest.fixture(autouse=True)
def isolated_base_dir(tmp_path, monkeypatch):
    """
    Patches base_dir to a fresh tmp_path for every test, automatically —
    no test has to remember to do this itself.
    """
    monkeypatch.setattr("process_photos.config.base_dir", tmp_path)
    return tmp_path