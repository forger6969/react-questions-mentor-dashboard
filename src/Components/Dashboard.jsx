import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import SideBar from '../Components/SideBar'

const Dashboard = () => {


    const [students, setStudents] = useState([])
    const [tests, setTests] = useState([])
    const [activeStudents, setActives] = useState([])
    const [mentor, setMentor] = useState(null)
    const navigate = useNavigate()

    console.log(mentor);


    const firstWrokedFunction = async () => {
        const getmentor = JSON.parse(localStorage.getItem(`mentor`))
        console.log(getmentor);

        if (getmentor) {
            setMentor(getmentor)
        } else {
            navigate(`/`)
        }

        const getStudents = await axios.get(`https://json-questions-2.onrender.com/users`)
        const data = getStudents.data
        setStudents(data)

        const getTests = await axios.get(`https://json-questions-2.onrender.com/results`)
        const testDatas = getTests.data
        setTests(testDatas)

        const activeUsers = []

        for (let index = 0; index < students.length; index++) {

            const find = tests.find((f) => f.student_id === students[index].id)

            if (find) {
                activeUsers.push(find)
            }

        }

        console.log(activeUsers);

    }


    useEffect(() => {
        firstWrokedFunction()
    }, [])

    return (
        <div>

            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold" style={{ color: '#2E37A4' }}>Добро пожаловать, {mentor?.firstName || "Loading"}!</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">{mentor?.firstName || "Loading"} </span>
                        <img src="/avatar.png" alt="avatar" className="w-10 h-10 rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#2E37A4' }}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Всего студентов</h3>
                        <p className="text-2xl font-bold text-gray-900">{students?.length || 'Loading'}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#2E37A4' }}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Пройдено тестов</h3>
                        <p className="text-2xl font-bold text-gray-900">{tests?.length || "loading"}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#2E37A4' }}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Активные студенты</h3>
                        <p className="text-2xl font-bold text-gray-900">85</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#2E37A4' }}>Список студентов</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Имя</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Пройдено тестов</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((m) => {

                                const filter = tests.filter((f) => f.student_id === m.id)
                                const check = filter.length === 0


                                return (
                                    <tr>
                                        <td className="px-6 py-4">{m.firstName} {m.lastName}</td>
                                        <td className="px-6 py-4">{filter.length === 0 ? `Не сдавал` : filter.length}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-white  ${check ? 'bg-amber-700' : "bg-green-600"} `}>{check ? `Неактивен` : `Активен`} </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </main>

        </div>
    )
}

export default Dashboard