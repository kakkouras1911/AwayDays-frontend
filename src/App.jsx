import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Stadiums from './pages/Stadiums'
import StadiumDetail from './pages/StadiumDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stadiums" element={<Stadiums />} />
        <Route path="/stadiums/:id" element={<StadiumDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App