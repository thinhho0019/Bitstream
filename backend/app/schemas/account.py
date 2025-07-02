from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AccountBase(BaseModel):
    image: str
    name: str
    email: str
    provider: str


class AccountCreate(AccountBase):
    pass
class AccountOut(AccountBase):
    id: int
    class Config:
        from_attributes = True
