import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import AddNewTestModal from "./AddNewTestModal";

const TestSetting = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testModal, setTestModal] = useState(false);
    const [viewTest, setViewTest] = useState(null); // тест для просмотра
    const [viewLoading, setViewLoading] = useState(false);

    const getTests = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "https://json-questions-2.onrender.com/tests"
            );
            setTests(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTest = async (id) => {
        const confirm = window.confirm("Удалить этот тест?");
        if (!confirm) return;

        try {
            await axios.delete(
                `https://json-questions-2.onrender.com/tests/${id}`
            );
            setTests((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const openTest = async (id) => {
        try {
            setViewLoading(true);
            const res = await axios.get(
                `https://json-questions-2.onrender.com/tests/${id}`
            );
            setViewTest(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setViewLoading(false);
        }
    };

    // функция для форматирования времени из мс в "минуты:секунды"
    const formatTime = (ms) => {
        if (!ms) ms = 25 * 60 * 1000; // если время не указано, 25 минут
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes} мин ${seconds.toString().padStart(2, "0")} сек`;
    };

    useEffect(() => {
        getTests();
    }, []);

    return (
        <>
            <div className="p-6">
                {/* Заголовок */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                        📚 Существующие тесты
                    </h2>

                    <button
                        onClick={() => setTestModal(true)}
                        className="btn btn-primary gap-2"
                    >
                        <FiPlus /> Добавить новый тест
                    </button>
                </div>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}

                {/* Пусто */}
                {!loading && tests.length === 0 && (
                    <div className="alert alert-info">Тесты пока не созданы</div>
                )}

                {/* Карточки */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <div
                            key={test.id}
                            className="card bg-base-100 shadow-xl border border-base-300 cursor-pointer hover:shadow-2xl transition"
                            onClick={() => openTest(test.id)}
                        >
                            <div className="card-body">
                                <h3 className="card-title">{test.name}</h3>
                                <p className="text-sm text-base-content/70">
                                    {test.description}
                                </p>

                                <div className="divider"></div>

                                <div className="flex justify-between text-sm">
                                    <span>
                                        🧪 Вопросов: <b>{test.questionCount}</b>
                                    </span>
                                    <span>
                                        ⭐ Макс. балл: <b>{test.maxScore}</b>
                                    </span>
                                    <span>
                                        ⏱ Время: <b>{formatTime(test.time)}</b>
                                    </span>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteTest(test.id);
                                        }}
                                        className="btn btn-sm btn-error btn-outline gap-2"
                                    >
                                        <FiTrash2 />
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALS */}
            {testModal && (
                <AddNewTestModal
                    onClose={() => setTestModal(false)}
                    toSave={() => getTests()}
                />
            )}

            {/* Просмотр теста */}
            {viewTest && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-6">
                    <div className="bg-base-100 w-full max-w-5xl h-[90vh] rounded-xl shadow-xl overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{viewTest.name}</h2>
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => setViewTest(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mb-2 text-base-content/70">
                            {viewTest.description}
                        </p>

                        <p className="mb-4 text-base-content/60">
                            ⏱ Время на тест: {formatTime(viewTest.time)}
                        </p>

                        <div className="space-y-4">
                            {viewLoading && (
                                <div className="flex justify-center">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </div>
                            )}

                            {!viewLoading &&
                                viewTest.questions.map((q, qi) => (
                                    <div
                                        key={q._id}
                                        className="card bg-base-100 shadow border border-base-300"
                                    >
                                        <div className="card-body">
                                            <h3 className="font-semibold mb-2">
                                                Вопрос {qi + 1}: {q.question}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                                {q.variants.map((v) => (
                                                    <div
                                                        key={v._id}
                                                        className={`flex items-center gap-2 p-2 rounded ${
                                                            v.key === q.correctAnswer
                                                                ? "succes border border-green-300"
                                                                : "bg-base-100 border border-base-200"
                                                        }`}
                                                    >
                                                        <span className="badge badge-outline">
                                                            {v.key}
                                                        </span>
                                                        <span>{v.text}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <span className="text-sm text-base-content/60">
                                                ⭐ Балл за вопрос: {q.score}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TestSetting;
