from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from datetime import datetime, timezone

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

