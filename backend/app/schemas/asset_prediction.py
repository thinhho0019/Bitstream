from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AssetPredictionBase(BaseModel):
    name: str
    current_value: float
    next_value: float
    status: str
    expiration_time: str


class AssetPredictionCreate(AssetPredictionBase):
    account_id: str


class AssetPredictionOut(AssetPredictionBase):
    id: int
    end_time: datetime

    class Config:
        from_attributes = True
