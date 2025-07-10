'use client'
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bitcoin } from "@/types/bitcoins";
export const useBitcoins = () => {
    // Khởi tạo state
    let bitcoinBefore: number = 0.0;
    const [bitcoins, setBitcoins] = useState<Bitcoin>();
    const [loading, setLoading] = useState<boolean>(true);
    const [redOrGreen, setRedOrGreen] = useState<string>("green");
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Ép nếu trình duyệt trả về Asia/Saigon
    if (userTimezone === "Asia/Saigon") {
        userTimezone = "Asia/Ho_Chi_Minh";
    }
    const fetchBitcoins = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
            if (response.status !== 200) {
                throw new Error(`Error fetching bitcoins: ${response.statusText}`);
            }
            const bitcoinPrice: Bitcoin = {
                price: parseFloat(response.data.price)
            };
            if (bitcoinBefore > bitcoinPrice.price) {
                setRedOrGreen("red");
            } else {
                setRedOrGreen("green");
            }
            setBitcoins(bitcoinPrice);
            bitcoinBefore = bitcoinPrice.price;
            setError(null);
        } catch (err) {
            console.error("Failed to fetch bitcoins:", err);
            setError("Failed to fetch bitcoins");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // Chỉ thêm script nếu chưa có
        const intervalId = setInterval(() => {
            fetchBitcoins();
        }, 3000);

        fetchBitcoins();
        if (!document.getElementById("tradingview-widget-script")) {
            const script = document.createElement("script");
            script.id = "tradingview-widget-script";
            script.src = "https://s3.tradingview.com/tv.js";
            script.async = true;
            script.onload = () => {
                // @ts-expect-error: TradingView is loaded dynamically from external script
                if (window.TradingView) {
                    // @ts-expect-error: TradingView is loaded dynamically from external script
                    new window.TradingView.widget({
                        width: "100%",
                        height: 400,
                        symbol: "BINANCE:BTCUSDT",
                        interval: "1",
                        timezone: userTimezone,
                        theme: "dark",
                        style: "1",
                        locale: "en",
                        toolbar_bg: "#f1f3f6",
                        enable_publishing: false,
                        allow_symbol_change: true,
                        container_id: "tradingview_1",
                    });
                }
            };
            document.body.appendChild(script);
        } else {
            // Nếu script đã có, chỉ cần khởi tạo widget
            // @ts-expect-error: TradingView is loaded dynamically from external script
            if (window.TradingView) {
                // @ts-expect-error: TradingView is loaded dynamically from external script
                new window.TradingView.widget({
                    width: "100%",
                    height: 400,
                    symbol: "BINANCE:BTCUSDT",
                    interval: "1",
                    timezone: userTimezone,
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    toolbar_bg: "#f1f3f6",
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: "tradingview_1",
                });
            }
        }
        return () => {
            clearInterval(intervalId);
            // Xóa script khi component unmount
            const script = document.getElementById("tradingview-widget-script");
            if (script) {
                script.remove();
            }
        };
    }, []);

    return { bitcoins, loading, error, containerRef, redOrGreen, refetch: fetchBitcoins };
}