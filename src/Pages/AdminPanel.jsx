import { NavLink, Outlet } from "react-router-dom";

const AdminPanel = () => {
    const tabClass = ({ isActive }) =>
        `tab ${isActive ? "tab-active font-bold" : ""}`;

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <h1 className="text-3xl font-bold text-primary mb-6">
                Админ-панель
            </h1>


            <div className="tabs tabs-boxed bg-base-100 mb-6 shadow">
                <NavLink to="/MentorsDashboard/AdminPanel" className={tabClass}>
                    👥 Пользователи
                </NavLink>

                <NavLink to="/MentorsDashboard/AdminPanel/addTest" className={tabClass}>
                    🧪 Тесты
                </NavLink>

                <NavLink to="/MentorsDashboard/AdminPanel/settings" className={tabClass}>
                    ⚙️ Настройки
                </NavLink>
            </div>


            <Outlet />
        </div>
    );
};

export default AdminPanel;
