from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base  # Giả sử bạn có Base trong database.py

class AssetPrediction(Base):
    __tablename__ = "asset_predictions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Tên tài sản (bitcoin, etc.)
    current_value = Column(Float, nullable=False)
    next_value = Column(Float, nullable=False)
    expiration_time = Column(String, nullable=False)  # Ví dụ: "1H"
    status = Column(String, nullable=False, default="pending")  # pending, success, fail
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime)
    #one to many account with asset_predictions
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    account = relationship("Account", back_populates="asset_predictions")
