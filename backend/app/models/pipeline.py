from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.db.database import Base  # dùng chung declarative_base


class Pipeline(Base):
    __tablename__ = "pipelines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="idle")  # idle / running /success / fail
    created_at = Column(
        DateTime, default=lambda: datetime.now(UTC), server_default=func.now()
    )
