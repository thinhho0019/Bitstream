'use client';
import React, { useEffect, useState } from 'react';
import CountdownTimer from './counterTimer';

type Props = {
    label?: string;
    value?: Record<string, any>[];
    onDelete?: (index: number) => void;
};

export default function TableComponent({ label, value, onDelete }: Props) {
    const [selectedDeleteIndex, setSelectedDeleteIndex] = useState<number | null>(null);
    useEffect(() => {
        if (onDelete && selectedDeleteIndex !== null) {
            onDelete(selectedDeleteIndex);
        }
    }, [selectedDeleteIndex]);
    if (!Array.isArray(value) || value.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center mt-4">
                <p className="text-gray-500 dark:text-neutral-500">No data available</p>
            </div>
        );
    }
    const keys = Object.keys(value[0]);

    return (
        <div className="flex flex-col mt-4 ">
            <div className="flex items-baseline space-x-2 justify-between p-4 bg-gray-700 rounded-lg">
                <p className="text-white text-sm font-medium sm:text-base">{label}</p>
            </div>
            <div className="overflow-x-auto w-full border border-gray-200 dark:border-neutral-600 shadow-md rounded-lg">
                <table className="table-auto min-w-max w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                        <tr>
                            {keys.map((key) => {
                                if (key == "id") return;
                                return ((
                                    <th
                                        key={key}
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 whitespace-nowrap"
                                    >
                                        {key}
                                    </th>
                                ))
                            })}
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 whitespace-nowrap">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {value.map((row, idx) => (
                            <tr key={idx}>
                                {keys.map((key) => {
                                    if (key == "id") {
                                        return;
                                    }
                                    if (key == "end_time") {
                                        return (<td
                                            key={key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-center"
                                        >
                                            <CountdownTimer targetTime={row[key]} />
                                        </td>);
                                    } else if (key == "status") {
                                        return (
                                            <td
                                                key={key}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-center"
                                            >
                                                <div className="relative p-1 rounded-xl bg-gradient-to-r from-pink-500 via-yellow-600 to-purple-500 animate-border">
                                                    <div className="bg-gray-900 rounded-lg px-6 py-4 text-white">
                                                        {row[key]}
                                                    </div>
                                                </div>

                                            </td>
                                        );
                                    }
                                    return (
                                        <td
                                            key={key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-center"
                                        >
                                            {row[key]}
                                        </td>
                                    )
                                })}
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDeleteIndex(row['id'])}
                                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}