import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Stadiums from './pages/Stadiums'
import StadiumDetail from './pages/StadiumDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ReviewDetail from './pages/ReviewDetail'
import WriteReview from './pages/WriteReview'
import Profile from './pages/Profile'
import EditReview from './pages/EditReview'
import Leaderboard from './pages/Leaderboard'
import ChatWidget from './components/ChatWidget'


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
        <Route path="/reviews/:id" element={<ReviewDetail />} />
        <Route path="/stadiums/:id/review" element={<WriteReview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews/:id/edit" element={<EditReview />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        
      </Routes>
      <ChatWidget />
    </div>
  )
}

export default App