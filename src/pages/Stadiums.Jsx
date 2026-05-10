import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getStadiums } from '../services/api'

export default function Stadiums() {
  const [stadiums, setStadiums] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [capacityFilter, setCapacityFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams] = useSearchParams()
  const ITEMS_PER_PAGE = 24

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

  useEffect(() => {
    const search = searchParams.get('search')
    const country = searchParams.get('country')
    if (search) setSearchQuery(search)
    if (country) setSelectedCountry(country)
  }, [searchParams])

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

    if (capacityFilter) {
      results = results.filter(s => {
        if (!s.capacity) return false
        if (capacityFilter === 'small') return s.capacity < 20000
        if (capacityFilter === 'medium') return s.capacity >= 20000 && s.capacity < 60000
        if (capacityFilter === 'large') return s.capacity >= 60000
        return true
      })
    }

    if (ratingFilter === 'rated') {
      results = results.filter(s => s.averageRating !== null && s.averageRating !== undefined)
    }

    results.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'rating') {
        const rA = a.averageRating ? parseFloat(a.averageRating) : 0
        const rB = b.averageRating ? parseFloat(b.averageRating) : 0
        return rB - rA
      }
      if (sortBy === 'capacity') return (b.capacity || 0) - (a.capacity || 0)
      return 0
    })

    setCurrentPage(1)
    setFiltered(results)
  }, [searchQuery, selectedCountry, capacityFilter, ratingFilter, sortBy, stadiums])

  const countries = [...new Set(stadiums.map(s => s.country))].sort()

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCountry('')
    setCapacityFilter('')
    setRatingFilter('')
    setSortBy('name')
  }

  const hasFilters = searchQuery || selectedCountry || capacityFilter || ratingFilter || sortBy !== 'name'

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const selectStyle = {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer'
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 16px'}}>

      {/* Header */}
      <div style={{marginBottom: '24px'}}>
        <h1 style={{fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '4px'}}>All Stadiums</h1>
        <p style={{color: '#6b7280'}}>{filtered.length} stadiums found</p>
      </div>

      {/* Search Bar */}
      <div style={{marginBottom: '16px'}}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, city, country..."
          style={{width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box'}}
        />
      </div>

      {/* Filters Row */}
      <div style={{display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center'}}>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={selectStyle}>
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} style={selectStyle}>
          <option value="">Any Capacity</option>
          <option value="small">Small (under 20,000)</option>
          <option value="medium">Medium (20,000–60,000)</option>
          <option value="large">Large (60,000+)</option>
        </select>

        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} style={selectStyle}>
          <option value="">All Stadiums</option>
          <option value="rated">Reviewed Only</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="name">Sort: Name</option>
          <option value="rating">Sort: Highest Rated</option>
          <option value="capacity">Sort: Largest</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters} style={{padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem'}}>
            Clear All
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Loading stadiums...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>
          No stadiums found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
            {paginated.map(stadium => (
              <Link key={stadium.id} to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
                <div
                  style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'}}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{height: '160px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem'}}>
                    🏟️
                  </div>
                  <div style={{padding: '16px'}}>
                    <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>{stadium.name}</h3>
                    <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '12px'}}>{stadium.city}, {stadium.country}</p>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '48px'}}>
              <button
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0) }}
                disabled={currentPage === 1}
                style={{padding: '10px 20px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: currentPage === 1 ? '#f9fafb' : 'white', color: currentPage === 1 ? '#9ca3af' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '500'}}
              >
                ← Previous
              </button>
              <span style={{color: '#6b7280', fontSize: '0.875rem'}}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0) }}
                disabled={currentPage === totalPages}
                style={{padding: '10px 20px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white', color: currentPage === totalPages ? '#9ca3af' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '500'}}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}