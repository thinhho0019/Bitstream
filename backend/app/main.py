from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import account, asset_predictions, bitcoin, chatbox, pipelines
from app.core.qa import qa_system
from app.scheduler import start_scheduler

app = FastAPI()
app.include_router(pipelines.router, prefix="/api")
app.include_router(bitcoin.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(asset_predictions.router, prefix="/api")
app.include_router(chatbox.router, prefix="/api")
origins = [
    "http://localhost:3000",  # Next.js dev server
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Ai được gọi
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép GET, POST, PUT, DELETE
    allow_headers=["*"],  # Cho phép headers nào
)


@app.on_event("startup")
def on_startup():
    start_scheduler()
    qa_system.initialize()
    print("✅ Mô hình và FAISS đã load xong.")
