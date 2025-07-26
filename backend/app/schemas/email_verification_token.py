from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EmailVerificationTokenBase(BaseModel):
    token: str
    expires_at: datetime
    created_at: datetime


class EmailVerificationTokenCreate(EmailVerificationTokenBase):
    pass


class EmailVerificationTokenOut(EmailVerificationTokenBase):
    class Config:
        from_attributes = True
