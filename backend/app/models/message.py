import uuid
from datetime import datetime

from sqlalchemy import (UUID, Boolean, CheckConstraint, Column, DateTime,
                        Float, ForeignKey, Index, Integer, String, Text)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="CASCADE"), index=True
    )
    sender = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    __table_args__ = (
        CheckConstraint("sender IN ('user','assistant')", name="valid_name"),
        Index("idx_account_time", "account_id", "timestamp"),
    )
    account = relationship("Account", back_populates="messages")
