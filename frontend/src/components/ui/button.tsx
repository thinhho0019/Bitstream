import { useEffect, useState } from "react";

type ButtonProps = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
};

export default function ButtonUI({ label, onClick, disabled, className }: ButtonProps) {
    const [isDisabled, setIsDisabled] = useState(disabled || false);

    useEffect(() => {
        setIsDisabled(disabled || false);
    }, [disabled]);
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`w-full px-4 py-2 mt-1 rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600 
                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
        >
            {label}
        </button>
    );
}
