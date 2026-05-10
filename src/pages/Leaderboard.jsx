import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStadiums, getRecentReviews } from '../services/api'

export default function Leaderboard() {
  const [stadiums, setStadiums] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('topRated')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stadiumsRes, reviewsRes] = await Promise.all([
          getStadiums(),
          getRecentReviews()
        ])
        setStadiums(stadiumsRes.data)
        setRecentReviews(reviewsRes.data)
      } catch (err) {
        console.error('Failed to fetch data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const topRated = [...stadiums]
    .filter(s => s.averageRating)
    .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating))
    .slice(0, 10)

  const mostCapacity = [...stadiums]
    .filter(s => s.capacity)
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 10)

  const mostLiked = [...recentReviews]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 6)

  const tabs = [
    { key: 'topRated', label: '🏆 Top Rated' },
    { key: 'largest', label: '🏟️ Largest' },
    { key: 'mostLiked', label: '👍 Most Liked Reviews' },
  ]

  const getMedalColor = (index) => {
    if (index === 0) return '#f59e0b'
    if (index === 1) return '#9ca3af'
    if (index === 2) return '#b45309'
    return '#6b7280'
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Loading...</div>
  )

  return (
    <div style={{maxWidth: '900px', margin: '0 auto', padding: '32px 16px'}}>

      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '8px'}}>
          🏆 Leaderboard
        </h1>
        <p style={{color: '#6b7280', fontSize: '1.125rem'}}>
          The best stadiums and reviews on AwayDays
        </p>
      </div>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '8px', marginBottom: '32px', backgroundColor: 'white', padding: '6px', borderRadius: '14px', border: '1px solid #e5e7eb'}}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === tab.key ? '#2563eb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Rated */}
      {activeTab === 'topRated' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {topRated.map((stadium, index) => (
            <Link key={stadium.id} to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: index < 3 ? '2px solid #fef3c7' : '1px solid #e5e7eb',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Rank */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: index < 3 ? getMedalColor(index) : '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index < 3 ? 'white' : '#6b7280',
                  fontWeight: '800',
                  fontSize: index < 3 ? '1.25rem' : '0.875rem',
                  flexShrink: 0
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>

                {/* Info */}
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '2px'}}>
                    {stadium.name}
                  </h3>
                  <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
                    {stadium.city}, {stadium.country}
                  </p>
                </div>

                {/* Rating */}
                <div style={{
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}>
                  ⭐ {parseFloat(stadium.averageRating).toFixed(1)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Largest */}
      {activeTab === 'largest' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {mostCapacity.map((stadium, index) => (
            <Link key={stadium.id} to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: index < 3 ? '2px solid #fef3c7' : '1px solid #e5e7eb',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: index < 3 ? getMedalColor(index) : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: index < 3 ? 'white' : '#6b7280',
                  fontWeight: '800', fontSize: index < 3 ? '1.25rem' : '0.875rem', flexShrink: 0
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '2px'}}>{stadium.name}</h3>
                  <p style={{color: '#6b7280', fontSize: '0.875rem'}}>{stadium.city}, {stadium.country}</p>
                </div>
                <div style={{backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '999px', fontWeight: '700', fontSize: '1rem'}}>
                  {stadium.capacity.toLocaleString()} 🪑
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Most Liked Reviews */}
      {activeTab === 'mostLiked' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {mostLiked.length === 0 ? (
            <div style={{textAlign: 'center', padding: '48px', color: '#6b7280'}}>
              No liked reviews yet. Be the first to like a review!
            </div>
          ) : (
            mostLiked.map((review, index) => (
              <Link key={review.id} to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: index < 3 ? '2px solid #fef3c7' : '1px solid #e5e7eb',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: index < 3 ? getMedalColor(index) : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: index < 3 ? 'white' : '#6b7280',
                    fontWeight: '800', fontSize: index < 3 ? '1.25rem' : '0.875rem', flexShrink: 0
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div style={{flex: 1}}>
                    <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '2px'}}>{review.title}</h3>
                    <p style={{color: '#2563eb', fontSize: '0.875rem', fontWeight: '500'}}>{review.stadiumName}</p>
                    <p style={{color: '#6b7280', fontSize: '0.8rem'}}>by {review.username}</p>
                  </div>
                  <div style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 16px', borderRadius: '999px', fontWeight: '700', fontSize: '1rem'}}>
                    👍 {review.likeCount}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}