from datetime import datetime, timezone

import requests
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.redis.base import rdBase
from app.models.bitcoin import BitcoinPrice


def fetch_and_save_bitcoin_price():
    try:
        response = requests.get(
            "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
        )
        if response.status_code == 200:
            data = response.json()
            bitcoin_price = data["price"]
            rdBase.set("bitcoin_price", bitcoin_price)
            return
    except Exception as e:
        print(f"[ERROR] {e}")


def fetch_price():
    url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    return requests.get(url).json()


def fetch_24h_stats():
    url = "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
    return requests.get(url).json()


def fetch_orderbook(limit=5):
    url = f"https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit={limit}"
    return requests.get(url).json()


def fetch_klines(interval="1h", limit=24):
    url = f"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval={interval}&limit={limit}"
    return requests.get(url).json()
