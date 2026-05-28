import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API_BASE = 'http://localhost:8080/api'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [addedId, setAddedId] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState({})
  const { addToCart, itemCount } = useCart()

  useEffect(() => {
    fetch(`${API_BASE}/shop/products`)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(products.map(p => p.category))]
  const filtered = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory)

  const handleAddToCart = (product) => {
    if (product.sizes && !selectedSizes[product.id]) {
      alert('Please select a size!')
      return
    }
    addToCart({ ...product, selectedSize: selectedSizes[product.id] })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '60px 24px'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <p style={{color: '#60a5fa', fontWeight: '600', fontSize: '0.875rem', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Official Merchandise
            </p>
            <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 8px'}}>
              🛍️ AwayDays Shop
            </h1>
            <p style={{color: '#94a3b8', margin: 0}}>
              Rep your away day passion with official AwayDays merch
            </p>
          </div>
          <Link to="/shop/cart" style={{
            backgroundColor: 'rgba(255,255,255,0.1)', color: 'white',
            padding: '12px 24px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            🛒 Cart ({itemCount})
          </Link>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 24px'}}>

        {/* Category filters */}
        <div style={{display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap'}}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
              padding: '8px 20px', borderRadius: '999px',
              border: selectedCategory === cat ? 'none' : '1px solid #e5e7eb',
              backgroundColor: selectedCategory === cat ? '#2563eb' : 'white',
              color: selectedCategory === cat ? 'white' : '#374151',
              fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>🛍️</div>
            Loading products...
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px'}}>
            {filtered.map(product => (
              <div key={product.id} style={{
                backgroundColor: 'white', borderRadius: '20px',
                border: '1px solid #f0f0f0', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{height: '220px', overflow: 'hidden', position: 'relative'}}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    backgroundColor: '#2563eb', color: 'white',
                    padding: '4px 12px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: '700'
                  }}>
                    {product.category}
                  </div>
                </div>
                <div style={{padding: '20px'}}>
                  <h3 style={{fontSize: '1.05rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px'}}>{product.name}</h3>
                  <p style={{color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 16px'}}>
                    {product.description}
                  </p>
                  {product.sizes && (
                    <div style={{marginBottom: '12px'}}>
                      <p style={{fontSize: '0.8rem', fontWeight: '600', color: '#374151', margin: '0 0 6px'}}>Size:</p>
                      <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                        {product.sizes.split(',').map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSizes({...selectedSizes, [product.id]: size})}
                            style={{
                              padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                              border: selectedSizes[product.id] === size ? '2px solid #2563eb' : '1px solid #e5e7eb',
                              backgroundColor: selectedSizes[product.id] === size ? '#eff6ff' : 'white',
                              color: selectedSizes[product.id] === size ? '#2563eb' : '#374151',
                              fontWeight: '600', fontSize: '0.8rem'
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '1.4rem', fontWeight: '900', color: '#1a1a2e'}}>
                      €{product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        backgroundColor: addedId === product.id ? '#16a34a' : '#2563eb',
                        color: 'white', padding: '10px 20px', borderRadius: '10px',
                        border: 'none', fontWeight: '700', cursor: 'pointer',
                        fontSize: '0.875rem', transition: 'all 0.2s'
                      }}
                    >
                      {addedId === product.id ? '✅ Added!' : '+ Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}