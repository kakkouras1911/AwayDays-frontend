import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createArticle, getStadiums } from '../services/api'

export default function WriteArticle() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stadiums, setStadiums] = useState([])
  const [formData, setFormData] = useState({
    title: '', content: '', tags: '', stadiumId: ''
  })
  const [coverImage, setCoverImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || (user.role !== 'AUTHOR' && user.role !== 'ADMIN')) {
      navigate('/')
      return
    }
    getStadiums().then(res => setStadiums(res.data)).catch(() => {})
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('authorId', user.userId)
      data.append('title', formData.title)
      data.append('content', formData.content)
      data.append('tags', formData.tags)
      if (formData.stadiumId) data.append('stadiumId', formData.stadiumId)
      if (coverImage) data.append('coverImage', coverImage)
      const res = await createArticle(data)
      navigate(`/articles/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create article')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '2px solid #f0f0f0', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit'
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: '0 0 8px'}}>
            ✍️ Write an Article
          </h1>
          <p style={{color: '#94a3b8', margin: 0}}>Share your football knowledge with the community</p>
        </div>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 24px'}}>
        {error && (
          <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.875rem'}}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>Article Details</h2>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Title *</label>
              <input
                type="text" required value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. The Ultimate Guide to Visiting Old Trafford"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Content *</label>
              <textarea
                required value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Write your article here..."
                rows={12}
                style={{...inputStyle, resize: 'vertical'}}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Tags</label>
              <input
                type="text" value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g. matchday guide, Premier League, atmosphere"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Related Stadium (optional)</label>
              <select
                value={formData.stadiumId}
                onChange={e => setFormData({...formData, stadiumId: e.target.value})}
                style={{...inputStyle, backgroundColor: 'white', cursor: 'pointer'}}
              >
                <option value="">No specific stadium</option>
                {stadiums.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.city}, {s.country}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Cover Image</label>
              <input
                type="file" accept="image/*"
                onChange={e => setCoverImage(e.target.files[0])}
                style={{fontSize: '0.875rem'}}
              />
              {coverImage && (
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Preview"
                  style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', marginTop: '12px'}}
                />
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '1rem', fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}>
            {loading ? 'Saving...' : '✅ Save Article'}
          </button>
        </form>
      </div>
    </div>
  )
}