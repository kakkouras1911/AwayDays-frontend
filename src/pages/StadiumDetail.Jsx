import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getStadiumById, getReviewsByStadium } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StadiumImage from '../components/StadiumImages'
import { getBucketList, addToBucketList, removeFromBucketList, checkBucketList } from '../services/api'

export default function StadiumDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stadium, setStadium] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [inBucketList, setInBucketList] = useState(false)
  const [bucketLoading, setBucketLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stadiumRes, reviewsRes] = await Promise.all([
          getStadiumById(id),
          getReviewsByStadium(id)
        ])
        setStadium(stadiumRes.data)
        setReviews(reviewsRes.data)
        
        if (user) {
          const bucketRes = await checkBucketList(user.userId, id)
          setInBucketList(bucketRes.data.inBucketList)
        }
      } catch (err) {
        console.error('Failed to fetch stadium', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  if (loading) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
      <div style={{fontSize: '2rem', marginBottom: '12px'}}>🏟️</div>
      Loading...
    </div>
  )

  if (!stadium) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>Stadium not found.</div>
  )

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Hero Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative'}}>
          <Link to="/stadiums" style={{
            color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem',
            display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '24px'
          }}>
            ← Back to Stadiums
          </Link>

          <h1 style={{color: 'white', fontSize: '2.75rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.02em'}}>
            {stadium.name}
          </h1>
          <p style={{color: '#94a3b8', fontSize: '1.1rem', margin: '0 0 32px'}}>
            📍 {stadium.city}, {stadium.country}
          </p>

          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '32px'}}>
            {[
              stadium.capacity && { icon: '🪑', value: stadium.capacity.toLocaleString(), label: 'Capacity' },
              stadium.averageRating && { icon: '⭐', value: parseFloat(stadium.averageRating).toFixed(1), label: 'Avg Rating' },
              { icon: '📝', value: reviews.length, label: 'Reviews' },
              stadium.homeTeam && { icon: '⚽', value: stadium.homeTeam, label: 'Home Team' },
            ].filter(Boolean).map((stat, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px', padding: '16px 24px',
                textAlign: 'center', minWidth: '100px'
              }}>
                <div style={{fontSize: '1.25rem', marginBottom: '6px'}}>{stat.icon}</div>
                <div style={{color: 'white', fontWeight: '800', fontSize: '1.25rem', lineHeight: '1'}}>{stat.value}</div>
                <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '4px'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stadium Image */}
      <StadiumImage
  stadiumId={stadium.id}
  stadiumName={stadium.name}
  coverImageUrl={stadium.coverImageUrl}
  height="350px"
      />

      {/* Content */}
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 24px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px'}}>

          {/* Reviews */}
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e', margin: 0}}>
                Reviews ({reviews.length})
              </h2>
              <button
                onClick={() => user ? navigate(`/stadiums/${id}/review`) : navigate('/login')}
                style={{
                  backgroundColor: '#2563eb', color: 'white',
                  padding: '10px 24px', borderRadius: '10px', border: 'none',
                  fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s'
                }}
              >
                {user ? '✏️ Write a Review' : '🔒 Login to Review'}
              </button>
            </div>
            {user && (
          <button
            onClick={async () => {
              setBucketLoading(true)
              try {
                if (inBucketList) {
                  await removeFromBucketList(user.userId, id)
                  setInBucketList(false)
                } else {
                  await addToBucketList(user.userId, id)
                  setInBucketList(true)
                }
              } catch (err) {
                console.error('Bucket list error', err)
              } finally {
                setBucketLoading(false)
              }
            }}
            style={{
              backgroundColor: inBucketList ? '#fef3c7' : 'white',
              color: inBucketList ? '#d97706' : '#6b7280',
              padding: '10px 20px', borderRadius: '10px',
              border: `1px solid ${inBucketList ? '#fcd34d' : '#e5e7eb'}`,
              fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {bucketLoading ? '...' : inBucketList ? '⭐ Saved' : '☆ Save to Bucket List'}
          </button>
        )}

            {reviews.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px', backgroundColor: 'white',
                borderRadius: '16px', border: '1px solid #f0f0f0', color: '#6b7280'
              }}>
                <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>📝</div>
                <p style={{fontWeight: '600', marginBottom: '4px'}}>No reviews yet</p>
                <p style={{fontSize: '0.875rem'}}>Be the first to review {stadium.name}!</p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {reviews.map(review => (
                  <Link key={review.id} to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                    <div style={{
                      backgroundColor: 'white', borderRadius: '16px',
                      border: '1px solid #f0f0f0', padding: '24px',
                      transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                        <div>
                          <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px'}}>
                            {review.title}
                          </h3>
                          <p style={{color: '#6b7280', fontSize: '0.85rem', margin: 0}}>
                            by <span style={{color: '#2563eb', fontWeight: '600'}}>{review.username}</span>
                            {review.visitDate && ` · ${new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}`}
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: '#fef3c7', color: '#d97706',
                          padding: '6px 14px', borderRadius: '999px',
                          fontWeight: '800', fontSize: '0.9rem', whiteSpace: 'nowrap'
                        }}>
                          ⭐ {parseFloat(review.overallRating).toFixed(1)}
                        </div>
                      </div>
                      <p style={{color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.7', margin: '0 0 12px'}}>
                        {review.content.length > 180 ? review.content.substring(0, 180) + '...' : review.content}
                      </p>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid #f9fafb', paddingTop: '12px'}}>
                        <span>👍 {review.likeCount} likes</span>
                        <span style={{color: '#2563eb', fontWeight: '600'}}>Read more →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f0f0f0', padding: '24px',
              position: 'sticky', top: '84px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 20px'}}>
                Stadium Info
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                {[
                  stadium.capacity && { label: 'Capacity', value: stadium.capacity.toLocaleString() + ' seats' },
                  stadium.builtYear && { label: 'Built', value: stadium.builtYear },
                  stadium.homeTeam && { label: 'Home Team', value: stadium.homeTeam },
                  stadium.address && { label: 'Address', value: stadium.address },
                  stadium.country && { label: 'Country', value: stadium.country },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px'}}>
                    <span style={{color: '#9ca3af', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>{row.label}</span>
                    <span style={{color: '#1a1a2e', fontSize: '0.85rem', fontWeight: '600', textAlign: 'right'}}>{row.value}</span>
                  </div>
                ))}
              </div>
              {stadium.description && (
                <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0'}}>
                  <p style={{color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.6', margin: 0}}>{stadium.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}