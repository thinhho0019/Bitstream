from sqlalchemy import Column, Float, DateTime, Integer, String, Boolean
from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy.orm import relationship

class Account(Base):
    __tablename__ = "accounts"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    image = Column(String, default="")
    provider = Column(String, default="google")
    refresh_token = Column(String, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    verify = Column(Boolean, default=False)
    #one to many asset predictions
    asset_predictions = relationship("AssetPrediction", back_populates="account")
    email_verifications = relationship("EmailVerificationToken", back_populates="account", cascade="all, delete-orphan")
