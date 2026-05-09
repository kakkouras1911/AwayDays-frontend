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
    <div style={{maxWidth: '900px', margin: '0 auto', padding: '32px 16px'}}>

      {/* Profile Header */}
      <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px', marginBottom: '32px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: '#2563eb', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: '700'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '4px'}}>
                {user.username}
              </h1>
              <p style={{color: '#6b7280', fontSize: '0.875rem'}}>{user.email}</p>
              <p style={{color: '#6b7280', fontSize: '0.875rem', marginTop: '4px'}}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{padding: '10px 20px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem'}}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Reviews */}
      <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>
        My Reviews
      </h2>

      {loading ? (
        <div style={{textAlign: 'center', padding: '48px', color: '#6b7280'}}>Loading...</div>
      ) : reviews.length === 0 ? (
        <div style={{textAlign: 'center', padding: '48px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', color: '#6b7280'}}>
          <p style={{marginBottom: '16px'}}>You haven't written any reviews yet.</p>
          <Link to="/stadiums" style={{backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem'}}>
            Browse Stadiums
          </Link>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {reviews.map(review => (
            <div key={review.id} style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', transition: 'all 0.2s'}}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <Link to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                  <div>
                    <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '2px'}}>{review.title}</h3>
                    <p style={{color: '#2563eb', fontSize: '0.875rem', fontWeight: '500'}}>{review.stadiumName}</p>
                  </div>
                  <div style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '999px', fontWeight: '700', fontSize: '0.875rem'}}>
                    ⭐ {parseFloat(review.overallRating).toFixed(1)}
                  </div>
                </div>
                <p style={{color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '8px'}}>
                  {review.content.length > 120 ? review.content.substring(0, 120) + '...' : review.content}
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af'}}>
                  {review.visitDate && (
                    <span>Visited: {new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}</span>
                  )}
                  <span>{review.likeCount} {review.likeCount === 1 ? 'like' : 'likes'}</span>
                </div>
              </Link>

              {/* Edit/Delete buttons */}
              <div style={{display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6'}}>
                <Link
                  to={`/reviews/${review.id}/edit`}
                  style={{padding: '6px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '500'}}
                >
                  Edit
                </Link>
                <button
                  onClick={async (e) => {
                    e.preventDefault()
                    if (window.confirm('Are you sure you want to delete this review?')) {
                      try {
                        await deleteReview(review.id)
                        setReviews(reviews.filter(r => r.id !== review.id))
                      } catch (err) {
                        console.error('Failed to delete review', err)
                      }
                    }
                  }}
                  style={{padding: '6px 14px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: 'white', color: '#dc2626', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer'}}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}