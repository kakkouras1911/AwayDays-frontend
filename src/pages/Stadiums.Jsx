import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getStadiums } from '../services/api'

export default function Stadiums() {
  const [stadiums, setStadiums] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await getStadiums()
        setStadiums(response.data)
        setFiltered(response.data)
      } catch (err) {
        console.error('Failed to fetch stadiums', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStadiums()
  }, [])

  // Handle URL params from Home page search/country
  useEffect(() => {
    const search = searchParams.get('search')
    const country = searchParams.get('country')
    if (search) setSearchQuery(search)
    if (country) setSelectedCountry(country)
  }, [searchParams])

  // Filter stadiums
  useEffect(() => {
    let results = [...stadiums]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
      )
    }

    if (selectedCountry) {
      results = results.filter(s => s.country === selectedCountry)
    }

    setFiltered(results)
  }, [searchQuery, selectedCountry, stadiums])

  const countries = [...new Set(stadiums.map(s => s.country))].sort()

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 16px'}}>
      
      {/* Header */}
      <div style={{marginBottom: '32px'}}>
        <h1 style={{fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '8px'}}>
          All Stadiums
        </h1>
        <p style={{color: '#6b7280'}}>{filtered.length} stadiums found</p>
      </div>

      {/* Search + Filter */}
      <div style={{display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap'}}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, city, country..."
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            fontSize: '0.95rem',
            outline: 'none',
            backgroundColor: 'white'
          }}
        />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            fontSize: '0.95rem',
            outline: 'none',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer'
          }}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {(searchQuery || selectedCountry) && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedCountry('') }}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>
          Loading stadiums...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>
          No stadiums found matching your search.
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
          {filtered.map(stadium => (
            <Link key={stadium.id} to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
              <div
                style={{
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
                {/* Image */}
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem'
                }}>
                  🏟️
                </div>

                <div style={{padding: '16px'}}>
                  <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
                    {stadium.name}
                  </h3>
                  <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '12px'}}>
                    {stadium.city}, {stadium.country}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <span style={{color: '#f59e0b'}}>⭐</span>
                      <span style={{fontWeight: '600', color: '#111827', fontSize: '0.875rem'}}>
                        {stadium.averageRating ? parseFloat(stadium.averageRating).toFixed(1) : 'No rating'}
                      </span>
                    </div>
                    <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                      {stadium.capacity ? stadium.capacity.toLocaleString() + ' cap.' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}