import React, { useEffect, useState } from 'react'
import axios from 'axios'

const TestsHistory = () => {
    const [tests, setTests] = useState([])
    const [users, setUsers] = useState([])

    const getTests = async () => {
        try {
            const testRes = await axios.get(`https://json-questions-3.onrender.com/results`)
            const usersRes = await axios.get('https://json-questions-3.onrender.com/users')
            setTests(testRes.data)
            setUsers(usersRes.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getTests()
    }, [])

    return (
        <div className="p-10 bg-base-200 min-h-screen flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="card bg-base-100 shadow-xl rounded-xl p-6">
                    <h2 className="text-3xl font-bold text-primary mb-6 text-center">
                        История тестов
                    </h2>

                    <div className="overflow-y-auto max-h-[70vh] flex flex-col gap-4 pr-2">
                        {tests.map((m) => {
                            const student = users.find((f) => f.id === m.student_id)


                            return (
                                <div
                                    key={m.id}
                                    className="card bg-base-100 shadow-lg p-4 flex justify-between rounded-lg border border-base-300 hover:shadow-2xl transition"
                                >
                                    <div className='flex justify-between'>

                                        <div className="flex flex-col">
                                            <span className="font-semibold text-lg text-base-content">
                                                {student ? student.firstName : "Имя пользователя не найдено"} {student ? student.lastName : ""}
                                            </span>
                                            <span className="text-sm text-base-content/70 mt-1">
                                                Тип теста: {m.test_type}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end w-40">
                                            <span className="font-semibold text-lg text-base-content">
                                                {m.test_score} / {m.test_max_score}
                                            </span>
                                            <progress
                                                className="progress progress-success w-full mt-2"
                                                value={m.test_score}
                                                max={m.test_max_score}
                                            ></progress>
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
