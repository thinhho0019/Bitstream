import requests
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.bitcoin import BitcoinPrice


def fetch_and_save_bitcoin_price():
    try:
        response = requests.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
        if response.status_code == 200:
            data = response.json()
            bitcoin_price = data['price']
            db: Session = SessionLocal()
            new_price = BitcoinPrice(price=bitcoin_price)
            db.add(new_price)
            db.commit()
            db.refresh(new_price)
            db.close()
            print(f"Add new bitcoin price success")
            return
    except Exception as e:
        print(f"[ERROR] {e}")
