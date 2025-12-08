import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import MentorsDashboard from './Pages/MentorsDashboard'
import Loader from './Components/Loader'
import axios from 'axios'


const App = () => {

  const [loader, setLoader] = useState(true)

  const getQuestsList = async () => {
    try {
      const { data } = await axios.get(`https://json-questions-3.onrender.com/tests`)
      setLoader(false)
    } catch (err) {
      console.log(err)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    getQuestsList()
    const themeGet = JSON.parse(localStorage.getItem(`theme`)) || 'light'
    document.documentElement.setAttribute("data-theme", themeGet);
  }, [])

  return (
    <>

      {loader ? < Loader /> :
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/MentorsDashboard/*' element={<MentorsDashboard />} />
        </Routes>
      }

    </>
  )
}

export default App