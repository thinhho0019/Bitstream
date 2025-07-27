import json
import os
from datetime import datetime
from pathlib import Path

from app.core.message.infor_message import InforMessage
from app.core.qa import qa_system
from app.training_doc.training_document_bitcoin import \
    generate_training_document
from app.utils.func_help import read_and_fix_json
from app.worker.fetch_price import (fetch_24h_stats, fetch_klines,
                                    fetch_orderbook, fetch_price)


def update_price_btc():
    try:
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
        timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        # ✅ Ghi đè file "latest" để RAG luôn đọc được bản mới nhất
        current_dir = Path(__file__).resolve().parent
        data_path = (current_dir / "../data/binance_btc_latest.json").resolve()
        data_path_timetamp = (
            current_dir
            / f"../data/logging/binance_btc/binance_btc_{timestamp_str}.json"
        ).resolve()
        out_put_path_txt = (
            current_dir / "../data/training_bitcoin_latest.txt"
        ).resolve()
        read_and_fix_json(data_path, data)
        read_and_fix_json(
            data_path_timetamp, data
        )  # ✅ Ghi snapshot theo timestamp (optional: phục vụ huấn luyện hoặc theo dõi lịch sử)

        generate_training_document(
            input_path=str(data_path), output_path=str(out_put_path_txt)
        )
        qa_system.reload_rag(str(out_put_path_txt))
    except Exception as ex:
        print(ex)
