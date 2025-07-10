"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer({ targetTime }: { targetTime: string }) {
    const [timeLeft, setTimeLeft] = useState("");
    const [colortText, setColorText] = useState("text-green-500");
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(targetTime).getTime();
            const distance = end - now;

            if (distance <= 0) {
                setTimeLeft("00:00:00");
                setColorText("text-red-500");
                clearInterval(interval);
                return;
            }
            setColorText("text-green-500");
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (days > 0) {
                setTimeLeft(
                    `${String(days)}D:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
                );
            } else {
                setTimeLeft(
                    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
                );
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <div className={`${colortText} bg-gray-800 px-4 py-2 rounded text-sm font-mono `}>
            ⏳ {timeLeft}
        </div>
    );
}
