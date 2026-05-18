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
    if (selectedCountry) results = results.filter(s => s.country === selectedCountry)
    if (capacityFilter) {
      results = results.filter(s => {
        if (!s.capacity) return false
        if (capacityFilter === 'small') return s.capacity < 20000
        if (capacityFilter === 'medium') return s.capacity >= 20000 && s.capacity < 60000
        if (capacityFilter === 'large') return s.capacity >= 60000
        return true
      })
    }
    if (ratingFilter === 'rated') results = results.filter(s => s.averageRating)
    results.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'rating') return (parseFloat(b.averageRating) || 0) - (parseFloat(a.averageRating) || 0)
      if (sortBy === 'capacity') return (b.capacity || 0) - (a.capacity || 0)
      return 0
    })
    setCurrentPage(1)
    setFiltered(results)
  }, [searchQuery, selectedCountry, capacityFilter, ratingFilter, sortBy, stadiums])

  const countries = [...new Set(stadiums.map(s => s.country))].sort()
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const hasFilters = searchQuery || selectedCountry || capacityFilter || ratingFilter || sortBy !== 'name'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCountry('')
    setCapacityFilter('')
    setRatingFilter('')
    setSortBy('name')
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #f0f0f0', padding: '32px 24px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1 style={{fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '4px'}}>All Stadiums</h1>
          <p style={{color: '#6b7280', margin: '0 0 24px'}}>{filtered.length.toLocaleString()} stadiums found</p>

          {/* Search */}
          <div style={{position: 'relative', marginBottom: '16px'}}>
            <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem'}}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by stadium name, city, or country..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = 'white' }}
              onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.backgroundColor = '#f8f9fa' }}
            />
          </div>

          {/* Filters */}
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
            {[
              { value: selectedCountry, onChange: setSelectedCountry, options: [['', 'All Countries'], ...countries.map(c => [c, c])] },
              { value: capacityFilter, onChange: setCapacityFilter, options: [['', 'Any Size'], ['small', '< 20K seats'], ['medium', '20K–60K seats'], ['large', '60K+ seats']] },
              { value: ratingFilter, onChange: setRatingFilter, options: [['', 'All Stadiums'], ['rated', 'Reviewed Only']] },
              { value: sortBy, onChange: setSortBy, options: [['name', 'Sort: A–Z'], ['rating', 'Sort: Top Rated'], ['capacity', 'Sort: Largest']] },
            ].map((filter, i) => (
              <select
                key={i}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #f0f0f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {filter.options.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            ))}

            {hasFilters && (
              <button onClick={clearFilters} style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '2px solid #fee2e2',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>🏟️</div>
            Loading stadiums...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>🔍</div>
            No stadiums found. Try adjusting your filters.
          </div>
        ) : (
          <>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {paginated.map(stadium => (
                <Link key={stadium.id} to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{
                      height: '140px',
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.5rem', position: 'relative'
                    }}>
                      🏟️
                      {stadium.capacity && (
                        <div style={{
                          position: 'absolute', bottom: '10px', right: '10px',
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '999px', padding: '3px 10px',
                          color: 'white', fontSize: '0.75rem', fontWeight: '600',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          {stadium.capacity.toLocaleString()} 🪑
                        </div>
                      )}
                    </div>
                    <div style={{padding: '16px'}}>
                      <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px'}}>{stadium.name}</h3>
                      <p style={{color: '#6b7280', fontSize: '0.85rem', margin: '0 0 12px'}}>📍 {stadium.city}, {stadium.country}</p>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        {stadium.averageRating ? (
                          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <span style={{color: '#f59e0b', fontSize: '0.875rem'}}>★</span>
                            <span style={{fontWeight: '700', color: '#1a1a2e', fontSize: '0.875rem'}}>
                              {parseFloat(stadium.averageRating).toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>No reviews yet</span>
                        )}
                        <span style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600'}}>
                          View →
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
                  style={{
                    padding: '10px 24px', borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600', fontSize: '0.875rem'
                  }}
                >
                  ← Previous
                </button>
                <span style={{color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0) }}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 24px', borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '600', fontSize: '0.875rem'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}