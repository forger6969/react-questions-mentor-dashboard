import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [login, setLogin] = useState(null)
    const [password, setPassword] = useState(null)
    const [mentors, setMentors] = useState([])
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    // const getMentors = async () => {
    //     const getMentors = await axios.get(`https://json-questions-2.onrender.com/mentors`)
    //     const data = getMentors.data
    //     setMentors(data)
    // }

    const checkLocalStoarge = JSON.parse(localStorage.getItem(`mentor`))
    if (checkLocalStoarge) {
        navigate(`/MentorsDashboard/`)
    }

    const checkLogin = async () => {
        try {

            const postLogin = await axios.post(`https://json-questions-3.onrender.com/login/mentor`, {
                login: login,
                password: password
            })

            const resData = await postLogin.data
            console.log(postLogin);
            console.log(resData);

            if (postLogin.status === 200) {
                localStorage.setItem(`mentor`, JSON.stringify(resData.mentor))
                navigate(`/MentorsDashboard/`)
            }

        } catch (error) {
            if (error.response) {
                // Сервер ответил с ошибкой (400 / 401 / 500)
                console.log("Ошибка сервера:", error.response.data);
                console.log("Статус:", error.response.status);

                if (error.response.status === 400) {
                    alert("Неправильный логин или пароль");
                }
            } else if (error.request) {
                // Запрос ушёл, но ответа нет
                console.log("Нет ответа от сервера");
            } else {
                // Ошибка в коде
                console.log("Ошибка:", error.message);
            }
        }
    }

    // const checkPassword = () => {

    //     const checkLogin = mentors.find((f) => f.login === login)

    //     if (checkLogin) {
    //         setError(false)
    //         if (checkLogin.password === password) {
    //             setPassword(null)
    //             setLogin(null)
    //             setError(false)

    //             localStorage.setItem(`mentor`, JSON.stringify(checkLogin))

    //             navigate(`/Dashboard`)
    //         } else {
    //             setError(true)
    //         }
    //     } else {
    //         setError(true)
    //     }

    // }

    useEffect(() => {

    }, [])

    return (
        <div>

            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#2E37A4' }}>
                        Вход для менторов
                    </h2>

                    <form className="flex flex-col gap-5">
                        <div className="relative">
                            <input
                                onChange={(e) => setLogin(e.target.value)}
                                value={login}
                                type="text"
                                placeholder=" "
                                className="peer w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2E37A4] transition"
                            />
                            <label
                                className="absolute left-4 top-3 text-gray-400 text-sm transition-all 
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#2E37A4] bg-white px-1"
                            >
                                Логин
                            </label>
                        </div>


                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type="password"
                                placeholder=" "
                                className="peer w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2E37A4] transition"
                            />
                            <label
                                className="absolute left-4 top-3 text-gray-400 text-sm transition-all 
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#2E37A4] bg-white px-1"
                            >
                                Пароль
                            </label>
                        </div>

                        {error && <p className='text-red-600 text-[14px]'>Неверный пароль или логин</p>}

                        <button onClick={checkLogin}
                            type="button"
                            className="w-full bg-[#2E37A4] hover:bg-[#1f2580] text-white py-3 rounded-lg font-semibold transition"
                        >
                            Войти
                        </button>
                    </form>
                </div>
            </div>


        </div>
    )
}

export default Login