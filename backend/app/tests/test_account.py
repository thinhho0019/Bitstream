from unittest.mock import patch

from app.models.account import Account
from app.api.account import get_db, get_current_google_user
from app.main import app
from app.tests.conftest import override_get_db_with_model, client


def init_mock():
    fake_account = Account(id=1, email="user@example.com", name="User", image="", password="", login_sessions=[])
    app.dependency_overrides[get_db] = override_get_db_with_model(fake_account)
    app.dependency_overrides[get_current_google_user] = lambda: {"id": 1, "email": "hothinh0019@gmail.com"}


@patch("app.api.account.verify_password")
@patch("app.api.account.create_access_token")
@patch("app.api.account.create_refresh_token")
def test_login_account_success(mock_create_refresh, mock_create_access, mock_verify_pass):
    init_mock()
    # Setup các mock
    mock_verify_pass.return_value = True
    mock_create_access.return_value = "access_token_example"
    mock_create_refresh.return_value = "refresh_token_example"

    response = client.post("/api/login", json={"email": "user@example.com", "password": "123456",
                                               "finger_print": "uahwduawdawdfawfawf"})

    assert response.status_code == 200
    assert response.json()["access_token"] == "access_token_example"


@patch("app.api.account.verify_password")
@patch("app.api.account.create_access_token")
@patch("app.api.account.create_refresh_token")
def test_login_account_fail_miss_param(mock_create_refresh, mock_create_access, mock_verify_pass):
    init_mock()
    # Setup các mock
    mock_verify_pass.return_value = True
    mock_create_access.return_value = "access_token_example"
    mock_create_refresh.return_value = "refresh_token_example"

    # fake_user = create_fake_user()
    # mock_get_db.return_value = create_mock_db(fake_user)

    response = client.post("/api/login", json={"email": "user@example.com", "password": ""})

    assert response.status_code == 422


@patch("app.api.account.verify_password")
@patch("app.api.account.create_access_token")
@patch("app.api.account.create_refresh_token")
def test_login_account_fail(mock_create_refresh, mock_create_access, mock_verify_pass):
    init_mock()
    # Setup các mock
    mock_verify_pass.return_value = False
    mock_create_access.return_value = "access_token_example"
    mock_create_refresh.return_value = "refresh_token_example"

    response = client.post("/api/login", json={"email": "user@example.com", "password": "123456",
                                               "finger_print": "uahwduawdawdfawfawf"})

    assert response.status_code == 400


def test_get_infor_user_success():
    init_mock()
    response = client.get("/api/get-infor-user")

    assert response.status_code == 200
    assert response.json()['email'] == "user@example.com"


def test_create_account_success():
    init_mock()
    response = client.post("/api/accounts", json={
        "image": "",
        "name": "thinhho",
        "email": "example@gmail.com",
        "password": "",
        "provider": "google"
    })
    assert response.status_code == 201


def test_create_account_exists_not_verify():
    init_mock()
    response = client.post("/api/accounts", json={
        "image": "",
        "name": "thinhho",
        "email": "user@example.com",
        "password": "",
        "provider": "email"
    })
    assert response.status_code == 400


def test_create_account_exists():
    init_mock()
    response = client.post("/api/accounts", json={
        "image": "",
        "name": "thinhho",
        "email": "user@example.com",
        "password": "",
        "provider": "email"
    })
    assert response.status_code == 400
