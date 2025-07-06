"use client";
import { useBitcoins } from "@/hooks/useBitcoins";
import BitcoinChart from "@/components/bitcoinChart";
import PriceController from "@/components/PriceController";
import OptionSelector from "@/components/optionSelecter";
import ButtonUI from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import ComfirmModal from "@/components/comfirmModal";
import React, { useEffect } from "react";
import next from "next";
import TableComponent from "@/components/tableComponent";
import { useAssetPrediction } from "@/hooks/useAssetPredictions";
import { get } from "http";
import { redirect } from "next/dist/server/api-utils";
import { assetPredictionService } from "@/services/assetPrediction";
export default function Dashboard() {
    const [disabledButtonUI, setDisabledButtonUI] = useState<boolean>(false);
    const [showModel, setShowModel] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<string>("");
    const { asset, errorAsset, loadingAsset, refetchAsset } = useAssetPrediction();
    const { bitcoins, loading, error, containerRef, redOrGreen, refetch } = useBitcoins();
    const [nextValue, setNextValue] = useState<number>(0);
    const router = useRouter();
    const contentForm = {
        current_value: bitcoins?.price ? parseFloat(bitcoins.price.toString()).toFixed(0) : 0,
        expiration_time: "1H",
    };
    const optionExpirationTime = ["1H", "1D", "1W", "1M"];
    const handlePriceChange = (value: number) => {
        console.log(contentForm);
        setNextValue(value);
    };
    const handleButtonClickSetSchedule = async () => {
        const res = await fetch("/api/auth");
        if (!res.ok) {
            router.push("/login");
            return;
        }
        const data = await res.json();
        const userId = data.userId;
        const current_value = parseFloat(contentForm.current_value as string);
        const expiration_time = contentForm.expiration_time
        console.log(data);
        setShowMessage(
            `Giá hiện tại: ${current_value}, Giá dự kiến: 
            ${nextValue}, Hết hạn yêu cầu: ${expiration_time}`
        );
        setDisabledButtonUI(true);
        setShowModel(true); // Hiện modal xác nhận
        console.log("showModel:", showModel);
        setTimeout(() => {
            setDisabledButtonUI(false);
        }, 2000);
    };
    const handleButtonClickOptionSelector = (index: number) => {
        contentForm.expiration_time = optionExpirationTime[index];

    };
    const handleButtonComfirmModal = async () => {
        const res = await fetch("/api/auth");
        if (!res.ok) {
            router.push("/login");
            return;
        }
        const data = await res.json();
        const userId = data.userId;
        const current_value = parseFloat(contentForm.current_value as string);
        const expiration_time = contentForm.expiration_time
        console.log(data);
        setShowMessage(
            `Giá hiện tại: ${current_value}, Giá dự kiến: 
            ${nextValue}, Hết hạn yêu cầu: ${expiration_time}`
        );
        const resAsset = await assetPredictionService({
            name: "bitcoin",
            current_value: current_value,
            next_value: nextValue, // ví dụ, cần truyền đủ nếu hàm yêu cầu
            expiration_time: expiration_time, // ví dụ ISO format
            account_id: userId,
            status: "pending",
        });
        console.log(resAsset);
        setShowModel(false); // Đóng modal xác nhậnọi lại hàm refetch để cập nhật dữ liệu

    };
    const handleButtonCloseModal = () => {
        setShowModel(false); // Đóng modal xác nhậnọi lại hàm refetch để cập nhật dữ liệu
    };
    //useeffect update contentForm to modal message

    return (
        <main style={{ padding: 0, margin: 0 }} >
            <div className=" justify-between items-top p-4 bg-gray-800 text-white">
                <div className="flex flex-wap w-full gap-1">
                    <div className="w-full sm:w-1/1">
                        <div className="flex items-baseline space-x-2 justify-between p-4 bg-gray-700 rounded-lg">
                            <p className="text-white text-sm font-medium sm:text-base">Bitcoin Price</p>
                        </div>
                        <BitcoinChart containerRef={containerRef as React.RefObject<HTMLDivElement>} />
                    </div>
                    <div className="w-full sm:w-1/2 rounded-lg" style={{ backgroundColor: '#0a0a0a' }}>
                        <div className="flex items-baseline space-x-2 justify-between p-4 bg-gray-700 rounded-lg">
                            <p className="text-white text-sm font-medium sm:text-base">Bitcoin Price</p>
                            <p className={`${redOrGreen === 'red' ? 'text-red-500' : 'text-green-500'}   sm:text-xl `}>
                                {bitcoins?.price} $
                            </p>
                        </div>
                        <div className="p-4 text-white flex-col space-y-5">
                            <p className="mb-1">Current value</p>
                            <input
                                type="text"
                                value={bitcoins?.price ? parseFloat(bitcoins.price.toString()).toFixed(0) : 0}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <PriceController label="Next value" min={0} max={Number(bitcoins?.price) * 3} step={1} onChange={handlePriceChange} />
                            <OptionSelector label="Expiration time" options={optionExpirationTime} onclick={handleButtonClickOptionSelector} />
                            <ButtonUI disabled={disabledButtonUI} label="Set Schedule" onClick={handleButtonClickSetSchedule} />
                            <ComfirmModal isOpen={showModel} message={showMessage} onConfirm={handleButtonComfirmModal} onClose={handleButtonCloseModal} />
                        </div>
                        <div>

                        </div>
                    </div>

                </div>
                {asset && (<TableComponent label={"Schedule"} value={asset} />)}

            </div>
        </main>
    );
}
