import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getReviewById, updateReview } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function EditReview() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '', content: '', visitDate: '',
    foodRating: '', atmosphereRating: '', hospitalityRating: '',
    facilitiesRating: '', accessibilityRating: '',
  })
  const [stadiumId, setStadiumId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchReview = async () => {
      try {
        const res = await getReviewById(id)
        const review = res.data
        setStadiumId(review.stadiumId)
        setFormData({
          title: review.title,
          content: review.content,
          visitDate: review.visitDate || '',
          foodRating: review.categoryRatings?.food || '',
          atmosphereRating: review.categoryRatings?.atmosphere || '',
          hospitalityRating: review.categoryRatings?.hospitality || '',
          facilitiesRating: review.categoryRatings?.facilities || '',
          accessibilityRating: review.categoryRatings?.accessibility || '',
        })
      } catch (err) {
        console.error('Failed to fetch review', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReview()
  }, [id, user])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await updateReview(id, {
        stadiumId,
        title: formData.title,
        content: formData.content,
        visitDate: formData.visitDate || null,
        foodRating: formData.foodRating ? parseFloat(formData.foodRating) : null,
        atmosphereRating: formData.atmosphereRating ? parseFloat(formData.atmosphereRating) : null,
        hospitalityRating: formData.hospitalityRating ? parseFloat(formData.hospitalityRating) : null,
        facilitiesRating: formData.facilitiesRating ? parseFloat(formData.facilitiesRating) : null,
        accessibilityRating: formData.accessibilityRating ? parseFloat(formData.accessibilityRating) : null,
      })
      navigate(`/reviews/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update review.')
    } finally {
      setSubmitting(false)
    }
  }

  const categories = [
    { key: 'foodRating', label: '🍔 Food & Drinks' },
    { key: 'atmosphereRating', label: '🎉 Atmosphere' },
    { key: 'hospitalityRating', label: '🤝 Hospitality' },
    { key: 'facilitiesRating', label: '🏗️ Facilities' },
    { key: 'accessibilityRating', label: '♿ Accessibility' },
  ]

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '2px solid #f0f0f0', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block', fontSize: '0.875rem', fontWeight: '600',
    color: '#374151', marginBottom: '6px'
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
      <div style={{fontSize: '2rem', marginBottom: '12px'}}>📝</div>
      Loading...
    </div>
  )

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '720px', margin: '0 auto'}}>
          <Link to={`/reviews/${id}`} style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '16px'}}>
            ← Back to Review
          </Link>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: '0 0 8px'}}>Edit Review</h1>
          <p style={{color: '#94a3b8', margin: 0}}>Update your matchday experience</p>
        </div>
      </div>

      <div style={{maxWidth: '720px', margin: '0 auto', padding: '40px 24px'}}>

        {error && (
          <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: '500'}}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Details */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>Review Details</h2>
            <div style={{marginBottom: '16px'}}>
              <label style={labelStyle}>Review Title *</label>
              <input
                type="text" name="title" value={formData.title}
                onChange={handleChange} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>
            <div style={{marginBottom: '16px'}}>
              <label style={labelStyle}>Your Review *</label>
              <textarea
                name="content" value={formData.content}
                onChange={handleChange} required rows={6}
                style={{...inputStyle, resize: 'vertical'}}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Visit Date</label>
              <input
                type="date" name="visitDate" value={formData.visitDate}
                onChange={handleChange}
                style={{...inputStyle, width: 'auto'}}
              />
            </div>
          </div>

          {/* Category Ratings */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px'}}>Category Ratings</h2>
            <p style={{color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 20px'}}>Update your ratings for each category</p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
              {categories.map(cat => (
                <div key={cat.key}>
                  <label style={labelStyle}>{cat.label}</label>
                  <select
                    name={cat.key} value={formData[cat.key]}
                    onChange={handleChange}
                    style={{...inputStyle, backgroundColor: 'white', cursor: 'pointer'}}
                  >
                    <option value="">Not rated</option>
                    {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(val => (
                      <option key={val} value={val}>{'★'.repeat(Math.round(val))} {val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting} style={{
            width: '100%', padding: '16px',
            backgroundColor: submitting ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '1rem', fontWeight: '800',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            transition: 'all 0.2s'
          }}>
            {submitting ? 'Saving...' : '✅ Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}