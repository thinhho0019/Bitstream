'use client';
import { parse } from "path";
import { useState, useEffect, memo, use } from "react";

type Props = {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
}

export default function PriceController({ label, min, max, step, onChange }: Props) {
    const [value, setValue] = useState(0);
    const [valueInputNumber, setValueInputNumber] = useState(0);
    useEffect(() => {
        if (onChange) {
            onChange(value);
        }
    }, [value]);
    return (
        <div className="flex flex-col space-y-2 p-4 bg-gray-800 rounded-lg text-white mt-1">
            <p className="font-medium">{label}</p>
            <div className="flex items-center space-x-1">
                <input type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => {
                        const newVal = parseFloat(parseFloat(e.target.value).toFixed(2));
                        if (!isNaN(newVal)) setValue(newVal);
                    }}
                    className="w-full sm:w-1/1 accent-green-500" />
                <input
                    type="text"
                    value={value}
                    
                    onChange={(e) => {
                        const newVal = parseFloat(parseFloat(e.target.value).toFixed(2));
                        if (!isNaN(newVal) && min !== undefined && max !== undefined) {
                            if (newVal < min) {
                                setValue(min);
                                setValueInputNumber(min);
                                return;
                            }
                            if (newVal > max) {
                                setValue(max);
                                setValueInputNumber(max);
                                return
                            }
                            setValue(newVal);
                            setValueInputNumber(newVal);
                        } else {
                            setValueInputNumber(0);
                            setValue(0);
                        }
                    }}
                    className="w-full sm:w-1/2 px-4 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );

}