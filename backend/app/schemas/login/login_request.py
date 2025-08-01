from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str
    finger_print: str
