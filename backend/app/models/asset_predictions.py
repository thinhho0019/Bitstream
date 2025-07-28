from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.sql import func
from uuid import UUID as UUIDType
from datetime import datetime

from app.db.database import Base
from app.models.account import Account


class AssetPrediction(Base):
    __tablename__ = "asset_predictions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    current_value: Mapped[float] = mapped_column(Float, nullable=False)
    next_value: Mapped[float] = mapped_column(Float, nullable=False)
    expiration_time: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    account_id: Mapped[UUIDType] = mapped_column(
        ForeignKey("accounts.id"), nullable=False
    )
    account: Mapped[Account] = relationship(
        "Account", back_populates="asset_predictions"
    )
