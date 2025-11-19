import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SideBar'
import axios from 'axios'

const TestsHistory = () => {

    const [tests, setTests] = useState([])
    const [users, setUsers] = useState([])

    const getTests = async () => {
        try {

            const testGet = await axios.get(`https://json-questions-3.onrender.com/results`)
            const getUsers = await axios.get('https://json-questions-3.onrender.com/users')

            const data = testGet.data
            const data2 = getUsers.data
            setTests(data)
            setUsers(data2)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getTests()
    }, [])

    return (
        <div>


            <div className='p-[50px]'>

                <div className="bg-white rounded-xl shadow-md p-6 w-[80%] ">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: "#2E37A4" }}>
                        История тестов
                    </h2>

                    <div className="flex flex-col gap-4">

                        {tests.map((m) => {

                            const find = users.find((f) => f.id === m.student_id)

                            return (
                                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm flex justify-between items-center">

                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold text-gray-800">
                                            {find.firstName} {find.lastName}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Тип теста: {m.test_type}
                                        </span>
                                    </div>


                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {m.test_score} / {m.test_max_score}
                                        </span>


                                        <div className="w-32 h-2 bg-gray-300 rounded-full mt-2">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${(m.test_score / m.test_max_score) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>


            </div>

        </div>
    )
}

export default TestsHistory