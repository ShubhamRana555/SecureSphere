import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login' 
import Profile from './pages/Profile'
import Register from './pages/Register'

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to={token ? "/profile" : "/login"} />}/>
        <Route path='/login' element={token ? <Navigate to='/profile' /> : <Login />}/>
        <Route path='/register' element={token ? <Navigate to='/profile'/> : <Register />}/>
        <Route path='/profile' element={token ? <Profile /> : <Navigate to='/login' />}/>        
      </Routes>
    </ Router>
  )
}

export default App
