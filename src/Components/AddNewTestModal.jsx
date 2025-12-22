import axios from "axios";
import React, { useState } from "react";

const emptyQuestion = () => ({
    question: "",
    variants: [
        { key: "a", text: "" },
        { key: "b", text: "" },
        { key: "c", text: "" },
        { key: "d", text: "" },
    ],
    correctAnswer: "a",
    score: 1,
    collapsed: false,
});

const AddNewTestModal = ({ onClose, toSave }) => {
    const [testName, setTestName] = useState("");
    const [description, setDescription] = useState("");
    const [timeMinutes, setTimeMinutes] = useState(""); // время в минутах
    const [questions, setQuestions] = useState([emptyQuestion()]);

    const updateQuestion = (index, field, value) => {
        const copy = [...questions];
        copy[index][field] = value;
        setQuestions(copy);
    };

    const updateVariant = (qIndex, vIndex, value) => {
        const copy = [...questions];
        copy[qIndex].variants[vIndex].text = value;
        setQuestions(copy);
    };

    const addQuestion = () => {
        const copy = [...questions];
        copy[copy.length - 1].collapsed = true;
        setQuestions([...copy, emptyQuestion()]);
    };

    const toggleQuestion = (index) => {
        const copy = [...questions];
        copy[index].collapsed = !copy[index].collapsed;
        setQuestions(copy);
    };

    const deleteQuestion = (index) => {
        if (questions.length === 1) return;
        const confirmDelete = window.confirm("Удалить этот вопрос?");
        if (!confirmDelete) return;
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    const saveTest = async () => {
        // Проверка: есть хотя бы один вопрос
        if (questions.length === 0) {
            alert("Добавьте хотя бы один вопрос!");
            return;
        }

        // Проверка каждого вопроса
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            if (!q.question.trim()) {
                alert(`Вопрос №${i + 1} пустой!`);
                return;
            }

            for (let v of q.variants) {
                if (!v.text.trim()) {
                    alert(`Все варианты ответа для вопроса №${i + 1} должны быть заполнены!`);
                    return;
                }
            }

            if (!["a", "b", "c", "d"].includes(q.correctAnswer)) {
                alert(`Выберите правильный ответ для вопроса №${i + 1}`);
                return;
            }
        }

        // Проверка времени
        const timeMin = parseInt(timeMinutes);
        if (isNaN(timeMin) || timeMin <= 0) {
            alert("Введите корректное время на тест (минуты)!");
            return;
        }

        // Конвертация в миллисекунды
        const timeMs = timeMin * 60 * 1000;

        // Всё ок, отправляем на сервер
        try {
            const payload = {
                name: testName,
                description,
                time: timeMs, // время в миллисекундах
                maxScore: questions.reduce((s, q) => s + q.score, 0),
                questions: questions.map(({ collapsed, ...q }) => q),
            };

            await axios.post(`https://json-questions-2.onrender.com/tests`, payload);

            toSave();
            onClose();
        } catch (err) {
            console.log(err);
            alert("Ошибка при сохранении теста!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-6">
            <div className="bg-base-100 w-full max-w-5xl h-[90vh] rounded-xl shadow-xl overflow-y-auto p-6">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">➕ Создание теста</h2>
                    <button className="btn btn-sm btn-ghost" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* TEST INFO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <input
                        className="input input-bordered w-full"
                        placeholder="Название теста"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                    />
                    <input
                        className="input input-bordered w-full"
                        placeholder="Описание теста"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        className="input input-bordered w-full"
                        type="number"
                        min={1}
                        placeholder="Время на тест (минуты)"
                        value={timeMinutes}
                        onChange={(e) => setTimeMinutes(e.target.value)}
                    />
                </div>

                {/* QUESTIONS */}
                <div className="space-y-4">
                    {questions.map((q, qi) => (
                        <div
                            key={qi}
                            className={`card border transition-all duration-300 ${
                                q.collapsed ? "bg-base-200 cursor-pointer" : "bg-base-100 shadow"
                            }`}
                            onClick={() => q.collapsed && toggleQuestion(qi)}
                        >
                            <div className="card-body">
                                {q.collapsed ? (
                                    <h3 className="font-semibold">
                                        ❓ {q.question || "Новый вопрос"}
                                    </h3>
                                ) : (
                                    <>
                                        <h3 className="font-semibold mb-3">
                                            Вопрос {qi + 1}
                                        </h3>

                                        <input
                                            className="input input-bordered w-full mb-4"
                                            placeholder="Введите вопрос"
                                            value={q.question}
                                            onChange={(e) => updateQuestion(qi, "question", e.target.value)}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.variants.map((v, vi) => (
                                                <div key={v.key} className="flex items-center gap-2">
                                                    <span className="badge badge-outline">{v.key}</span>
                                                    <input
                                                        className="input input-bordered w-full"
                                                        placeholder={`Вариант ${v.key}`}
                                                        value={v.text}
                                                        onChange={(e) => updateVariant(qi, vi, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <select
                                                className="select select-bordered"
                                                value={q.correctAnswer}
                                                onChange={(e) =>
                                                    updateQuestion(qi, "correctAnswer", e.target.value)
                                                }
                                            >
                                                <option value="a">Правильный: A</option>
                                                <option value="b">Правильный: B</option>
                                                <option value="c">Правильный: C</option>
                                                <option value="d">Правильный: D</option>
                                            </select>

                                            <div className="flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleQuestion(qi);
                                                    }}
                                                >
                                                    Свернуть
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-error btn-outline"
                                                    disabled={questions.length === 1}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteQuestion(qi);
                                                    }}
                                                >
                                                    🗑 Удалить
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between mt-8">
                    <button className="btn btn-outline" onClick={addQuestion}>
                        ➕ Добавить вопрос
                    </button>

                    <button className="btn btn-primary" onClick={saveTest}>
                        💾 Сохранить тест
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewTestModal;
