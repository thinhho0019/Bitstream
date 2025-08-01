# app/core/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    ALGORITHM: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    EMAIL_ADDRESS: str
    EMAIL_PASSWORD: str
    HOST_REDIS: str
    PORT_REDIS: int
    NUMBER_DB_REDIS: int
    DASHBOARD_URL: str
    KEY_GEMINI: str

    class Config:
        env_file = ".env"  # tự động đọc file .env


settings = Settings()  # type: ignore
