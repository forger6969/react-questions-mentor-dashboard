import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const ErrorModal = ({ isOpen, message = "Произошла ошибка!", onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute inset-0 bg-black/30 animate-fadeIn"></div>
            <div className="bg-base-100 rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 animate-slideUp z-50">
                <div className="text-6xl text-error">
                    <FiX />
                </div>
                <p className="text-base-content text-lg text-center">{message}</p>
            </div>
        </div>
    );
};

export default ErrorModal;
