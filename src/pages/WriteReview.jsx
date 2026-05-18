import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createReviewWithPhotos } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function WriteReview() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '', content: '', visitDate: '',
    foodRating: '', atmosphereRating: '', hospitalityRating: '',
    facilitiesRating: '', accessibilityRating: '',
  })
  const [photos, setPhotos] = useState([])
  const [captions, setCaptions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handlePhotoChange = (e) => setPhotos(Array.from(e.target.files))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = new FormData()
      const reviewJson = JSON.stringify({
        stadiumId: id,
        title: formData.title,
        content: formData.content,
        visitDate: formData.visitDate || null,
        foodRating: formData.foodRating ? parseFloat(formData.foodRating) : null,
        atmosphereRating: formData.atmosphereRating ? parseFloat(formData.atmosphereRating) : null,
        hospitalityRating: formData.hospitalityRating ? parseFloat(formData.hospitalityRating) : null,
        facilitiesRating: formData.facilitiesRating ? parseFloat(formData.facilitiesRating) : null,
        accessibilityRating: formData.accessibilityRating ? parseFloat(formData.accessibilityRating) : null,
        photoCaptions: captions
      })
      data.append('review', reviewJson)
      photos.forEach(photo => data.append('photos', photo))
      await createReviewWithPhotos(data)
      navigate(`/stadiums/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review.')
    } finally {
      setLoading(false)
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

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '720px', margin: '0 auto'}}>
          <Link to={`/stadiums/${id}`} style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '16px'}}>
            ← Back to Stadium
          </Link>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: '0 0 8px'}}>Write a Review</h1>
          <p style={{color: '#94a3b8', margin: 0}}>Share your matchday experience</p>
        </div>
      </div>

      <div style={{maxWidth: '720px', margin: '0 auto', padding: '40px 24px'}}>

        {error && (
          <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: '500'}}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>Review Details</h2>
            <div style={{marginBottom: '16px'}}>
              <label style={labelStyle}>Review Title *</label>
              <input
                type="text" name="title" value={formData.title}
                onChange={handleChange} required
                placeholder="e.g. Amazing atmosphere — worth every penny!"
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
                placeholder="Describe your experience — the atmosphere, facilities, food, getting there..."
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
          <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px'}}>Category Ratings</h2>
            <p style={{color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 20px'}}>Rate each category — overall score is calculated automatically</p>
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

          {/* Photos */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px'}}>📸 Photos</h2>
            <p style={{color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 16px'}}>JPG, PNG or WebP — max 5MB each</p>
            <input
              type="file" multiple accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              style={{fontSize: '0.875rem', color: '#374151'}}
            />
            {photos.length > 0 && (
              <div style={{marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
                {photos.map((photo, index) => (
                  <div key={index}>
                    <img
                      src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`}
                      style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #f0f0f0'}}
                    />
                    <input
                      type="text" placeholder="Caption..."
                      value={captions[index] || ''}
                      onChange={(e) => {
                        const newCaptions = [...captions]
                        newCaptions[index] = e.target.value
                        setCaptions(newCaptions)
                      }}
                      style={{width: '100px', marginTop: '6px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #f0f0f0', fontSize: '0.75rem', boxSizing: 'border-box'}}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '1rem', fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            transition: 'all 0.2s'
          }}>
            {loading ? 'Submitting...' : '✅ Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}