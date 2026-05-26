import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStadiums } from '../services/api'

const StadiumPicker = ({ label, search, setSearch, selected, setSelected, filtered, color }) => (
  <div style={{flex: 1}}>
    <h2 style={{
      textAlign: 'center', fontSize: '1rem', fontWeight: '800',
      color: 'white', marginBottom: '16px',
      backgroundColor: color, padding: '8px 16px', borderRadius: '10px'
    }}>
      {label}
    </h2>
    {!selected ? (
      <div>
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a stadium..."
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '10px',
            border: '2px solid #f0f0f0', fontSize: '0.9rem', outline: 'none',
            boxSizing: 'border-box', marginBottom: '8px'
          }}
        />
        {search && (
          <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
            {filtered.length === 0 ? (
              <p style={{padding: '16px', color: '#6b7280', textAlign: 'center', margin: 0}}>No stadiums found</p>
            ) : filtered.map(s => (
              <div
                key={s.id}
                onClick={() => { setSelected(s); setSearch('') }}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: '1px solid #f9fafb',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{fontWeight: '700', color: '#1a1a2e', fontSize: '0.9rem'}}>{s.name}</div>
                <div style={{color: '#6b7280', fontSize: '0.8rem'}}>📍 {s.city}, {s.country}</div>
              </div>
            ))}
          </div>
        )}
        {!search && (
          <div style={{textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', color: '#9ca3af'}}>
            <div style={{fontSize: '2rem', marginBottom: '8px'}}>🏟️</div>
            <p style={{margin: 0, fontSize: '0.875rem'}}>Search for a stadium above</p>
          </div>
        )}
      </div>
    ) : (
      <div style={{backgroundColor: 'white', borderRadius: '16px', border: `2px solid ${color}`, overflow: 'hidden'}}>
        {selected.coverImageUrl ? (
          <img src={selected.coverImageUrl} alt={selected.name} style={{width: '100%', height: '160px', objectFit: 'cover'}} />
        ) : (
          <div style={{height: '160px', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>
            🏟️
          </div>
        )}
        <div style={{padding: '16px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px'}}>{selected.name}</h3>
          <p style={{color: '#6b7280', fontSize: '0.85rem', margin: '0 0 12px'}}>📍 {selected.city}, {selected.country}</p>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px'}}>
            {[
              { label: 'Capacity', value: selected.capacity ? selected.capacity.toLocaleString() : 'N/A' },
              { label: 'Rating', value: selected.averageRating ? parseFloat(selected.averageRating).toFixed(1) + ' ⭐' : 'N/A' },
              { label: 'Home Team', value: selected.homeTeam || 'N/A' },
              { label: 'Country', value: selected.country || 'N/A' },
            ].map((item, i) => (
              <div key={i} style={{backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '8px 12px'}}>
                <div style={{color: '#9ca3af', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase'}}>{item.label}</div>
                <div style={{color: '#1a1a2e', fontWeight: '700', fontSize: '0.875rem'}}>{item.value}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSelected(null)}
            style={{
              width: '100%', padding: '8px', borderRadius: '8px',
              border: '1px solid #e5e7eb', backgroundColor: 'white',
              color: '#6b7280', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
            }}
          >
            Change Stadium
          </button>
        </div>
      </div>
    )}
  </div>
)

export default function Compare() {
  const [stadiums, setStadiums] = useState([])
  const [stadiumA, setStadiumA] = useState(null)
  const [stadiumB, setStadiumB] = useState(null)
  const [searchA, setSearchA] = useState('')
  const [searchB, setSearchB] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStadiums().then(res => {
      setStadiums(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filteredA = stadiums
    .filter(s => s.name.toLowerCase().includes(searchA.toLowerCase()) || s.city.toLowerCase().includes(searchA.toLowerCase()))
    .slice(0, 6)

  const filteredB = stadiums
    .filter(s => s.name.toLowerCase().includes(searchB.toLowerCase()) || s.city.toLowerCase().includes(searchB.toLowerCase()))
    .slice(0, 6)

  const categories = [
    { key: 'atmosphere', label: '🎉 Atmosphere' },
    { key: 'food', label: '🍔 Food & Drinks' },
    { key: 'facilities', label: '🏗️ Facilities' },
    { key: 'hospitality', label: '🤝 Hospitality' },
    { key: 'accessibility', label: '♿ Accessibility' },
  ]

  const getRatingColor = (rating) => {
    if (!rating) return '#e5e7eb'
    if (rating >= 4) return '#16a34a'
    if (rating >= 3) return '#d97706'
    return '#dc2626'
  }

  const RatingBar = ({ valueA, valueB, label }) => {
    const a = parseFloat(valueA) || 0
    const b = parseFloat(valueB) || 0
    const max = 5
    const aWins = a > b
    const bWins = b > a

    return (
      <div style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <span style={{
            fontSize: '1rem', fontWeight: '800',
            color: aWins ? '#2563eb' : '#6b7280'
          }}>
            {a > 0 ? a.toFixed(1) : 'N/A'}
            {aWins && <span style={{marginLeft: '6px', fontSize: '0.75rem'}}>👑</span>}
          </span>
          <span style={{fontSize: '0.85rem', color: '#6b7280', fontWeight: '600'}}>{label}</span>
          <span style={{
            fontSize: '1rem', fontWeight: '800',
            color: bWins ? '#dc2626' : '#6b7280'
          }}>
            {bWins && <span style={{marginRight: '6px', fontSize: '0.75rem'}}>👑</span>}
            {b > 0 ? b.toFixed(1) : 'N/A'}
          </span>
        </div>
        <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
          {/* A bar - grows from right to left */}
          <div style={{flex: 1, height: '10px', backgroundColor: '#f0f0f0', borderRadius: '999px', overflow: 'hidden'}}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${(a / max) * 100}%`,
              backgroundColor: aWins ? '#2563eb' : '#93c5fd',
              marginLeft: 'auto',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e5e7eb', flexShrink: 0}} />
          {/* B bar - grows from left to right */}
          <div style={{flex: 1, height: '10px', backgroundColor: '#f0f0f0', borderRadius: '999px', overflow: 'hidden'}}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${(b / max) * 100}%`,
              backgroundColor: bWins ? '#dc2626' : '#fca5a5',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '60px 24px', textAlign: 'center'
      }}>
        <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 8px'}}>
          ⚖️ Stadium Comparison
        </h1>
        <p style={{color: '#94a3b8', margin: 0, fontSize: '1.1rem'}}>
          Compare two stadiums head to head
        </p>
      </div>

      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '40px 24px'}}>

        {/* Pickers */}
        <div style={{display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'flex-start'}}>
          <StadiumPicker
            label="🔵 Stadium A"
            search={searchA} setSearch={setSearchA}
            selected={stadiumA} setSelected={setStadiumA}
            filtered={filteredA} color="#2563eb"
          />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: '900', color: '#6b7280',
            paddingTop: '48px', flexShrink: 0
          }}>
            VS
          </div>
          <StadiumPicker
            label="🔴 Stadium B"
            search={searchB} setSearch={setSearchB}
            selected={stadiumB} setSelected={setStadiumB}
            filtered={filteredB} color="#dc2626"
          />
        </div>

        {/* Comparison */}
        {stadiumA && stadiumB && (
          <div style={{backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <h2 style={{textAlign: 'center', fontSize: '1.25rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 32px'}}>
              Head to Head
            </h2>

            {/* Overall Rating */}
            <RatingBar
              valueA={stadiumA.averageRating}
              valueB={stadiumB.averageRating}
              label="⭐ Overall Rating"
            />

            {/* Capacity */}
            <div style={{marginBottom: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontSize: '1rem', fontWeight: '800', color: (stadiumA.capacity > stadiumB.capacity) ? '#2563eb' : '#6b7280'}}>
                  {stadiumA.capacity ? stadiumA.capacity.toLocaleString() : 'N/A'}
                  {stadiumA.capacity > stadiumB.capacity && <span style={{marginLeft: '6px', fontSize: '0.75rem'}}>👑</span>}
                </span>
                <span style={{fontSize: '0.85rem', color: '#6b7280', fontWeight: '600'}}>🪑 Capacity</span>
                <span style={{fontSize: '1rem', fontWeight: '800', color: (stadiumB.capacity > stadiumA.capacity) ? '#dc2626' : '#6b7280'}}>
                  {stadiumB.capacity > stadiumA.capacity && <span style={{marginRight: '6px', fontSize: '0.75rem'}}>👑</span>}
                  {stadiumB.capacity ? stadiumB.capacity.toLocaleString() : 'N/A'}
                </span>
              </div>
              <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                <div style={{flex: 1, height: '10px', backgroundColor: '#f0f0f0', borderRadius: '999px', overflow: 'hidden'}}>
                  <div style={{
                    height: '100%', borderRadius: '999px', marginLeft: 'auto',
                    width: `${Math.min(((stadiumA.capacity || 0) / 100000) * 100, 100)}%`,
                    backgroundColor: stadiumA.capacity >= stadiumB.capacity ? '#2563eb' : '#93c5fd'
                  }} />
                </div>
                <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e5e7eb', flexShrink: 0}} />
                <div style={{flex: 1, height: '10px', backgroundColor: '#f0f0f0', borderRadius: '999px', overflow: 'hidden'}}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    width: `${Math.min(((stadiumB.capacity || 0) / 100000) * 100, 100)}%`,
                    backgroundColor: stadiumB.capacity > stadiumA.capacity ? '#dc2626' : '#fca5a5'
                  }} />
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', marginBottom: '24px'}}>
              {[
                { labelA: stadiumA.country, label: '🌍 Country', labelB: stadiumB.country },
                { labelA: stadiumA.homeTeam || 'N/A', label: '⚽ Home Team', labelB: stadiumB.homeTeam || 'N/A' },
                { labelA: stadiumA.city, label: '📍 City', labelB: stadiumB.city },
              ].map((row, i) => (
                <div key={i} style={{display: 'contents'}}>
                  <div style={{textAlign: 'right', padding: '10px 16px', backgroundColor: '#eff6ff', borderRadius: '10px', fontWeight: '600', color: '#2563eb', fontSize: '0.875rem'}}>
                    {row.labelA}
                  </div>
                  <div style={{textAlign: 'center', padding: '10px 8px', color: '#6b7280', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
                    {row.label}
                  </div>
                  <div style={{textAlign: 'left', padding: '10px 16px', backgroundColor: '#fef2f2', borderRadius: '10px', fontWeight: '600', color: '#dc2626', fontSize: '0.875rem'}}>
                    {row.labelB}
                  </div>
                </div>
              ))}
            </div>

            {/* View buttons */}
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
              <Link to={`/stadiums/${stadiumA.id}`} style={{
                backgroundColor: '#2563eb', color: 'white',
                padding: '10px 24px', borderRadius: '10px',
                textDecoration: 'none', fontWeight: '700', fontSize: '0.875rem'
              }}>
                View {stadiumA.name} →
              </Link>
              <Link to={`/stadiums/${stadiumB.id}`} style={{
                backgroundColor: '#dc2626', color: 'white',
                padding: '10px 24px', borderRadius: '10px',
                textDecoration: 'none', fontWeight: '700', fontSize: '0.875rem'
              }}>
                View {stadiumB.name} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
