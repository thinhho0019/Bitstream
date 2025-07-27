from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AccountBase(BaseModel):
    image: str
    name: str
    email: str
    password: Optional[str] = None
    provider: str


class AccountCreate(AccountBase):
    pass


class AccountOut(AccountBase):
    class Config:
        from_attributes = True


class AccountGetInforOut(BaseModel):
    name: str
    image: str
    email: str
