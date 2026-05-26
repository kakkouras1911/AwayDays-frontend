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
import AdminPanel from './pages/AdminPanel'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import WriteArticle from './pages/WriteArticle'
import Compare from './pages/Compare'


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
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/articles/new" element={<WriteArticle />} />
        <Route path="/compare" element={<Compare />} />
        
      </Routes>
      <ChatWidget />
    </div>
  )
}

export default App