import uuid
from unittest.mock import patch, MagicMock
from app.models.account import Account
from app.models.asset_predictions import AssetPrediction
from app.models.message import Message
from app.api.asset_predictions import get_db, get_current_google_user
from app.main import app
from app.tests.conftest import (
    override_get_db_with_model,
    client,
    override_get_db_with_models,
)
from datetime import datetime
from uuid import uuid4

user_id = str(uuid4())


def init_mock():
    fake_account = Account(
        id=str(user_id),
        email="user@example.com",
        name="User",
        image="",
        password="",
        login_sessions=[],
    )
    fake_message = Message(
        sender="user", content="", account_id=user_id, timestamp="timetime"
    )
    fake_asset_prediction = AssetPrediction(
        id=1,
        name="bitcoin",
        current_value=100000,
        next_value=120000,
        expiration_time="1H",
        status="pending",
        account_id=user_id,
    )
    # Đúng thứ tự: account trước, message sau
    app.dependency_overrides[get_db] = override_get_db_with_models(
        fake_account, fake_message, fake_asset_prediction
    )
    app.dependency_overrides[get_current_google_user] = lambda: {
        "id": 1,
        "email": "hothinh0019@gmail.com",
    }


@patch("app.api.asset_predictions.rdBase")
def test_create_asset_success(mock_rdBase):
    init_mock()
    response = client.post(
        "/api/asset-predictions",
        json={
            "name": "bitcoin",
            "current_value": 100000,
            "next_value": 120000,
            "expiration_time": "1H",
            "status": "pending",
            "account_id": user_id,
        },
    )
    data = response.json()
    print("response.status_code:", response.status_code)
    print("response.json():", response.json())
    assert response.status_code == 200


@patch("app.api.asset_predictions.rdBase")
def test_create_asset_fail(mock_rdBase):
    init_mock()
    response = client.post(
        "/api/asset-predictions",
        json={
            "name": "bitcoin",
            "current_value": 100000,
            "next_value": 120000,
            "expiration_time": "1H",
            "status": "pending",
            "account_id": user_id + "222",
        },
    )
    assert response.status_code == 500
