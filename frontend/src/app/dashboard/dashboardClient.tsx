"use client";
import { useBitcoins } from "@/hooks/useBitcoins";
import BitcoinChart from "@/components/bitcoinChart";
import PriceController from "@/components/PriceController";
import OptionSelector from "@/components/optionSelecter";
import ButtonUI from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ComfirmModal from "@/components/comfirmModal";
import React from "react";
import TableComponent from "@/components/tableComponent";
import { useAssetPrediction } from "@/hooks/useAssetPredictions";

import { assetPredictionService, deleteAssetPrediction } from "@/services/assetPrediction";
import { getSession } from "next-auth/react";

export default function Dashboard() {

    const [disabledButtonUI, setDisabledButtonUI] = useState<boolean>(false);
    const [showModel, setShowModel] = useState<boolean>(false);
    const [showModelDelete, setShowModelDelete] = useState<boolean>(false);
    // const [disableComfirm, setDisabledComfirm] = useState<boolean | null>(null);
    const [showMessage, setShowMessage] = useState<string>("");
    const { asset, refetchAsset } = useAssetPrediction();
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const { bitcoins, containerRef, redOrGreen } = useBitcoins();
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
        // const data = await res.json();
        const current_value = parseFloat(contentForm.current_value as string);
        const expiration_time = contentForm.expiration_time
        const downPercent = current_value - (current_value * 0.1);
        const upPercent = current_value + (current_value * 0.1);
        console.log(downPercent, upPercent, nextValue);
        if (nextValue > downPercent && nextValue < upPercent) {
            setShowMessage(
                `Giá hiện tại: ${current_value}, Giá dự kiến: 
            ${nextValue} - Fail current value should > 10% and < 10 %`
            );
        } else if (nextValue === 0) {
            setShowMessage(
                `Giá hiện tại: ${current_value}, Giá dự kiến: 
            ${nextValue} - Fail current value should > 0`
            );
        } else {
            setShowMessage(
                `Giá hiện tại: ${current_value}, Giá dự kiến: 
            ${nextValue}, Hết hạn yêu cầu: ${expiration_time}`
            );
        }
        setDisabledButtonUI(true);
        setShowModel(true); // Hiện modal xác nhận
        setTimeout(() => {
            setDisabledButtonUI(false);
        }, 2000);
    };
    const handleButtonClickOptionSelector = (index: number) => {
        contentForm.expiration_time = optionExpirationTime[index];
    };
    const handleOnDeleteRowAsset = async (index: number) => {
        console.log(index);
        setDeleteIndex(index);
        setShowMessage(
            `You want delete row here !`
        );
        setShowModelDelete(true); // Hiện modal xác nhận
    };
    const handleButtonComfirmModalDelete = async () => {
        const session = await getSession();
        if (deleteIndex !== null) {
            const resDelete = await deleteAssetPrediction({ id: deleteIndex, token_id: session?.user.id_token || "" });
            console.log(resDelete);
        }
        setShowModelDelete(false);
        await refetchAsset();
    }
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
        await refetchAsset();
    };
    const handleButtonCloseModal = () => {
        setShowModel(false); // Đóng modal xác nhậnọi lại hàm refetch để cập nhật dữ liệu
        setShowModelDelete(false);
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
                            <div className="flex">
                                <span>Bitcoin Price</span>
                                <p className="flex items-center text-white text-sm font-medium sm:text-base space-x-1 relative group ml-1">


                                    {/* ICON */}
                                    <svg
                                        className="w-5 h-5 text-gray-300 cursor-pointer"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>

                                    {/* TOOLTIP khi hover */}
                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                        Collect data from Binance exchange
                                    </span>
                                </p>
                            </div>

                            {/* Giá */}
                            <p
                                className={`${redOrGreen === 'red' ? 'text-red-500' : 'text-green-500'
                                    } sm:text-xl`}
                            >
                                {bitcoins?.price} $
                            </p>

                        </div>

                        <div className="p-4 text-white flex-col space-y-5">
                            <p className="mb-1">Current value </p>
                            <input
                                type="text"
                                value={bitcoins?.price ? parseFloat(bitcoins.price.toString()).toFixed(0) : 0}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                readOnly
                            />
                            <PriceController
                                label="Next value"
                                min={0}
                                max={bitcoins?.price ? Number(bitcoins.price) * 3 : 0}
                                step={1}
                                onChange={handlePriceChange}
                            />
                            <OptionSelector label="Expiration time" options={optionExpirationTime} onclick={handleButtonClickOptionSelector} />
                            <ButtonUI disabled={disabledButtonUI} label="Set Schedule" onClick={handleButtonClickSetSchedule} />
                            <ComfirmModal isOpen={showModel} message={showMessage} onConfirm={handleButtonComfirmModal} onClose={handleButtonCloseModal} />
                            <ComfirmModal isOpen={showModelDelete} message={showMessage} onConfirm={handleButtonComfirmModalDelete} onClose={handleButtonCloseModal} />
                        </div>
                        <div>

                        </div>
                    </div>

                </div>
                {asset && (<TableComponent label={"Schedule"} value={asset} onDelete={handleOnDeleteRowAsset} />)}
            </div>
        </main>
    );
}
