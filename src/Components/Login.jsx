import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkLocalStorage = JSON.parse(localStorage.getItem('mentor'))
        if (checkLocalStorage) {
            navigate(`/MentorsDashboard/`)
        }
    }, [])

    const checkLogin = async () => {
        try {
            const response = await axios.post(`https://json-questions-3.onrender.com/login/mentor`, {
                login,
                password
            })

            if (response.status === 200) {
                localStorage.setItem('mentor', JSON.stringify(response.data.mentor))
                navigate(`/MentorsDashboard/`)
            }
        } catch (err) {
            setError(true)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                    Вход для менторов
                </h2>

                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Логин</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Введите логин"
                        className="input input-bordered w-full"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>

                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Пароль</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Введите пароль"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-600 mb-4 text-center">Неверный логин или пароль</p>}

                <div className="form-control">
                    <button
                        className="btn btn-primary w-full"
                        onClick={checkLogin}
                    >
                        Войти
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
