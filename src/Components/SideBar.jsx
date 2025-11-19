import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
    return (
        <aside className="w-64 bg-white shadow-lg flex flex-col h-[100vh]">

            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold" style={{ color: "#2E37A4" }}>
                    Mentor Panel
                </h1>
            </div>

            <nav className="flex-1 p-6 flex flex-col gap-4">

                <NavLink
                    to="/MentorsDashboard/"
                    className={({ isActive }) =>
                        `font-medium ${isActive ? "text-[#2E37A4]" : "text-gray-700"}`
                    }
                >
                    Главная
                </NavLink>

                <NavLink
                    to="/MentorsDashboard/TestsHistory"
                    className={({ isActive }) =>
                        `font-medium ${isActive ? "text-[#2E37A4]" : "text-gray-700"}`
                    }
                >
                    Тесты
                </NavLink>

                <NavLink
                    to="/settings"
                    className="text-gray-700 hover:text-[#2E37A4] font-medium"
                >
                    Настройки
                </NavLink>
            </nav>

            <div className="p-6 border-t border-gray-200">
                <button className="w-full bg-[#2E37A4] hover:bg-[#1f2580] text-white py-2 rounded-lg font-semibold">
                    Выйти
                </button>
            </div>
        </aside>
    );
};

export default SideBar;
