import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStadiums, getReviewsByStadium } from '../services/api'

export default function Home() {
  const [stadiums, setStadiums] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await getStadiums()
        setStadiums(response.data)
      } catch (err) {
        console.error('Failed to fetch stadiums', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStadiums()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/stadiums?search=${searchQuery}`)
    }
  }

  // Top rated stadiums (sort by rating, take top 6)
  const topRated = [...stadiums]
  .filter(s => s.averageRating !== null && s.averageRating !== undefined)
  .sort((a, b) => b.averageRating - a.averageRating)
  .slice(0, 6)

  // Get unique countries
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto'}}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stadiums, cities, countries..."
              style={{
                flex: 1,
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>
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
            <div style={{fontSize: '2rem', fontWeight: '800', color: '#2563eb'}}>{countries.length}+</div>
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

        {/* Explore by Country */}
        <section>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '24px'}}>🌍 Explore by Country</h2>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
            {countries.map(country => (
              <Link
                key={country}
                to={`/stadiums?country=${country}`}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '999px',
                  padding: '8px 20px',
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {/* Stadium Image Placeholder */}
        <div style={{
          height: '180px',
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem'
        }}>
          🏟️
        </div>

        <div style={{padding: '20px'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
            {stadium.name}
          </h3>
          <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '12px'}}>
            {stadium.city}, {stadium.country}
          </p>

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