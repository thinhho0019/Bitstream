from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel


class PipelineBase(BaseModel):
    name: str
    description: Optional[str] = None


class PipelineCreate(PipelineBase):
    pass


class PipelineOut(PipelineBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
