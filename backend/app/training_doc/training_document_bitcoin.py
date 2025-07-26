import json
import traceback
from datetime import datetime
from pathlib import Path


def generate_training_document(input_path: str, output_path: str) -> str:
    try:
        # Load dữ liệu đã crawl từ Binance
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        timestamp = data.get("timestamp")
        price_info = data.get("price", {})
        stats_24h = data.get("stats_24h", {})
        orderbook = data.get("orderbook", {})
        klines = data.get("klines", [])
        infor_bitstream = data.get("infor_bitstream")
        infor_overview = data.get("infor_overview")

        def format_price():
            symbol = price_info.get("symbol", "BTCUSDT")
            price = price_info.get("price", "unknown")
            return f"Vào thời điểm {timestamp}, giá {symbol} là {price} USDT."

        def format_24h():
            high = stats_24h.get("highPrice", "?")
            low = stats_24h.get("lowPrice", "?")
            volume = stats_24h.get("volume", "?")
            quote_volume = stats_24h.get("quoteVolume", "?")
            return (
                f"Trong 24 giờ qua, BTC dao động từ {low} đến {high} USDT. "
                f"Khối lượng giao dịch đạt {volume} BTC (tương đương {quote_volume} USDT)."
            )

        def format_orderbook():
            bids = orderbook.get("bids", [])
            asks = orderbook.get("asks", [])
            bid_str = (
                f"{bids[0][1]} BTC tại {bids[0][0]} USDT"
                if bids
                else "không có dữ liệu bid"
            )
            ask_str = (
                f"{asks[0][1]} BTC tại {asks[0][0]} USDT"
                if asks
                else "không có dữ liệu ask"
            )
            return f"Orderbook: Giá mua cao nhất (bid) là {bid_str}, giá bán thấp nhất (ask) là {ask_str}."

        def format_klines():
            if not klines:
                return "Không có dữ liệu nến (klines)."
            candle = klines[-1]
            open_price, high, low, close, volume = (
                candle[1],
                candle[2],
                candle[3],
                candle[4],
                candle[5],
            )
            return (
                f"Nến gần nhất: mở cửa tại {open_price}, cao nhất {high}, thấp nhất {low}, đóng cửa tại {close}, "
                f"với khối lượng {volume} BTC."
            )

        def format_infor_bitstream():
            if not infor_bitstream:
                return "Không có dữ liệu về bitstream."
            return f"Thông tin về bitstream: {infor_bitstream}"

        def format_infor_overview():
            if not infor_overview:
                return ""
            data = "Thông tin tổng quan:\n"
            for overview in infor_overview:
                key = overview["question"]
                value = overview["answer"]
                if isinstance(value, dict):
                    sub_info = "\n".join(f"  - {k}: {v}" for k, v in value.items())
                    data += f"{key}:\n{sub_info}\n"
                else:
                    data += f"{key}: {value}\n"
            return data.strip()

        # Tổng hợp nội dung huấn luyện
        document_text = "\n\n".join(
            [
                format_price(),
                format_24h(),
                format_orderbook(),
                format_klines(),
                format_infor_bitstream(),
                format_infor_overview(),
            ]
        )
        # Ghi file
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(document_text)
        return document_text
    except Exception as ex:
        print("❌ Lỗi xảy ra:")
        traceback.print_exc()
        return ""
