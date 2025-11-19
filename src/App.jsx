import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import MentorsDashboard from './Pages/MentorsDashboard'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/MentorsDashboard/*' element={<MentorsDashboard />} />
      </Routes>

    </>
  )
}

export default App