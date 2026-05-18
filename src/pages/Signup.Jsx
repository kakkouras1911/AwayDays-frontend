import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signup } from '../services/api'
import logo from '../assets/logo.png'

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await signup(formData)
      const { token, userId, username, email } = response.data
      loginUser({ userId, username, email }, token)
      navigate('/')
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '24px',
        width: '100%', maxWidth: '420px', padding: '40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <img src={logo} alt="AwayDays" style={{height: '56px', width: 'auto', marginBottom: '16px'}} />
          <h2 style={{fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px'}}>Create an account</h2>
          <p style={{color: '#6b7280', fontSize: '0.875rem', margin: 0}}>Join AwayDays and start reviewing stadiums</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', padding: '12px 16px', borderRadius: '10px',
            marginBottom: '20px', fontSize: '0.875rem', fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Username', name: 'username', type: 'text', placeholder: 'yourname' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name} style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>
                {field.label}
              </label>
              <input
                type={field.type} name={field.name}
                value={formData[field.name]} onChange={handleChange}
                required placeholder={field.placeholder}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '2px solid #f0f0f0', fontSize: '0.95rem', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>
          ))}

          <div style={{marginBottom: '24px'}} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s'
          }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '24px', margin: '24px 0 0'}}>
          Already have an account?{' '}
          <Link to="/login" style={{color: '#2563eb', fontWeight: '700', textDecoration: 'none'}}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}