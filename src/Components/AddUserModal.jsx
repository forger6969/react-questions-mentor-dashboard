import axios from "axios";
import React, { useState } from "react";
import SuccessModal from "./SuccesModal"; // Импортируем твой компонент

const AddUserModal = ({ setModal }) => {
    const [userLogin, setLogin] = useState("");
    const [userPassword, setPassword] = useState("");
    const [userFirst, setFirst] = useState("");
    const [userLast, setLast] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);

    const postNewUser = async () => {
        const userInfo = {
            firstName: userFirst,
            lastName: userLast,
            login: userLogin,
            password: userPassword,
        };

        try {
            const response = await axios.post(
                "https://json-questions-3.onrender.com/users",
                userInfo
            );
            console.log(response.data);

            // Закрываем текущую модалку
            setModal(false);

            // Показываем SuccessModal
            setSuccessOpen(true);

            // Очищаем форму
            setFirst("");
            setLast("");
            setLogin("");
            setPassword("");
        } catch (err) {
            console.error(err);
            alert("Ошибка при добавлении пользователя!");
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center z-50">
                {/* Задний фон */}
                <div
                    className="absolute inset-0 bg-black/30"
                    onClick={() => setModal(false)}
                ></div>

                {/* Контейнер модалки */}
                <div className="bg-base-100 rounded-xl shadow-xl p-6 w-11/12 max-w-md z-50">
                    <h2 className="text-2xl font-bold text-center text-base-content mb-4">
                        Добавить ученика
                    </h2>

                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Имя"
                            className="input input-bordered w-full"
                            onChange={(e) => setFirst(e.target.value)}
                            value={userFirst}
                        />
                        <input
                            type="text"
                            placeholder="Фамилия"
                            className="input input-bordered w-full"
                            onChange={(e) => setLast(e.target.value)}
                            value={userLast}
                        />
                        <input
                            type="text"
                            placeholder="Логин"
                            className="input input-bordered w-full"
                            onChange={(e) => setLogin(e.target.value)}
                            value={userLogin}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="input input-bordered w-full"
                            onChange={(e) => setPassword(e.target.value)}
                            value={userPassword}
                        />

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setModal(false)}
                                className="btn btn-ghost"
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={postNewUser}
                                className="btn btn-primary"
                            >
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <SuccessModal
                isOpen={successOpen}
                message="Пользователь успешно добавлен!"
                onClose={() => setSuccessOpen(false)}
            />
        </>
    );
};

export default AddUserModal;
