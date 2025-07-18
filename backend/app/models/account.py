from sqlalchemy import Column, Float, DateTime, Integer, String
from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy.orm import relationship

class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    image = Column(String, default="")
    provider = Column(String, default="google")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    #one to many asset predictions
    asset_predictions = relationship("AssetPrediction", back_populates="account")