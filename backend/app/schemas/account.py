from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AccountBase(BaseModel):
    image: str
    name: str
    email: str
    provider: str
    id: str


class AccountCreate(AccountBase):
    refresh_token: str


class AccountOut(AccountBase):
    class Config:
        from_attributes = True
