import json
import time
from datetime import datetime

from fetch_price import (
    fetch_24h_stats,
    fetch_and_save_bitcoin_price,
    fetch_klines,
    fetch_orderbook,
    fetch_price,
)

from app.core.message.infor_message import InforMessage

while True:
    fetch_and_save_bitcoin_price()
    json_data_price = fetch_price()
    json_data_24h = fetch_24h_stats()
    json_data_orderbook = fetch_orderbook()
    json_data_klines = fetch_klines()
    json_data_infor_bitstream = InforMessage.INFOR_BITSTREAM
    data = {
        "timestamp": datetime.utcnow().isoformat(),
        "price": json_data_price,
        "stats_24h": json_data_24h,
        "orderbook": json_data_orderbook,
        "klines": json_data_klines,
        "infor_bitstream": json_data_infor_bitstream,
    }

    # ✅ Ghi đè file "latest" để RAG luôn đọc được bản mới nhất
    with open("../data/binance_btc_latest.json", "w") as f:
        json.dump(data, f, indent=2)

    # ✅ Ghi snapshot theo timestamp (optional: phục vụ huấn luyện hoặc theo dõi lịch sử)
    timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    with open(f"../data/binance_btc_{timestamp_str}.json", "w") as f:
        json.dump(data, f, indent=2)
    print("1")
    time.sleep(5)
