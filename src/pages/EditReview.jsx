import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getReviewById, updateReview } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function EditReview() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visitDate: '',
    foodRating: '',
    atmosphereRating: '',
    hospitalityRating: '',
    facilitiesRating: '',
    accessibilityRating: '',
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
    { key: 'foodRating', label: 'Food & Drinks' },
    { key: 'atmosphereRating', label: 'Atmosphere' },
    { key: 'hospitalityRating', label: 'Hospitality' },
    { key: 'facilitiesRating', label: 'Facilities' },
    { key: 'accessibilityRating', label: 'Accessibility' },
  ]

  if (loading) return <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Loading...</div>

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '32px 16px'}}>
      <Link to={`/reviews/${id}`} style={{color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem'}}>
        ← Back to Review
      </Link>

      <h1 style={{fontSize: '2rem', fontWeight: '800', color: '#111827', margin: '16px 0 8px'}}>
        Edit Review
      </h1>
      <p style={{color: '#6b7280', marginBottom: '32px'}}>Update your review</p>

      {error && (
        <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.875rem'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>Review Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>Your Review *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            style={{width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '32px'}}>
          <label style={{display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>Visit Date</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            style={{padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none'}}
          />
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '32px'}}>
          <h2 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>Category Ratings</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
            {categories.map(cat => (
              <div key={cat.key}>
                <label style={{display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>{cat.label}</label>
                <select
                  name={cat.key}
                  value={formData[cat.key]}
                  onChange={handleChange}
                  style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white'}}
                >
                  <option value="">Not rated</option>
                  {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(val => (
                    <option key={val} value={val}>{val} ⭐</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            backgroundColor: submitting ? '#93c5fd' : '#2563eb',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}