import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_google_user
from app.auth.hash import hash_password, verify_password
from app.auth.jwt import (create_access_token, create_refresh_token,
                          decode_access_token)
from app.core.message.account_message import AccountMessage
from app.db.database import SessionLocal
from app.jobs.btc_alert import notify_btc
from app.models import LoginSession
from app.models.account import Account
from app.models.email_verification_tokens import EmailVerificationToken
from app.schemas.account import AccountCreate, AccountGetInforOut
from app.schemas.login.login_refresh_request import LoginRefreshTokenRequest
from app.schemas.login.login_request import LoginRequest
from app.schemas.login.login_response import LoginResponse
from app.services.email_service import email_service

router = APIRouter()
email_verify_index = Jinja2Templates(directory="app/templates/email_verify")
NAME_TEMPLATE = [
    "Mochi",
    "Luna",
    "Neko",
    "Mimi",
    "Boba",
    "Sushi",
    "Koko",
    "Chibi",
    "Yuki",
    "Pumpkin",
    "Tiger",
    "Shadow",
    "Whiskers",
    "Zuzu",
    "Nala",
    "Tom",
    "Jerry",
    "Leo",
    "Snowball",
    "Oreo",
    "Coco",
    "Simba",
    "Maru",
    "Bella",
    "Milo",
    "Tama",
    "Peach",
    "Pudding",
    "Mango",
    "Cookie",
]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=LoginResponse)
def login_account(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user_agent = request.headers.get("user-agent", "unknown")
    ip = request.headers.get("x-forwarded-for", request.client.host)
    finger_print = data.finger_print
    if not data.email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=AccountMessage.ACCOUNT_MISS_PARAM,
        )
    db_account = db.query(Account).filter(data.email == Account.email).first()
    if not db_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=AccountMessage.ACCOUNT_LOGIN_FAIL_EMAIL,
        )
    password_hash = verify_password(data.password, db_account.password)
    if not password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=AccountMessage.ACCOUNT_LOGIN_FAIL_PASSWORD,
        )
    if not finger_print:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="not found fingerprints"
        )
    try:
        login_sessions = db_account.login_sessions
        data_response = {
            "email": db_account.email,
            "name": db_account.name,
            "image": db_account.image,
            "provider": "email",
        }
        refresh_token = create_refresh_token(
            {"id": str(db_account.id), "type": "email"}
        )
        access_token = create_access_token({"id": str(db_account.id), "type": "email"})
        data_response["refresh_token"] = refresh_token
        data_response["access_token"] = access_token
        print(access_token)
        for ses in login_sessions:
            if ses.finger_print == finger_print:
                return data_response
        login_session = LoginSession(
            user_agent=user_agent,
            ip_address=ip,
            refresh_token=refresh_token,
            finger_print=finger_print,
        )
        db_account.login_sessions.append(login_session)
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return data_response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=AccountMessage.ERROR_LOGIN_ACCOUNT,
        )


@router.get("/get-infor-user", response_model=AccountGetInforOut)
def get_infor_account(
    user=Depends(get_current_google_user), db: Session = Depends(get_db)
):
    try:
        if "id" not in user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=AccountMessage.ERROR_GET_INFOR_ACCOUNT,
            )
        db_account = db.query(Account).filter(Account.id == user["id"]).first()
        return db_account
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=AccountMessage.ERROR_GET_INFOR_ACCOUNT,
        )


@router.post("/accounts", status_code=status.HTTP_201_CREATED)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    # check email exist
    check_email = db.query(Account).filter(account.email == Account.email).first()
    if check_email and account.provider == "email":
        if len(check_email.email_verifications) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=AccountMessage.ACCOUNT_EXISTS_VERIFY,
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=AccountMessage.ERROR_CREATE_ACCOUNT,
        )
    try:
        if account.provider == "google":
            if check_email and account.provider == "email":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=AccountMessage.ERROR_ACCOUNT_DIF_PROVIDER,
                )
            if check_email:
                return {
                    "message": AccountMessage.ACCOUNT_EXISTS_VERIFY,
                    "id": check_email.id,
                }
            db_account = Account(
                email=account.email, name=account.name, image=account.image
            )
        else:
            random_name = random.sample(NAME_TEMPLATE, 1)[0]
            db_account = Account(
                email=account.email,
                name=random_name,
                image=account.image,
                password=hash_password(account.password),
                provider="email",
            )
            token = EmailVerificationToken(
                token=str(uuid.uuid4()),
                expires_at=datetime.utcnow() + timedelta(minutes=30),
            )
            db_account.email_verifications.append(token)
            email_service.send(
                to_email=account.email,
                subject="Bitstream Verify Email",
                content=f"<p>Click to verify your Bitstream account:</p>"
                f"<a href='http://localhost:8000/api/verify-email?token={token.token}'>Click here</a>",
                html=True,
            )
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return {"message": AccountMessage.ACCOUNT_EXISTS_VERIFY, "id": db_account.id}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=AccountMessage.ERROR_CREATE_ACCOUNT + str(e),
        )


@router.post("/refresh-token")
async def refresh_token_account(req: LoginRefreshTokenRequest):
    try:
        encode_refresh = decode_access_token(req.refresh_token)
        current_time = datetime.now(timezone.utc).timestamp()
        expires_time = encode_refresh.get("exp")  # dạng float/int
        id = encode_refresh.get("id")
        if current_time > expires_time:
            return {"message": "exp"}
        access_token = create_access_token({"id": id})
        decode_check = decode_access_token(access_token)
        return {"access_token": access_token, "exp": decode_check.get("exp")}
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=AccountMessage.ERROR_REFRESH_TOKEN,
        )


@router.get("/verify-email", response_class=HTMLResponse)
async def verify_email(
    request: Request, token: Optional[str] = None, db: Session = Depends(get_db)
):
    message_success = {
        "result": "success",
        "message": AccountMessage.ACCOUNT_VERIFY_SUCCESS,
    }
    message_fail = {"result": "fail", "message": AccountMessage.ACCOUNT_VERIFY_FAIL}
    token_email = (
        db.query(EmailVerificationToken)
        .filter(token == EmailVerificationToken.token)
        .first()
    )
    if not token_email:
        return email_verify_index.TemplateResponse(
            "index.html", {"request": request, **message_fail}
        )
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
        return email_verify_index.TemplateResponse(
            "index.html", {"request": request, **message_success}
        )
    return email_verify_index.TemplateResponse(
        "index.html", {"request": request, **message_fail}
    )
