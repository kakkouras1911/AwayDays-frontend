import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getReviewsByUser, deleteReview } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchReviews = async () => {
      try {
        const res = await getReviewsByUser(user.userId)
        setReviews(res.data)
      } catch (err) {
        console.error('Failed to fetch reviews', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [user])

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  if (!user) return null

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.75rem', fontWeight: '900',
              boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
              border: '3px solid rgba(255,255,255,0.2)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{color: 'white', fontSize: '1.75rem', fontWeight: '900', margin: '0 0 4px'}}>
                {user.username}
              </h1>
              <p style={{color: '#94a3b8', margin: '0 0 4px', fontSize: '0.875rem'}}>{user.email}</p>
              <p style={{color: '#60a5fa', margin: 0, fontSize: '0.875rem', fontWeight: '600'}}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written
              </p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            padding: '10px 20px', borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: 'white', cursor: 'pointer',
            fontWeight: '600', fontSize: '0.875rem',
            backdropFilter: 'blur(10px)'
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
        <h2 style={{fontSize: '1.25rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '20px'}}>
          My Reviews
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: '#6b7280'}}>Loading...</div>
        ) : reviews.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px',
            backgroundColor: 'white', borderRadius: '20px',
            border: '1px solid #f0f0f0', color: '#6b7280',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>📝</div>
            <p style={{fontWeight: '600', marginBottom: '8px', color: '#374151'}}>No reviews yet</p>
            <p style={{fontSize: '0.875rem', marginBottom: '20px'}}>Start sharing your stadium experiences!</p>
            <Link to="/stadiums" style={{
              backgroundColor: '#2563eb', color: 'white',
              padding: '10px 24px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: '700', fontSize: '0.875rem'
            }}>
              Browse Stadiums
            </Link>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {reviews.map(review => (
              <div key={review.id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                border: '1px solid #f0f0f0', padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
              >
                <Link to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div>
                      <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px'}}>{review.title}</h3>
                      <p style={{color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', margin: 0}}>{review.stadiumName}</p>
                    </div>
                    <div style={{
                      backgroundColor: '#fef3c7', color: '#d97706',
                      padding: '4px 14px', borderRadius: '999px',
                      fontWeight: '800', fontSize: '0.875rem', whiteSpace: 'nowrap'
                    }}>
                      ⭐ {parseFloat(review.overallRating).toFixed(1)}
                    </div>
                  </div>
                  <p style={{color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6', margin: '0 0 10px'}}>
                    {review.content.length > 120 ? review.content.substring(0, 120) + '...' : review.content}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af'}}>
                    {review.visitDate && (
                      <span>📅 {new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}</span>
                    )}
                    <span>👍 {review.likeCount} likes</span>
                  </div>
                </Link>

                {/* Edit/Delete */}
                <div style={{display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6'}}>
                  <Link to={`/reviews/${review.id}/edit`} style={{
                    padding: '6px 16px', borderRadius: '8px',
                    border: '1px solid #e5e7eb', backgroundColor: 'white',
                    color: '#374151', textDecoration: 'none',
                    fontSize: '0.8rem', fontWeight: '600'
                  }}>
                    ✏️ Edit
                  </Link>
                  <button onClick={async (e) => {
                    e.preventDefault()
                    if (window.confirm('Delete this review?')) {
                      try {
                        await deleteReview(review.id)
                        setReviews(reviews.filter(r => r.id !== review.id))
                      } catch (err) {
                        console.error('Failed to delete', err)
                      }
                    }
                  }} style={{
                    padding: '6px 16px', borderRadius: '8px',
                    border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                    color: '#dc2626', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                  }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}