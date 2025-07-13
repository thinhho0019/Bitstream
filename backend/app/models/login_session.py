# models/login_session.py
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean,UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class LoginSession(Base):
    __tablename__ = "login_sessions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"))
    refresh_token = Column(String, nullable=False)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    account = relationship("Account", back_populates="login_sessions")
