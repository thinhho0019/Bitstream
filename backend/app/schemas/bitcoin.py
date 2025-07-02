from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BitcoinBase(BaseModel):
    price: float
class BitcoinCreate(BitcoinBase):
    pass
class BitcoinOut(BitcoinBase):
    timestamp: datetime
    class Config:
        from_attributes = True

