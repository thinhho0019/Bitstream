from datetime import datetime

import requests
from fastapi import APIRouter, Depends, HTTPException, Request, status
from google.auth.transport import requests as grequests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.auth.jwt import decode_access_token
from app.core.config import settings
from app.db.database import SessionLocal

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_google_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header.split(" ")[1]
    print(token)
    try:
        # Decode JWT token (your custom access token)
        payload = decode_access_token(token)

        if payload and "type" in payload:
            # Check expiration
            if "exp" in payload:
                now_ts = datetime.utcnow().timestamp()
                if now_ts > payload["exp"]:
                    raise HTTPException(status_code=401, detail="Token expired")
            return payload  # return your user payload
    except Exception:
        # If decoding failed or it's not your JWT token → Try Google token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, grequests.Request(), GOOGLE_CLIENT_ID
            )
            print(idinfo)
            return idinfo
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")

    raise HTTPException(status_code=401, detail="Invalid token")
