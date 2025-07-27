import uuid

from sqlalchemy import UUID, Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Account(Base):
    __tablename__ = "accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String(100), default="")
    name = Column(String)
    image = Column(String, default="")
    provider = Column(String, default="google")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    asset_predictions = relationship("AssetPrediction", back_populates="account")
    login_sessions = relationship("LoginSession", back_populates="account")
    email_verifications = relationship(
        "EmailVerificationToken", back_populates="account", cascade="all, delete-orphan"
    )
    messages = relationship(
        "Message", back_populates="account", cascade="all, delete-orphan"
    )
