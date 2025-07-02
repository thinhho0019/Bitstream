from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssetPredictionBase(BaseModel):
    name: str
    current_value: float
    next_value: float
    expiration_time: str
    status: str


class AssetPredictionCreate(AssetPredictionBase):
    account_id: int


class AssetPredictionOut(AssetPredictionBase):
    created_at: datetime
    end_time: datetime
    class Config:
        from_attributes = True
