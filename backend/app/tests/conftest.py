import pytest
from unittest.mock import MagicMock
import sys
from fastapi.testclient import TestClient
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from app.main import app
from app.api.account import get_current_google_user
from app.models.account import Account
from app.models.message import Message
from app.models.asset_predictions import AssetPrediction

client = TestClient(app)


# Chỉ định function để gọi override
def override_get_db_with_model(model_instance):
    def override_get_db():
        db = MagicMock()
        # Mock các thao tác thường dùng trong SQLAlchemy session
        db.add = MagicMock()
        db.add_all = MagicMock()
        db.commit = MagicMock()
        db.refresh = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = model_instance

        yield db

    return override_get_db


def override_get_db_with_models(account: Account, message: Message, asset: AssetPrediction):
    def override_get_db():
        db = MagicMock()

        def query(model):
            query_mock = MagicMock()
            print(model)
            if model == Account:
                query_mock.filter.return_value.first.return_value = account
            elif model == Message:
                query_mock.filter.return_value.first.return_value = message
            elif model == AssetPrediction:
                query_mock.filter.return_value.first.return_value = asset
            else:
                query_mock.filter.return_value.first.return_value = None
            return query_mock

        def refresh(model):
            # ✅ Đây là phần giả lập gán id từ DB
            if isinstance(model, AssetPrediction):
                model.id = 1

        db.query.side_effect = query
        db.refresh.side_effect = refresh
        db.add = MagicMock()  # <- Ngăn add thật
        db.add_all = MagicMock()
        db.commit = MagicMock()  # <- Ngăn commit thật

        yield db

    return override_get_db


@pytest.fixture(scope="function")
def override_current_user():
    def override():
        return {"id": "fake-id", "email": "fake@example.com"}

    app.dependency_overrides.clear()
    app.dependency_overrides[get_current_google_user] = override
    yield
    app.dependency_overrides.clear()
