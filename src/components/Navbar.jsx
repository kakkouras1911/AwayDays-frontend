import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    }}>
      <div style={{maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px'}}>
        
        {/* Logo */}
        <Link to="/" style={{display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
          <img src={logo} alt="AwayDays" style={{height: '36px', width: 'auto'}} />
        </Link>

        {/* Center Links */}
  
    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
      {[
        { path: '/stadiums', label: 'Stadiums' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/articles', label: 'Articles' },
        {path: '/compare', label: 'Compare' },
        {path: '/shop', label: 'Shop' },
        ...(user?.role === 'ADMIN' ? [{ path: '/admin', label: '⚙️ Admin' }] : [])
      ].map(link => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: isActive(link.path) ? '700' : '500',
            color: isActive(link.path) ? '#2563eb' : '#4b5563',
            backgroundColor: isActive(link.path) ? '#eff6ff' : 'transparent',
            transition: 'all 0.15s'
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>

        {/* Auth */}
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {user ? (
            <>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#2563eb', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: '700'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{fontSize: '0.875rem', fontWeight: '600', color: '#374151'}}>
                  {user.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4b5563',
                  transition: 'all 0.15s'
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  transition: 'all 0.15s',
                  boxShadow: '0 2px 4px rgba(37,99,235,0.3)'
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}