"use client";
import React from "react";

export default function ConfirmModal({
  message = "Bạn có chắc chắn không?",
  isOpen = false,
  onConfirm,
  onClose,
}: {
  message?: string;
  isOpen?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] sm:w-96 text-center">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Đồng ý
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
