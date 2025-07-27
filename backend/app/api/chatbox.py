from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_google_user
from app.core.qa import qa_system
from app.db.database import SessionLocal
from app.models.message import Message

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    user_id: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/assistants/bitcoin")
def ask_chat_box(
        req: ChatRequest,
        user=Depends(get_current_google_user),
        db: Session = Depends(get_db),
):
    # log lại lịch sử nếu cần: req.user_id, req.conversation_id
    result = qa_system.ask(req.message)  # hoặc pipe.invoke nếu dùng RAG pipeline
    # save to message
    now = datetime.utcnow()
    db_message_user = Message(
        sender="user", content=req.message, account_id=req.user_id, timestamp=now
    )
    db_message_assistants = Message(
        sender="assistant",
        content=result,
        account_id=req.user_id,
        timestamp=now + timedelta(microseconds=1),
    )

    db.add_all([db_message_user, db_message_assistants])
    db.commit()
    return {"role": "assistant", "assistant": "bitcoin_bot", "response": result}
