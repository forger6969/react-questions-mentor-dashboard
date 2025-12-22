import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from './ThemeSwitcher.jsx'

const Dashboard = () => {
    const [students, setStudents] = useState([])
    const [tests, setTests] = useState([])
    const [mentor, setMentor] = useState(null)
    const navigate = useNavigate()

    const firstWrokedFunction = async () => {
        const getmentor = JSON.parse(localStorage.getItem(`mentor`))

        if (getmentor) {
            setMentor(getmentor)
        } else {
            navigate(`/`)
        }

        const getStudents = await axios.get(`https://json-questions-2.onrender.com/users`)
        setStudents(getStudents.data)

        const getTests = await axios.get(`https://json-questions-2.onrender.com/results`)
        setTests(getTests.data)
    }

    useEffect(() => {
        firstWrokedFunction()
    }, [])

    return (
        <div className="p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-primary">
                    Добро пожаловать, {mentor?.firstName || "Loading"}!
                </h2>


                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <span className="font-medium">{mentor?.firstName || "Loading"} </span>
                    <img src="/avatar.png" alt="avatar" className="w-10 h-10 rounded-full" />
                </div>
            </div>

            {/* STATS */}
            <div className="stats shadow w-full mb-10 grid grid-cols-1 md:grid-cols-3">
                <div className="stat">
                    <div className="stat-title">Всего студентов</div>
                    <div className="stat-value">{students.length}</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Пройдено тестов</div>
                    <div className="stat-value">{tests.length}</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Активные студенты</div>
                    <div className="stat-value text-primary">
                        {
                            tests.filter(t => students.some(s => s.id === t.student_id)).length
                        }
                    </div>
                </div>
            </div>

            {/* STUDENTS TABLE */}
            <div className="card bg-base-100 shadow-xl p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Список студентов</h3>

                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Пройдено тестов</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((m) => {
                                const filter = tests.filter((f) => f.student_id === m.id)
                                const zero = filter.length === 0

                                return (
                                    <tr key={m.id}>
                                        <td>{m.firstName} {m.lastName}</td>

                                        <td>
                                            {zero ? "Не сдавал" : filter.length}
                                        </td>

                                        <td>
                                            <span className={`badge ${zero ? "badge-warning" : "badge-success"} badge-lg`}>
                                                {zero ? "Неактивен" : "Активен"}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
