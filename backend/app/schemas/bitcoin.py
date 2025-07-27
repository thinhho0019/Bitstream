from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BitcoinBase(BaseModel):
    price: float


class BitcoinCreate(BitcoinBase):
    pass


class BitcoinOut(BitcoinBase):
    timestamp: datetime

    class Config:
        from_attributes = True
