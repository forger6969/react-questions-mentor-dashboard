import React from "react";

const ConfirmModal = ({ onClose, onConfirm, title = "Подтверждение", message = "Вы уверены?", confirmText = "Да", cancelText = "Отмена" }) => {


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-base-100 rounded-lg shadow-lg w-11/12 max-w-md p-6 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-base-content">{title}</h3>
                <p className="text-base-content text-gray-500">{message}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost border border-base-300 text-base-content hover:bg-base-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="btn btn-error text-white"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
