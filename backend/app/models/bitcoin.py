from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Integer

from app.db.database import Base


class BitcoinPrice(Base):
    __tablename__ = "bitcoin_price"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
