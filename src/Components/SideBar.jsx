import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const SideBar = () => {

    const navigate = useNavigate()

    const exitAccount = () => {
        localStorage.clear()
        navigate(`/`)
    }

    return (
        <aside className="w-64 bg-base-100 shadow-lg flex flex-col h-screen">

            {/* HEADER */}
            <div className="p-6 border-b border-base-200">
                <h1 className="text-2xl font-bold text-primary">
                    Mentor Panel
                </h1>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 p-6">
                <ul className="menu w-full">
                    <li>
                        <NavLink
                            to="/MentorsDashboard/"
                            className={({ isActive }) =>
                                isActive ? "text-primary font-semibold" : "text-base-content font-medium"
                            }
                        >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/MentorsDashboard/TestsHistory"
                            className={({ isActive }) =>
                                isActive ? "text-primary font-semibold" : "text-base-content font-medium"
                            }
                        >
                            Тесты
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/MentorsDashboard/AdminPanel"
                            className={({ isActive }) =>
                                isActive ? "text-primary font-semibold" : "text-base-content font-medium"
                            }
                        >
                            Админ панель
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* LOGOUT BUTTON */}
            <div className="p-6 border-t border-base-200" onClick={exitAccount}>
                <button className="btn btn-primary w-full">
                    Выйти
                </button>
            </div>

        </aside>
    );
};

export default SideBar;
