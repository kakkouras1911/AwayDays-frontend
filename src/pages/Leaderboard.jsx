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
    { key: 'topRated', label: ' Top Rated' },
    { key: 'largest', label: ' Largest' },
    { key: 'mostLiked', label: ' Most Liked' },
  ]

  const getMedal = (index) => {
    if (index === 0) return { emoji: '🥇', bg: '#fef3c7', color: '#d97706' }
    if (index === 1) return { emoji: '🥈', bg: '#f3f4f6', color: '#6b7280' }
    if (index === 2) return { emoji: '🥉', bg: '#fef3c7', color: '#92400e' }
    return { emoji: null, bg: '#f8f9fa', color: '#9ca3af' }
  }

  const RankRow = ({ item, index, rightContent, to }) => {
    const medal = getMedal(index)
    return (
      <Link to={to} style={{textDecoration: 'none'}}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '14px',
          border: index < 3 ? '2px solid #fef3c7' : '1px solid #f0f0f0',
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: '16px',
          transition: 'all 0.2s',
          boxShadow: index < 3 ? '0 2px 8px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)'
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = index < 3 ? '0 2px 8px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            backgroundColor: medal.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: medal.color, fontWeight: '800',
            fontSize: medal.emoji ? '1.5rem' : '0.9rem', flexShrink: 0
          }}>
            {medal.emoji || index + 1}
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <h3 style={{fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
              {item.name || item.title}
            </h3>
            <p style={{color: '#6b7280', fontSize: '0.8rem', margin: 0}}>
              {item.city ? `${item.city}, ${item.country}` : item.stadiumName}
            </p>
          </div>
          {rightContent}
        </div>
      </Link>
    )
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
      <div style={{fontSize: '2rem', marginBottom: '12px'}}>🏆</div>
      Loading...
    </div>
  )

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '60px 24px', textAlign: 'center'
      }}>
        <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.02em'}}>
           Leaderboard
        </h1>
        <p style={{color: '#94a3b8', fontSize: '1.1rem', margin: 0}}>
          The best stadiums and reviews on AwayDays
        </p>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 24px'}}>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '32px',
          backgroundColor: 'white', padding: '6px', borderRadius: '14px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
              backgroundColor: activeTab === tab.key ? '#2563eb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem',
              transition: 'all 0.2s',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(37,99,235,0.3)' : 'none'
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top Rated */}
        {activeTab === 'topRated' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {topRated.map((stadium, index) => (
              <RankRow
                key={stadium.id} item={stadium} index={index}
                to={`/stadiums/${stadium.id}`}
                rightContent={
                  <div style={{backgroundColor: '#fef3c7', color: '#d97706', padding: '6px 16px', borderRadius: '999px', fontWeight: '800', fontSize: '0.95rem', whiteSpace: 'nowrap'}}>
                    ⭐ {parseFloat(stadium.averageRating).toFixed(1)}
                  </div>
                }
              />
            ))}
          </div>
        )}

        {/* Largest */}
        {activeTab === 'largest' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {mostCapacity.map((stadium, index) => (
              <RankRow
                key={stadium.id} item={stadium} index={index}
                to={`/stadiums/${stadium.id}`}
                rightContent={
                  <div style={{backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '999px', fontWeight: '800', fontSize: '0.95rem', whiteSpace: 'nowrap'}}>
                    {stadium.capacity.toLocaleString()} 🪑
                  </div>
                }
              />
            ))}
          </div>
        )}

        {/* Most Liked */}
        {activeTab === 'mostLiked' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {mostLiked.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', color: '#6b7280'}}>
                <div style={{fontSize: '2rem', marginBottom: '12px'}}>👍</div>
                No liked reviews yet!
              </div>
            ) : mostLiked.map((review, index) => (
              <RankRow
                key={review.id} item={review} index={index}
                to={`/reviews/${review.id}`}
                rightContent={
                  <div style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 16px', borderRadius: '999px', fontWeight: '800', fontSize: '0.95rem', whiteSpace: 'nowrap'}}>
                    👍 {review.likeCount}
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}