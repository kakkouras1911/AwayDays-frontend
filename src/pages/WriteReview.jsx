import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createReviewWithPhotos } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function WriteReview() {
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
  const [photos, setPhotos] = useState([])
  const [captions, setCaptions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files))
  }

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
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { key: 'foodRating', label: 'Food & Drinks' },
    { key: 'atmosphereRating', label: 'Atmosphere' },
    { key: 'hospitalityRating', label: 'Hospitality' },
    { key: 'facilitiesRating', label: 'Facilities' },
    { key: 'accessibilityRating', label: 'Accessibility' },
  ]

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '32px 16px'}}>
      
      <Link to={`/stadiums/${id}`} style={{color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem'}}>
        ← Back to Stadium
      </Link>

      <h1 style={{fontSize: '2rem', fontWeight: '800', color: '#111827', margin: '16px 0 8px'}}>
        Write a Review
      </h1>
      <p style={{color: '#6b7280', marginBottom: '32px'}}>Share your experience at this stadium</p>

      {error && (
        <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.875rem'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>
            Review Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Amazing atmosphere at Old Trafford!"
            style={{width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        {/* Content */}
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>
            Your Review *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe your experience at this stadium..."
            style={{width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
          />
        </div>

        {/* Visit Date */}
        <div style={{marginBottom: '32px'}}>
          <label style={{display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>
            Visit Date
          </label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            style={{padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none'}}
          />
        </div>

        {/* Category Ratings */}
        <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px'}}>
          <h2 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>Category Ratings</h2>
          <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '20px'}}>Rate each category from 1.0 to 5.0 (overall will be calculated automatically)</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
            {categories.map(cat => (
              <div key={cat.key}>
                <label style={{display: 'block', fontWeight: '500', color: '#374151', marginBottom: '6px', fontSize: '0.875rem'}}>
                  {cat.label}
                </label>
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

        {/* Photos */}
        <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '32px'}}>
          <h2 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>Photos</h2>
          <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px'}}>Upload photos from your visit (JPG, PNG, WebP — max 5MB each)</p>
          
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            style={{fontSize: '0.875rem', color: '#374151'}}
          />

          {photos.length > 0 && (
            <div style={{marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
              {photos.map((photo, index) => (
                <div key={index} style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb'}}
                  />
                  <input
                    type="text"
                    placeholder="Caption..."
                    value={captions[index] || ''}
                    onChange={(e) => {
                      const newCaptions = [...captions]
                      newCaptions[index] = e.target.value
                      setCaptions(newCaptions)
                    }}
                    style={{width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.75rem', boxSizing: 'border-box'}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}