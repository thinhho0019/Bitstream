import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.auth.hash import hash_password, verify_password
from app.auth.jwt import create_refresh_token, create_access_token
from app.db.database import SessionLocal
from app.models.account import Account
from app.models.email_verification_tokens import EmailVerificationToken
from app.schemas.account import AccountCreate, AccountOut
from datetime import datetime, timedelta, timezone
from app.schemas.login.login_request import LoginRequest
from app.schemas.login.login_response import LoginResponse
from app.services.email_service import email_service
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import Optional
from app.core.message.account_message import AccountMessage
import random
router = APIRouter()
email_verify_index = Jinja2Templates(directory="app/templates/email_verify")
NAME_TEMPLATE = [
    "Mochi", "Luna", "Neko", "Mimi", "Boba", "Sushi", "Koko", "Chibi", "Yuki", "Pumpkin",
    "Tiger", "Shadow", "Whiskers", "Zuzu", "Nala", "Tom", "Jerry", "Leo", "Snowball", "Oreo",
    "Coco", "Simba", "Maru", "Bella", "Milo", "Tama", "Peach", "Pudding", "Mango", "Cookie"
]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=LoginResponse)
def login_account(data: LoginRequest, db: Session = Depends(get_db)):
    if not data.email or not data.password:
        raise HTTPException(
            status_code=400,
            detail=AccountMessage.ACCOUNT_MISS_PARAM
        )
    db_account = db.query(Account).filter(data.email == Account.email).first()
    if not db_account:
        raise HTTPException(
            status_code=400,
            detail=AccountMessage.ACCOUNT_LOGIN_FAIL_EMAIL
        )
    password_hash = verify_password(data.password, db_account.password)
    if not password_hash:
        raise HTTPException(
            status_code=400,
            detail=AccountMessage.ACCOUNT_LOGIN_FAIL_PASSWORD
        )
    try:
        data_response = {
            "email": db_account.email,
            "name": db_account.name,
            "image": db_account.image,
            "provider":"email"
        }
        refresh_token = create_refresh_token({"id": str(db_account.id)})
        access_token = create_access_token({"id": str(db_account.id)})
        data_response['refresh_token'] = refresh_token
        data_response['access_token'] = access_token
        return data_response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=AccountMessage.ERROR_LOGIN_ACCOUNT
        )


@router.post("/accounts", status_code=status.HTTP_201_CREATED)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    # check email exist
    check_email = db.query(Account).filter(account.email == Account.email).first()
    if check_email:
        if len(check_email.email_verifications) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=AccountMessage.ACCOUNT_EXISTS_VERIFY
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=AccountMessage.ERROR_CREATE_ACCOUNT
        )

    try:
        if account.provider == "google":
            db_account = Account(email=account.email, name=account.name, image=account.image)
        else:
            random_name = random.sample(NAME_TEMPLATE, 1)[0]
            db_account = Account(email=account.email, name=random_name, image=account.image,
                                 password=hash_password(account.password),provider="email")
            token = EmailVerificationToken(
                token=str(uuid.uuid4()),
                expires_at=datetime.utcnow() + timedelta(minutes=30)
            )
            db_account.email_verifications.append(token)
            email_service.send(
                to_email=account.email,
                subject="Bitstream Verify Email",
                content=f"<p>Click to verify your Bitstream account:</p>"
                        f"<a href='http://localhost:8000/api/verify-email?token={token.token}'>Click here</a>",
                html=True
            )
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return {
            "message": AccountMessage.ACCOUNT_EXISTS_VERIFY
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=AccountMessage.ERROR_CREATE_ACCOUNT + str(e)
        )


@router.get("/verify-email", response_class=HTMLResponse)
async def verify_email(request: Request, token: Optional[str] = None, db: Session = Depends(get_db)):
    message_success = {
        "result": "success",
        "message": AccountMessage.ACCOUNT_VERIFY_SUCCESS
    }
    message_fail = {
        "result": "fail",
        "message": AccountMessage.ACCOUNT_VERIFY_FAIL
    }
    token_email = db.query(EmailVerificationToken).filter(token == EmailVerificationToken.token).first()
    if not token_email:
        return email_verify_index.TemplateResponse("index.html", {
            "request": request,
            **message_fail
        })
    current_time = datetime.now(timezone.utc)
    expires_time = token_email.expires_at
    if expires_time.tzinfo is None:
        expires_time = expires_time.replace(tzinfo=timezone.utc)
    print(current_time)
    print(expires_time)
    if current_time < expires_time:
        # Kiểm tra token hợp lệ...
        db.delete(token_email)
        db.commit()
        return email_verify_index.TemplateResponse("index.html", {
            "request": request,
            **message_success
        })
    return email_verify_index.TemplateResponse("index.html", {
        "request": request,
        **message_fail
    })
