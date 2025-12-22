import React, { useEffect, useState } from 'react'
import axios from 'axios'

const TestsHistory = () => {
    const [tests, setTests] = useState([])
    const [users, setUsers] = useState([])
    const [allTests, setAllTests] = useState([])
    const [assignments, setAssignments] = useState([])
    const [comments, setComments] = useState({})
    const [achievements, setAchievements] = useState([])
    const [learningPaths, setLearningPaths] = useState([])
    const [studyMaterials, setStudyMaterials] = useState([])
    const [mentorAnalytics, setMentorAnalytics] = useState(null)
    const [notifications, setNotifications] = useState([])
    
    const [selectedResult, setSelectedResult] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('results')
    
    // Модальные окна
    const [showCommentModal, setShowCommentModal] = useState(false)
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
    const [showExtendModal, setShowExtendModal] = useState(false)
    const [showCreateAchievementModal, setShowCreateAchievementModal] = useState(false)
    const [showCreatePathModal, setShowCreatePathModal] = useState(false)
    const [showAssignPathModal, setShowAssignPathModal] = useState(false)
    const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false)
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
    const [showNotificationsModal, setShowNotificationsModal] = useState(false)
    
    // Формы
    const [commentForm, setCommentForm] = useState({ text: '', rating: 5 })
    const [assignForm, setAssignForm] = useState({ 
        student_id: '', 
        test_id: '', 
        deadline: '' 
    })
    const [extendDeadline, setExtendDeadline] = useState('')
    const [achievementForm, setAchievementForm] = useState({
        name: '',
        description: '',
        icon: '🏆',
        condition_type: 'tests_completed',
        condition_value: 1,
        points: 10
    })
    const [pathForm, setPathForm] = useState({
        name: '',
        description: '',
        tests: []
    })
    const [materialForm, setMaterialForm] = useState({
        title: '',
        description: '',
        type: 'link',
        content: '',
        test_id: ''
    })
    
    const API_URL = 'https://json-questions-3.onrender.com'
    const mentorId = localStorage.getItem('mentorId') || '673xyz456abc789'

    useEffect(() => {
        loadAllData()
        const interval = setInterval(loadNotifications, 30000) // обновление уведомлений каждые 30 сек
        return () => clearInterval(interval)
    }, [])

    const loadAllData = async () => {
        setLoading(true)
        try {
            const [
                testsRes, 
                usersRes, 
                allTestsRes, 
                assignmentsRes,
                achievementsRes,
                pathsRes,
                materialsRes,
                analyticsRes
            ] = await Promise.all([
                axios.get(`${API_URL}/results`),
                axios.get(`${API_URL}/users`),
                axios.get(`${API_URL}/tests`),
                axios.get(`${API_URL}/assignments/mentor/${mentorId}`),
                axios.get(`${API_URL}/achievements`),
                axios.get(`${API_URL}/learning-paths`),
                axios.get(`${API_URL}/study-materials`),
                axios.get(`${API_URL}/analytics/mentor/${mentorId}`)
            ])
            
            setTests(testsRes.data)
            setUsers(usersRes.data)
            setAllTests(allTestsRes.data)
            setAssignments(assignmentsRes.data)
            setAchievements(achievementsRes.data)
            setLearningPaths(pathsRes.data)
            setStudyMaterials(materialsRes.data)
            setMentorAnalytics(analyticsRes.data)
            
            // Загрузить комментарии
            testsRes.data.forEach(result => loadComments(result.id))
            
            // Загрузить уведомления
            await loadNotifications()
        } catch (err) {
            console.error('Ошибка загрузки данных:', err)
            showToast('Ошибка загрузки данных', 'error')
        } finally {
            setLoading(false)
        }
    }

    const loadComments = async (resultId) => {
        try {
            const res = await axios.get(`${API_URL}/comments/result/${resultId}`)
            setComments(prev => ({ ...prev, [resultId]: res.data }))
        } catch (err) {
            console.log('Комментарии не загружены:', err.message)
        }
    }

    const loadNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/notifications/mentor/${mentorId}/unread`)
            setNotifications(res.data)
        } catch (err) {
            console.log('Уведомления не загружены:', err.message)
        }
    }

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.patch(`${API_URL}/notifications/${notificationId}/read`)
            loadNotifications()
        } catch (err) {
            console.error('Ошибка отметки уведомления:', err)
        }
    }

    const markAllNotificationsAsRead = async () => {
        try {
            await axios.patch(`${API_URL}/notifications/mentor/${mentorId}/read-all`)
            loadNotifications()
            showToast('Все уведомления прочитаны', 'success')
        } catch (err) {
            showToast('Ошибка отметки уведомлений', 'error')
        }
    }

    // ==================== КОММЕНТАРИИ ====================
    const handleAddComment = async () => {
        if (!selectedResult || !commentForm.text.trim()) {
            showToast('Напишите комментарий', 'warning')
            return
        }

        try {
            await axios.post(`${API_URL}/comments`, {
                result_id: selectedResult.id,
                mentor_id: mentorId,
                text: commentForm.text,
                rating: commentForm.rating
            })
            
            setCommentForm({ text: '', rating: 5 })
            setShowCommentModal(false)
            await loadComments(selectedResult.id)
            showToast('Комментарий добавлен! Студент получил уведомление', 'success')
        } catch (err) {
            console.error(err)
            showToast('Ошибка при добавлении комментария', 'error')
        }
    }

    // ==================== НАЗНАЧЕНИЯ ====================
    const handleAssignTest = async () => {
        if (!assignForm.student_id || !assignForm.test_id || !assignForm.deadline) {
            showToast('Заполните все поля', 'warning')
            return
        }

        try {
            await axios.post(`${API_URL}/assignments`, {
                mentor_id: mentorId,
                student_id: assignForm.student_id,
                test_id: assignForm.test_id,
                deadline: new Date(assignForm.deadline).toISOString()
            })
            
            setAssignForm({ student_id: '', test_id: '', deadline: '' })
            setShowAssignModal(false)
            loadAllData()
            showToast('Тест назначен! Студент получил уведомление', 'success')
        } catch (err) {
            console.error(err)
            showToast(err.response?.data?.message || 'Ошибка назначения', 'error')
        }
    }

    const handleExtendDeadline = async () => {
        if (!extendDeadline) {
            showToast('Укажите новый срок', 'warning')
            return
        }

        try {
            await axios.patch(`${API_URL}/assignments/${selectedResult.id}/extend`, {
                new_deadline: new Date(extendDeadline).toISOString()
            })
            
            setShowExtendModal(false)
            setExtendDeadline('')
            loadAllData()
            showToast('Срок продлен! Студент уведомлен', 'success')
        } catch (err) {
            showToast('Ошибка продления срока', 'error')
        }
    }

    const handleCancelAssignment = async (assignmentId) => {
        if (!confirm('Отменить это задание?')) return

        try {
            await axios.patch(`${API_URL}/assignments/${assignmentId}/cancel`)
            loadAllData()
            showToast('Задание отменено!', 'success')
        } catch (err) {
            showToast('Ошибка отмены задания', 'error')
        }
    }

    // ==================== ДОСТИЖЕНИЯ ====================
    const handleCreateAchievement = async () => {
        if (!achievementForm.name || !achievementForm.description) {
            showToast('Заполните все поля', 'warning')
            return
        }

        try {
            await axios.post(`${API_URL}/achievements`, achievementForm)
            setAchievementForm({
                name: '',
                description: '',
                icon: '🏆',
                condition_type: 'tests_completed',
                condition_value: 1,
                points: 10
            })
            setShowCreateAchievementModal(false)
            loadAllData()
            showToast('Достижение создано!', 'success')
        } catch (err) {
            showToast('Ошибка создания достижения', 'error')
        }
    }

    const handleDeleteAchievement = async (id) => {
        if (!confirm('Удалить это достижение?')) return

        try {
            await axios.delete(`${API_URL}/achievements/${id}`)
            loadAllData()
            showToast('Достижение удалено!', 'success')
        } catch (err) {
            showToast('Ошибка удаления', 'error')
        }
    }

    // ==================== УЧЕБНЫЕ ПУТИ ====================
    const handleCreateLearningPath = async () => {
        if (!pathForm.name || pathForm.tests.length === 0) {
            showToast('Заполните все поля и добавьте тесты', 'warning')
            return
        }

        try {
            await axios.post(`${API_URL}/learning-paths`, {
                ...pathForm,
                mentor_id: mentorId
            })
            setPathForm({ name: '', description: '', tests: [] })
            setShowCreatePathModal(false)
            loadAllData()
            showToast('Учебный путь создан!', 'success')
        } catch (err) {
            showToast('Ошибка создания пути', 'error')
        }
    }

    const handleAssignPath = async (pathId, studentId) => {
        try {
            await axios.post(`${API_URL}/learning-paths/${pathId}/assign/${studentId}`)
            showToast('Путь назначен студенту! Он получил уведомление', 'success')
            setShowAssignPathModal(false)
        } catch (err) {
            showToast(err.response?.data?.message || 'Ошибка назначения пути', 'error')
        }
    }

    const handleDeletePath = async (id) => {
        if (!confirm('Удалить этот учебный путь?')) return

        try {
            await axios.delete(`${API_URL}/learning-paths/${id}`)
            loadAllData()
            showToast('Путь удален!', 'success')
        } catch (err) {
            showToast('Ошибка удаления', 'error')
        }
    }

    const addTestToPath = (testId) => {
        if (pathForm.tests.find(t => t.test_id === testId)) {
            showToast('Тест уже добавлен', 'warning')
            return
        }

        setPathForm({
            ...pathForm,
            tests: [...pathForm.tests, {
                test_id: testId,
                order: pathForm.tests.length + 1,
                required_score: 70
            }]
        })
    }

    const removeTestFromPath = (testId) => {
        setPathForm({
            ...pathForm,
            tests: pathForm.tests.filter(t => t.test_id !== testId)
        })
    }

    // ==================== УЧЕБНЫЕ МАТЕРИАЛЫ ====================
    const handleCreateMaterial = async () => {
        if (!materialForm.title || !materialForm.content) {
            showToast('Заполните все поля', 'warning')
            return
        }

        try {
            await axios.post(`${API_URL}/study-materials`, {
                ...materialForm,
                mentor_id: mentorId
            })
            setMaterialForm({
                title: '',
                description: '',
                type: 'link',
                content: '',
                test_id: ''
            })
            setShowCreateMaterialModal(false)
            loadAllData()
            showToast('Материал создан!', 'success')
        } catch (err) {
            showToast('Ошибка создания материала', 'error')
        }
    }

    const handleDeleteMaterial = async (id) => {
        if (!confirm('Удалить этот материал?')) return

        try {
            await axios.delete(`${API_URL}/study-materials/${id}`)
            loadAllData()
            showToast('Материал удален!', 'success')
        } catch (err) {
            showToast('Ошибка удаления', 'error')
        }
    }

    // ==================== УПРАВЛЕНИЕ СТУДЕНТАМИ ====================
    const handleDeleteUser = async () => {
        if (!selectedStudent) return

        try {
            await axios.delete(`${API_URL}/users/${selectedStudent.id}`)
            setShowDeleteUserModal(false)
            setSelectedStudent(null)
            loadAllData()
            showToast('Студент удален!', 'success')
        } catch (err) {
            showToast('Ошибка удаления студента', 'error')
        }
    }

    // ==================== АНАЛИТИКА ====================
    const getStudentAnalytics = async (studentId) => {
        try {
            const res = await axios.get(`${API_URL}/analytics/student/${studentId}`)
            setSelectedResult(res.data)
            setShowAnalyticsModal(true)
        } catch (err) {
            showToast('Ошибка загрузки аналитики', 'error')
        }
    }

    // ==================== УТИЛИТЫ ====================
    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast')
        const toastMessage = document.getElementById('toast_message')
        const alertDiv = toast?.querySelector('.alert')
        
        if (toast && toastMessage && alertDiv) {
            toastMessage.textContent = message
            
            alertDiv.className = `alert alert-${type}`
            
            toast.classList.remove('hidden')
            setTimeout(() => {
                toast.classList.add('hidden')
            }, 3000)
        }
    }

    const filteredTests = tests.filter(test => {
        const student = users.find(u => u.id === test.student_id)
        const matchesSearch = student 
            ? `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
            : false
        
        if (filterStatus === 'all') return matchesSearch
        
        const percentage = (test.test_score / test.test_max_score) * 100
        if (filterStatus === 'passed') return percentage >= 70 && matchesSearch
        if (filterStatus === 'failed') return percentage < 70 && matchesSearch
        
        return matchesSearch
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg">Загрузка панели ментора...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            {/* Toast */}
            <div id="toast" className="toast toast-top toast-end hidden z-50">
                <div className="alert alert-success">
                    <span id="toast_message">✅ Успешно!</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-primary">
                            👨‍🏫 Панель ментора
                        </h1>
                        <p className="text-base-content/70 mt-2">
                            Полное управление учебным процессом
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        {/* Notifications Button */}
                        <button 
                            className="btn btn-ghost btn-circle"
                            onClick={() => setShowNotificationsModal(true)}
                        >
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {notifications.length > 0 && (
                                    <span className="badge badge-xs badge-error indicator-item">{notifications.length}</span>
                                )}
                            </div>
                        </button>

                        {/* Create Menu */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-primary btn-lg gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Создать
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 mt-2">
                                <li><a onClick={() => setShowAssignModal(true)}>📝 Назначить тест</a></li>
                                <li><a onClick={() => setShowCreateAchievementModal(true)}>🏆 Создать достижение</a></li>
                                <li><a onClick={() => setShowCreatePathModal(true)}>📚 Создать учебный путь</a></li>
                                <li><a onClick={() => setShowCreateMaterialModal(true)}>📖 Добавить материал</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Analytics Summary */}
                {mentorAnalytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="stat bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl rounded-box">
                            <div className="stat-title text-primary-content/80">Студентов</div>
                            <div className="stat-value">{mentorAnalytics.summary.totalStudents}</div>
                            <div className="stat-desc text-primary-content/60">Всего под вашим руководством</div>
                        </div>
                        
                        <div className="stat bg-gradient-to-br from-success to-success-focus text-success-content shadow-xl rounded-box">
                            <div className="stat-title text-success-content/80">Заданий выполнено</div>
                            <div className="stat-value">{mentorAnalytics.summary.completedAssignments}</div>
                            <div className="stat-desc text-success-content/60">Из {mentorAnalytics.summary.totalAssignments}</div>
                        </div>
                        
                        <div className="stat bg-gradient-to-br from-warning to-warning-focus text-warning-content shadow-xl rounded-box">
                            <div className="stat-title text-warning-content/80">Процент выполнения</div>
                            <div className="stat-value">{mentorAnalytics.summary.completionRate}%</div>
                            <div className="stat-desc text-warning-content/60">Средняя успеваемость</div>
                        </div>
                        
                        <div className="stat bg-gradient-to-br from-info to-info-focus text-info-content shadow-xl rounded-box">
                            <div className="stat-title text-info-content/80">Средний балл</div>
                            <div className="stat-value">{mentorAnalytics.summary.averageStudentPercentage}%</div>
                            <div className="stat-desc text-info-content/60">По всем студентам</div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6 p-2">
                    <a className={`tab tab-lg ${activeTab === 'results' ? 'tab-active' : ''}`} onClick={() => setActiveTab('results')}>
                        📊 Результаты тестов
                    </a>
                    <a className={`tab tab-lg ${activeTab === 'assignments' ? 'tab-active' : ''}`} onClick={() => setActiveTab('assignments')}>
                        📝 Назначения ({assignments.length})
                    </a>
                    <a className={`tab tab-lg ${activeTab === 'students' ? 'tab-active' : ''}`} onClick={() => setActiveTab('students')}>
                        👥 Студенты ({users.length})
                    </a>
                    <a className={`tab tab-lg ${activeTab === 'achievements' ? 'tab-active' : ''}`} onClick={() => setActiveTab('achievements')}>
                        🏆 Достижения ({achievements.length})
                    </a>
                    <a className={`tab tab-lg ${activeTab === 'paths' ? 'tab-active' : ''}`} onClick={() => setActiveTab('paths')}>
                        📚 Учебные пути ({learningPaths.length})
                    </a>
                    <a className={`tab tab-lg ${activeTab === 'materials' ? 'tab-active' : ''}`} onClick={() => setActiveTab('materials')}>
                        📖 Материалы ({studyMaterials.length})
                    </a>
                </div>

                {/* RESULTS TAB */}
                {activeTab === 'results' && (
                    <div className="space-y-6">
                        {/* Search and Filters */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <input 
                                            type="text" 
                                            placeholder="Поиск по имени студента..." 
                                            className="input input-bordered w-full"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                                            onClick={() => setFilterStatus('all')}
                                        >
                                            Все
                                        </button>
                                        <button 
                                            className={`btn ${filterStatus === 'passed' ? 'btn-success' : 'btn-ghost'}`}
                                            onClick={() => setFilterStatus('passed')}
                                        >
                                            Сданные
                                        </button>
                                        <button 
                                            className={`btn ${filterStatus === 'failed' ? 'btn-error' : 'btn-ghost'}`}
                                            onClick={() => setFilterStatus('failed')}
                                        >
                                            Не сданные
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="space-y-4">
                            {filteredTests.map((m) => {
                                const student = users.find((f) => f.id === m.student_id)
                                const percentage = Math.round((m.test_score / m.test_max_score) * 100)
                                const resultComments = comments[m.id] || []

                                return (
                                    <div key={m.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                                        <div className="card-body">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-primary text-primary-content rounded-full w-16">
                                                            <span className="text-xl">
                                                                {student?.firstName?.charAt(0)}{student?.lastName?.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">
                                                            {student ? `${student.firstName} ${student.lastName}` : "Студент не найден"}
                                                        </h3>
                                                        <p className="text-sm text-base-content/70">
                                                            {new Date(m.test_date).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className={`badge badge-lg ${
                                                        percentage >= 90 ? 'badge-success' :
                                                        percentage >= 70 ? 'badge-warning' :
                                                        'badge-error'
                                                    }`}>
                                                        {percentage}%
                                                    </div>
                                                    <span className="font-semibold text-lg">
                                                        {m.test_score} / {m.test_max_score}
                                                    </span>
                                                    <progress
                                                        className={`progress w-32 ${
                                                            percentage >= 90 ? 'progress-success' :
                                                            percentage >= 70 ? 'progress-warning' :
                                                            'progress-error'
                                                        }`}
                                                        value={m.test_score}
                                                        max={m.test_max_score}
                                                    ></progress>
                                                </div>
                                            </div>

                                            {resultComments.length > 0 && (
                                                <div className="mt-4 border-t pt-4">
                                                    <h4 className="font-semibold mb-2">💬 Комментарии ({resultComments.length})</h4>
                                                    <div className="space-y-2">
                                                        {resultComments.map(comment => (
                                                            <div key={comment.id} className="bg-base-200 p-3 rounded-lg">
                                                                <p className="text-sm">{comment.text}</p>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <p className="text-xs text-base-content/60">{comment.mentor_name}</p>
                                                                    <div className="rating rating-sm">
                                                                        {[...Array(comment.rating)].map((_, i) => (
                                                                            <span key={i}>⭐</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="card-actions justify-end mt-4">
                                                <button 
                                                    className="btn btn-sm btn-ghost gap-2"
                                                    onClick={() => student && getStudentAnalytics(student.id)}
                                                >
                                                    📊 Аналитика
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-primary gap-2"
                                                    onClick={() => {
                                                        setSelectedResult(m)
                                                        setShowCommentModal(true)
                                                    }}
                                                >
                                                    💬 Комментарий
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ASSIGNMENTS TAB */}
                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        {assignments.map(assignment => (
                            <div key={assignment.id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="card-title">
                                                {assignment.student_name}
                                                <div className={`badge ${
                                                    assignment.status === 'completed' ? 'badge-success' :
                                                    assignment.status === 'overdue' ? 'badge-error' :
                                                    'badge-warning'
                                                }`}>
                                                    {assignment.status === 'completed' ? '✅ Выполнено' :
                                                     assignment.status === 'overdue' ? '⚠️ Просрочено' :
                                                     '⏳ В процессе'}
                                                </div>
                                            </h3>
                                            <p className="text-base-content/70 mt-2">📝 {assignment.test_name}</p>
                                            <p className="text-sm text-base-content/60">
                                                Срок: {new Date(assignment.deadline).toLocaleString()}
                                            </p>
                                            {assignment.result && (
                                                <div className="mt-2">
                                                    <div className="badge badge-outline">
                                                        Результат: {assignment.result.score}/{assignment.result.max_score} ({assignment.result.percentage}%)
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {assignment.status === 'overdue' && (
                                                <>
                                                    <button 
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => {
                                                            setSelectedResult(assignment)
                                                            setShowExtendModal(true)
                                                        }}
                                                    >
                                                        ⏰ Продлить
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-error"
                                                        onClick={() => handleCancelAssignment(assignment.id)}
                                                    >
                                                        ❌ Отменить
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {assignments.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-base-content/60">Нет назначенных тестов</p>
                            </div>
                        )}
                    </div>
                )}

                {/* STUDENTS TAB */}
                {activeTab === 'students' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map(user => (
                            <div key={user.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                                <div className="card-body">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar placeholder">
                                            <div className="bg-secondary text-secondary-content rounded-full w-16">
                                                <span className="text-2xl">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                                            <p className="text-sm text-base-content/70">@{user.login}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="divider my-2"></div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Общий балл:</span>
                                            <span className="font-bold">{user.totalScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Процент успеха:</span>
                                            <div className="badge badge-primary">{user.successRate}%</div>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => getStudentAnalytics(user.id)}
                                        >
                                            📊 Аналитика
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-error"
                                            onClick={() => {
                                                setSelectedStudent(user)
                                                setShowDeleteUserModal(true)
                                            }}
                                        >
                                            🗑️ Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ACHIEVEMENTS TAB */}
                {activeTab === 'achievements' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                className="btn btn-primary gap-2"
                                onClick={() => setShowCreateAchievementModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Создать достижение
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map(achievement => (
                                <div key={achievement.id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body items-center text-center">
                                        <div className="text-6xl mb-2">{achievement.icon}</div>
                                        <h3 className="card-title">{achievement.name}</h3>
                                        <p className="text-sm text-base-content/70">{achievement.description}</p>
                                        <div className="badge badge-primary badge-lg mt-2">
                                            +{achievement.points} баллов
                                        </div>
                                        <p className="text-xs text-base-content/60 mt-2">
                                            Условие: {achievement.condition_type} ≥ {achievement.condition_value}
                                        </p>
                                        <button 
                                            className="btn btn-sm btn-error mt-4"
                                            onClick={() => handleDeleteAchievement(achievement.id)}
                                        >
                                            🗑️ Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* LEARNING PATHS TAB */}
                {activeTab === 'paths' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                className="btn btn-primary gap-2"
                                onClick={() => setShowCreatePathModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Создать учебный путь
                            </button>
                        </div>

                        <div className="space-y-4">
                            {learningPaths.map(path => (
                                <div key={path.id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="card-title">{path.name}</h3>
                                        <p className="text-base-content/70">{path.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <div className="badge badge-outline">
                                                📚 {path.total_tests} тестов
                                            </div>
                                            <div className="badge badge-outline">
                                                👤 Ментор: {path.mentor_name}
                                            </div>
                                        </div>

                                        <div className="card-actions justify-end mt-4">
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    setSelectedResult(path)
                                                    setShowAssignPathModal(true)
                                                }}
                                            >
                                                📝 Назначить студенту
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-error"
                                                onClick={() => handleDeletePath(path.id)}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MATERIALS TAB */}
                {activeTab === 'materials' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                className="btn btn-primary gap-2"
                                onClick={() => setShowCreateMaterialModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Добавить материал
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studyMaterials.map(material => (
                                <div key={material.id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="card-title">
                                            {material.type === 'video' ? '🎥' :
                                             material.type === 'document' ? '📄' :
                                             material.type === 'link' ? '🔗' : '📝'} {material.title}
                                        </h3>
                                        <p className="text-sm text-base-content/70">{material.description}</p>
                                        
                                        <div className="mt-2">
                                            <a 
                                                href={material.content} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="link link-primary text-sm"
                                            >
                                                {material.content.substring(0, 50)}...
                                            </a>
                                        </div>

                                        <div className="card-actions justify-end mt-4">
                                            <button 
                                                className="btn btn-sm btn-error"
                                                onClick={() => handleDeleteMaterial(material.id)}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            
            {/* Notifications Modal */}
            {showNotificationsModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
                            🔔 Уведомления
                            {notifications.length > 0 && (
                                <button 
                                    className="btn btn-sm btn-ghost"
                                    onClick={markAllNotificationsAsRead}
                                >
                                    Прочитать все
                                </button>
                            )}
                        </h3>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8 text-base-content/60">
                                    Нет новых уведомлений
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        className={`alert ${
                                            notif.type === 'assignment' ? 'alert-info' :
                                            notif.type === 'result' ? 'alert-success' :
                                            notif.type === 'deadline' ? 'alert-warning' :
                                            'alert-info'
                                        }`}
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{notif.title}</h4>
                                            <p className="text-sm">{notif.message}</p>
                                            <p className="text-xs mt-1 opacity-70">
                                                {new Date(notif.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => markNotificationAsRead(notif.id)}
                                        >
                                            ✓
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowNotificationsModal(false)}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Comment Modal */}
            {showCommentModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">💬 Добавить комментарий</h3>
                        
                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Ваш комментарий</span></label>
                            <textarea 
                                className="textarea textarea-bordered h-24"
                                placeholder="Напишите ваш отзыв..."
                                value={commentForm.text}
                                onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Оценка: {commentForm.rating} ⭐</span></label>
                            <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={commentForm.rating}
                                className="range range-primary"
                                onChange={(e) => setCommentForm({...commentForm, rating: parseInt(e.target.value)})}
                            />
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowCommentModal(false)}>Отмена</button>
                            <button className="btn btn-primary" onClick={handleAddComment}>Отправить</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Test Modal */}
            {showAssignModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">📝 Назначить тест студенту</h3>
                        
                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Выберите студента</span></label>
                            <select 
                                className="select select-bordered w-full"
                                value={assignForm.student_id}
                                onChange={(e) => setAssignForm({...assignForm, student_id: e.target.value})}
                            >
                                <option value="">-- Выберите студента --</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Выберите тест</span></label>
                            <select 
                                className="select select-bordered w-full"
                                value={assignForm.test_id}
                                onChange={(e) => setAssignForm({...assignForm, test_id: e.target.value})}
                            >
                                <option value="">-- Выберите тест --</option>
                                {allTests.map(test => (
                                    <option key={test.id} value={test.id}>
                                        {test.name} ({test.maxScore} баллов)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label"><span className="label-text">Срок выполнения</span></label>
                            <input 
                                type="datetime-local"
                                className="input input-bordered w-full"
                                value={assignForm.deadline}
                                onChange={(e) => setAssignForm({...assignForm, deadline: e.target.value})}
                            />
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowAssignModal(false)}>Отмена</button>
                            <button className="btn btn-primary" onClick={handleAssignTest}>Назначить</button>
                        </div>
                    </div>
                </div>  
            )}
        </div>
    )
}

export default TestsHistory