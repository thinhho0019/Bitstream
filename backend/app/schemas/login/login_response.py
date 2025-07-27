from pydantic import BaseModel


class LoginResponse(BaseModel):
    email: str
    name: str
    image: str
    access_token: str
    refresh_token: str
    provider: str
