import uuid
from unittest.mock import patch, MagicMock

from app.models.account import Account
from app.models.message import Message
from app.api.chatbox import get_db, get_current_google_user
from app.main import app
from app.tests.conftest import (
    override_get_db_with_model,
    client,
    override_get_db_with_models,
)

from uuid import uuid4

user_id = str(uuid4())


def init_mock():
    fake_account = Account(
        id=1,
        email="user@example.com",
        name="User",
        image="",
        password="",
        login_sessions=[],
    )
    fake_message = Message(
        sender="user", content="", account_id=user_id, timestamp="timetime"
    )
    # Đúng thứ tự: account trước, message sau
    app.dependency_overrides[get_db] = override_get_db_with_models(
        fake_account, fake_message, None
    )
    app.dependency_overrides[get_current_google_user] = lambda: {
        "id": 1,
        "email": "hothinh0019@gmail.com",
    }


@patch("app.api.chatbox.qa_system.ask")
def test_ask_chat_box_success(mock_qa_ask):
    init_mock()
    mock_qa_ask.return_value = "oke oke good job "

    json_data_ask = {"message": "bitcoin dang gia bao nhieu", "user_id": user_id}
    response = client.post("/api/assistants/bitcoin", json=json_data_ask)
    assert response.status_code == 200


@patch("app.api.chatbox.qa_system.ask")
def test_ask_chat_box_fail_missing(mock_qa_ask):
    init_mock()
    mock_qa_ask.return_value = "oke oke good job "

    json_data_ask = {
        "message": "bitcoin dang gia bao nhieu",
    }
    response = client.post("/api/assistants/bitcoin", json=json_data_ask)
    assert response.status_code == 422
