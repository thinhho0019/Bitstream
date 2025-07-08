from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssetPredictionBase(BaseModel):
    name: str
    current_value: float
    next_value: float
    status: str
    expiration_time: str


class AssetPredictionCreate(AssetPredictionBase):
    account_id: int


class AssetPredictionOut(AssetPredictionBase):
    id:int
    end_time: datetime
    class Config:
        from_attributes = True
