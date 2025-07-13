from sqlalchemy import Column, Float, DateTime, Integer, String, Boolean,UUID
from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy.orm import relationship
import uuid
class Account(Base):
    __tablename__ = "accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String(100), default="")
    name = Column(String)
    image = Column(String, default="")
    provider = Column(String, default="google")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    #one to many asset predictions
    asset_predictions = relationship("AssetPrediction", back_populates="account")
    login_session = relationship("LoginSession", back_populates="account")
    email_verifications = relationship("EmailVerificationToken", back_populates="account", cascade="all, delete-orphan")
