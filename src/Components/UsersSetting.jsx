import axios from "axios";
import React, { useEffect, useId, useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "./ConfirmModal";
import SuccessModal from "./SuccesModal";
import AddUserModal from "./AddUserModal";

const UsersSetting = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setModal] = useState(false)
    const [userId, setId] = useState(null)
    const [deleteResult, setResult] = useState(null)
    const [showUserModal, setUserModal] = useState(false)

    const getUsers = async () => {
        try {

            const req = await axios.get(`https://json-questions-3.onrender.com/users`)
            const data = req.data
            setUsers(data)

        } catch (err) {
            console.log(err);
        }
    }

    const deleteUser = async () => {
        const del = await axios.delete(`https://json-questions-3.onrender.com/users/${userId}`)
        console.log(del);
        setResult(del)
        getUsers()
        // succes()
    }

    const open = (id) => {
        setModal(true)
        setId(id)
    }

    // const succes = () => {
    //     if (deleteResult.status === 200) {
    //         alert(`успешно`)
    //     }

    //     return (
    //         <SuccessModal />
    //     )
    // }


    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="p-6 min-h-screen bg-base-200">
            <h1 className="text-3xl font-bold mb-6 text-primary">Админ-панель</h1>

            {/* Кнопка добавления пользователя */}
            <div className="mb-4 flex justify-end">
                <button onClick={() => setUserModal(true)} className="btn btn-primary gap-2">
                    <FiPlus /> Добавить пользователя
                </button>
            </div>

            {/* Таблица пользователей */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full bg-base-100 shadow-lg rounded-lg">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <th>{user.id}</th>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>

                                <td className="flex gap-2">
                                    <button className="btn btn-sm btn-ghost btn-square">
                                        <FiEdit className="text-green-500" />
                                    </button>
                                    <button onClick={() => open(user.id)} className="btn btn-sm btn-ghost btn-square">
                                        <FiTrash2 className="text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {showModal &&
                <ConfirmModal onClose={() => setModal(false)} onConfirm={() => deleteUser()} title="Подтвердите удаление аккаунта" message="Вы точно хотите удалить аккаунт етого пользователя?" confirmText="Удалить" cancelText="Отмена" />
            }

            {showUserModal && <AddUserModal setModal={setUserModal} />}
        </div>
    );
};

export default UsersSetting;
