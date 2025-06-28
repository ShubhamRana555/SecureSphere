import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore.js'
import Login from './pages/Login.jsx' 
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'
import DeactivateAccount from './pages/DeactivateAccount.jsx'
import DeleteAccount from './pages/DeleteAccount.jsx'

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to={token ? "/profile" : "/login"} />}/>
        <Route path='/login' element={token ? <Navigate to='/profile' /> : <Login />}/>
        <Route path='/register' element={token ? <Navigate to='/profile'/> : <Register />}/>
        <Route path='/profile' element={token ? <Profile /> : <Navigate to='/login' />}/>        
        <Route path='/profilee' element={<Profile />}/>
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/deactivate-account" element={<DeactivateAccount />} />
        <Route path="/delete-account" element={<DeleteAccount />} />

      </Routes>
    </ Router>
  )
}

export default App
