import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStadiums, getRecentReviews } from '../services/api'

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

  const countries = [...new Set(stadiums.map(s => s.country))].slice(0, 8)

  return (
    <div>
      {/* Hero Section */}
      <div style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '80px 16px'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <h1 style={{color: 'white', fontSize: '3rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2'}}>
            Discover Football Stadiums
          </h1>
          <p style={{color: '#bfdbfe', fontSize: '1.25rem', marginBottom: '40px'}}>
            Read and write reviews for stadiums across the world
          </p>
          <Link
            to="/stadiums"
            style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '16px 48px',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.2s'
            }}
          >
            Browse Stadiums →
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px 16px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '64px'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '800', color: '#2563eb'}}>{stadiums.length.toLocaleString()}</div>
            <div style={{color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Stadiums</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '800', color: '#2563eb'}}>110+</div>
            <div style={{color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Countries</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '800', color: '#2563eb'}}>⭐</div>
            <div style={{color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Reviews</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 16px'}}>

        {/* Top Rated Stadiums */}
        <section style={{marginBottom: '64px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827'}}>🏆 Top Rated Stadiums</h2>
            <Link to="/stadiums" style={{color: '#2563eb', fontWeight: '500', textDecoration: 'none'}}>View all →</Link>
          </div>
          {loading ? (
            <div style={{textAlign: 'center', padding: '48px', color: '#6b7280'}}>Loading stadiums...</div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px'}}>
              {topRated.map(stadium => (
                <StadiumCard key={stadium.id} stadium={stadium} />
              ))}
            </div>
          )}
        </section>

        {/* Latest Reviews */}
        <section style={{marginBottom: '64px'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '24px'}}>
            📝 Latest Reviews
          </h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {recentReviews.map(review => (
              <Link key={review.id} to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                <div
                  style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', cursor: 'pointer', transition: 'all 0.2s'}}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                    <h3 style={{fontSize: '0.95rem', fontWeight: '700', color: '#111827'}}>{review.title}</h3>
                    <span style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700'}}>
                      ⭐ {parseFloat(review.overallRating).toFixed(1)}
                    </span>
                  </div>
                  <p style={{color: '#2563eb', fontSize: '0.8rem', fontWeight: '500', marginBottom: '8px'}}>{review.stadiumName}</p>
                  <p style={{color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.6'}}>
                    {review.content.length > 100 ? review.content.substring(0, 100) + '...' : review.content}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.8rem', color: '#9ca3af'}}>
                    <span>by {review.username}</span>
                    <span>👍 {review.likeCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Explore by Country */}
        <section>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '24px'}}>🌍 Explore by Country</h2>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
            {countries.map(country => (
              <Link
                key={country}
                to={`/stadiums?country=${country}`}
                style={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '999px', padding: '8px 20px', color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem'}}
              >
                {country}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function StadiumCard({ stadium }) {
  return (
    <Link to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
      <div
        style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'}}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{height: '180px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>
          🏟️
        </div>
        <div style={{padding: '20px'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>{stadium.name}</h3>
          <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '12px'}}>{stadium.city}, {stadium.country}</p>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              <span style={{color: '#f59e0b'}}>⭐</span>
              <span style={{fontWeight: '600', color: '#111827'}}>
                {stadium.averageRating ? parseFloat(stadium.averageRating).toFixed(1) : 'No rating'}
              </span>
            </div>
            <span style={{color: '#6b7280', fontSize: '0.875rem'}}>
              {stadium.capacity ? stadium.capacity.toLocaleString() + ' capacity' : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}