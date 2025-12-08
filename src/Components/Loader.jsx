import React from "react";

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-base-100 flex flex-col justify-center items-center z-50">
            {/* Большой спиннер с динамическими цветами темы */}
            <div className="w-24 h-24 border-8 border-t-primary border-base-300 rounded-full animate-spin"></div>
            <p className="mt-6 text-xl font-semibold text-base-content">Загрузка...</p>
        </div>
    );
};

export default Loader;
