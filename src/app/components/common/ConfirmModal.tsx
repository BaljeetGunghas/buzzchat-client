"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black min-h-screen opacity-80" />
            <div
                className="absolute z-60 top-[50%] left-[50%] -translate-[50%] bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl transform transition-all duration-500 animate-fade-in-up"
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    {description}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </>

    );
}
