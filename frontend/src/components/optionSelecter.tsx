import { useState, useEffect } from "react";

type props = {
    label?: string;
    options?: string[];
    onclick?: (index: number) => void;
}
export default function OptionSelector({ label, options = ["Option 1", "Option 2", "Option 3"], onclick }: props) {
    const [selected, setSelected] = useState<number | null>(0);

    useEffect(() => {
        if (onclick) {
            onclick(selected ?? 0);
        }
    }, [selected, onclick]);

    return (
        <div className="flex space-x-4 justify-between items-center p-4 bg-gray-800 rounded-lg text-white mt-1">
            <div>
                <p className="font-medium">{label}</p>
            </div>
            {options.map((option, index) => (
                <div
                    key={index}
                    onClick={() => setSelected(index)}
                    className={`cursor-pointer px-4 py-2 rounded border font-thin transition-colors duration-200 ease-in-out 
            ${selected === index ? "bg-red-800 text-white" : "bg-green-100 text-black"}`}
                >
                    {option}
                </div>
            ))}
        </div>
    );
}
