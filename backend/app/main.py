from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import pipelines, bitcoin, account, asset_predictions
app = FastAPI()
app.include_router(pipelines.router, prefix="/api")
app.include_router(bitcoin.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(asset_predictions.router, prefix="/api")
origins = [
    "http://localhost:3000",  # Next.js dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Ai được gọi
    allow_credentials=True,
    allow_methods=["*"],              # Cho phép GET, POST, PUT, DELETE
    allow_headers=["*"],             # Cho phép headers nào
)