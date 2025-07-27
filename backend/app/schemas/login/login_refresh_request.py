from pydantic import BaseModel


class LoginRefreshTokenRequest(BaseModel):
    refresh_token: str
