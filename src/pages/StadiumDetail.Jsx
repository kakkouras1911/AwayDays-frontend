import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getStadiumById, getReviewsByStadium } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function StadiumDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stadium, setStadium] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stadiumRes, reviewsRes] = await Promise.all([
          getStadiumById(id),
          getReviewsByStadium(id)
        ])
        setStadium(stadiumRes.data)
        setReviews(reviewsRes.data)
      } catch (err) {
        console.error('Failed to fetch stadium', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return (
    <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Loading...</div>
  )

  if (!stadium) return (
    <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Stadium not found.</div>
  )

  return (
    <div>
      {/* Stadium Header */}
      <div style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '48px 16px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <Link to="/stadiums" style={{color: '#bfdbfe', textDecoration: 'none', fontSize: '0.875rem'}}>
            ← Back to Stadiums
          </Link>
          <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: '800', margin: '16px 0 8px'}}>
            {stadium.name}
          </h1>
          <p style={{color: '#bfdbfe', fontSize: '1.125rem'}}>
            {stadium.city}, {stadium.country}
          </p>

          {/* Stadium Stats */}
          <div style={{display: 'flex', gap: '32px', marginTop: '24px', flexWrap: 'wrap'}}>
            {stadium.capacity && (
              <div style={{color: 'white'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{stadium.capacity.toLocaleString()}</div>
                <div style={{color: '#bfdbfe', fontSize: '0.875rem'}}>Capacity</div>
              </div>
            )}
            {stadium.averageRating && (
              <div style={{color: 'white'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700'}}>⭐ {parseFloat(stadium.averageRating).toFixed(1)}</div>
                <div style={{color: '#bfdbfe', fontSize: '0.875rem'}}>Average Rating</div>
              </div>
            )}
            <div style={{color: 'white'}}>
              <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{reviews.length}</div>
              <div style={{color: '#bfdbfe', fontSize: '0.875rem'}}>Reviews</div>
            </div>
            {stadium.homeTeam && (
              <div style={{color: 'white'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{stadium.homeTeam}</div>
                <div style={{color: '#bfdbfe', fontSize: '0.875rem'}}>Home Team</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 16px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px'}}>
          
          {/* Reviews Section */}
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827'}}>
                Reviews ({reviews.length})
              </h2>
              <button
                onClick={() => user ? navigate(`/stadiums/${id}/review`) : navigate('/login')}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                {user ? 'Write a Review' : 'Login to Review'}
              </button>
            </div>

            {reviews.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                color: '#6b7280'
              }}>
                No reviews yet. Be the first to review {stadium.name}!
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              padding: '24px',
              position: 'sticky',
              top: '84px'
            }}>
              <h3 style={{fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>
                Stadium Info
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {stadium.capacity && (
                  <InfoRow label="Capacity" value={stadium.capacity.toLocaleString()} />
                )}
                {stadium.builtYear && (
                  <InfoRow label="Built" value={stadium.builtYear} />
                )}
                {stadium.homeTeam && (
                  <InfoRow label="Home Team" value={stadium.homeTeam} />
                )}
                {stadium.address && (
                  <InfoRow label="Address" value={stadium.address} />
                )}
                {stadium.description && (
                  <p style={{color: '#6b7280', fontSize: '0.875rem', marginTop: '8px'}}>
                    {stadium.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
      <span style={{color: '#6b7280'}}>{label}</span>
      <span style={{color: '#111827', fontWeight: '500'}}>{value}</span>
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <Link to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '20px',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
          <div>
            <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
              {review.title}
            </h3>
            <p style={{color: '#6b7280', fontSize: '0.875rem'}}>by {review.username}</p>
          </div>
          <div style={{
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            padding: '4px 12px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '0.875rem'
          }}>
            ⭐ {parseFloat(review.overallRating).toFixed(1)}
          </div>
        </div>
        <p style={{color: '#374151', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '12px'}}>
          {review.content.length > 150 ? review.content.substring(0, 150) + '...' : review.content}
        </p>
        {review.visitDate && (
          <p style={{color: '#9ca3af', fontSize: '0.8rem'}}>
            Visited: {new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}
          </p>
        )}
      </div>
    </Link>
  )
}