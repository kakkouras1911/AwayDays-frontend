import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStadiums, getRecentReviews } from '../services/api'
import StadiumImage from '../components/StadiumImages'

export default function Home() {
  const [stadiums, setStadiums] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentReviews, setRecentReviews] = useState([])

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
    .filter(s => s.averageRating !== null && s.averageRating !== undefined)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 6)

  const countries = [...new Set(stadiums.map(s => s.country))].slice(0, 10)

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '100px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative'}}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#93c5fd',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            🏟️ {stadiums.length.toLocaleString()} Stadiums Worldwide
          </div>
          
          <h1 style={{
            color: 'white',
            fontSize: '3.5rem',
            fontWeight: '900',
            marginBottom: '20px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            Discover Football<br />
            <span style={{color: '#60a5fa'}}>Stadiums</span> Worldwide
          </h1>
          
          <p style={{
            color: '#94a3b8',
            fontSize: '1.2rem',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Read authentic reviews from away fans. Share your matchday experience.
          </p>

          <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link to="/stadiums" style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
              transition: 'all 0.2s'
            }}>
              Browse Stadiums →
            </Link>
            <Link to="/leaderboard" style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}>
              🏆 Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #f0f0f0', padding: '0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)'}}>
          {[
            { value: stadiums.length.toLocaleString(), label: 'Stadiums', icon: '🏟️' },
            { value: '110+', label: 'Countries', icon: '🌍' },
            { value: recentReviews.length + '+', label: 'Recent Reviews', icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '28px 24px',
              textAlign: 'center',
              borderRight: i < 2 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{fontSize: '1.5rem', marginBottom: '4px'}}>{stat.icon}</div>
              <div style={{fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', lineHeight: '1'}}>{stat.value}</div>
              <div style={{color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '60px 24px'}}>

        {/* Top Rated */}
        <section style={{marginBottom: '72px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px'}}>
            <div>
              <p style={{color: '#2563eb', fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                Community Picks
              </p>
              <h2 style={{fontSize: '1.75rem', fontWeight: '800', color: '#1a1a2e', margin: 0}}>
                Top Rated Stadiums
              </h2>
            </div>
            <Link to="/stadiums?sort=rating" style={{color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.875rem'}}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '48px', color: '#6b7280'}}>Loading...</div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px'}}>
              {topRated.map(stadium => (
                <StadiumCard key={stadium.id} stadium={stadium} />
              ))}
            </div>
          )}
        </section>

        {/* Latest Reviews */}
        <section style={{marginBottom: '72px'}}>
          <div style={{marginBottom: '28px'}}>
            <p style={{color: '#2563eb', fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Fresh from the Terraces
            </p>
            <h2 style={{fontSize: '1.75rem', fontWeight: '800', color: '#1a1a2e', margin: 0}}>
              Latest Reviews
            </h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px'}}>
            {recentReviews.map(review => (
              <Link key={review.id} to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: '1px solid #f0f0f0',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <h3 style={{fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', margin: 0, flex: 1, paddingRight: '8px'}}>{review.title}</h3>
                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      whiteSpace: 'nowrap'
                    }}>
                      ⭐ {parseFloat(review.overallRating).toFixed(1)}
                    </span>
                  </div>
                  <p style={{color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px'}}>{review.stadiumName}</p>
                  <p style={{color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 12px'}}>
                    {review.content.length > 100 ? review.content.substring(0, 100) + '...' : review.content}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid #f9fafb', paddingTop: '10px'}}>
                    <span style={{fontWeight: '500'}}>by {review.username}</span>
                    <span>👍 {review.likeCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Explore by Country */}
        <section>
          <div style={{marginBottom: '28px'}}>
            <p style={{color: '#2563eb', fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Explore
            </p>
            <h2 style={{fontSize: '1.75rem', fontWeight: '800', color: '#1a1a2e', margin: 0}}>
              Browse by Country
            </h2>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {countries.map(country => (
              <Link key={country} to={`/stadiums?country=${country}`} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                padding: '10px 20px',
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#2563eb' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#e5e7eb' }}
              >
                {country}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div style={{backgroundColor: '#1a1a2e', color: '#94a3b8', textAlign: 'center', padding: '32px 24px', marginTop: '48px'}}>
        <p style={{margin: 0, fontSize: '0.875rem'}}>© 2026 AwayDays — The Away Fan's Stadium Guide</p>
      </div>
    </div>
  )
}

function StadiumCard({ stadium }) {
  return (
    <Link to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{position: 'relative'}}>
<StadiumImage 
  stadiumId={stadium.id}
  stadiumName={stadium.name} 
  coverImageUrl={stadium.coverImageUrl}
  height="180px" 
/>  <div style={{
    position: 'absolute', bottom: '12px', right: '12px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '999px',
    padding: '4px 12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '700',
    border: '1px solid rgba(255,255,255,0.2)'
  }}>
    {stadium.capacity ? stadium.capacity.toLocaleString() + ' 🪑' : 'N/A'}
  </div>
</div>

        <div style={{padding: '16px 20px 20px'}}>
          <h3 style={{fontSize: '1.05rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px', margin: '0 0 4px'}}>
            {stadium.name}
          </h3>
          <p style={{color: '#6b7280', fontSize: '0.85rem', marginBottom: '14px', margin: '0 0 14px'}}>
            📍 {stadium.city}, {stadium.country}
          </p>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {stadium.averageRating ? (
              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                <div style={{display: 'flex', gap: '2px'}}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{color: parseFloat(stadium.averageRating) >= star ? '#f59e0b' : '#e5e7eb', fontSize: '0.875rem'}}>★</span>
                  ))}
                </div>
                <span style={{fontWeight: '700', color: '#1a1a2e', fontSize: '0.875rem'}}>
                  {parseFloat(stadium.averageRating).toFixed(1)}
                </span>
              </div>
            ) : (
              <span style={{color: '#9ca3af', fontSize: '0.85rem'}}>No reviews yet</span>
            )}
            <span style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}