from fastapi import Request, HTTPException, Depends
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from app.core.config import settings

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID


def get_current_google_user(request: Request):
    auth_header = request.headers.get("Authorization")
    print(auth_header)
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ")[1]
    print(token)
    try:
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), GOOGLE_CLIENT_ID)
        print(idinfo)
        # idinfo["sub"] là google_id
        return idinfo
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
