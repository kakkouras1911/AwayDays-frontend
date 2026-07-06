import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllApplications, approveApplication, rejectApplication, getAllProducts, createProduct, updateProduct, deleteProduct, toggleProduct, createStadium } from '../services/api'

export default function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [rejectNote, setRejectNote] = useState({})
  const [products, setProducts] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', sizes: '', imageUrl: '', stock: 100
  })
  const [showStadiumForm, setShowStadiumForm] = useState(false)
  const [stadiumForm, setStadiumForm] = useState({
    name: '', city: '', country: '', capacity: '', homeTeam: '', coverImageUrl: ''
  })
  const [stadiumPhoto, setStadiumPhoto] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return }
    fetchApplications()
    fetchProducts()
  }, [user])

  const fetchApplications = async () => {
    try {
      const res = await getAllApplications()
      setApplications(res.data)
    } catch (err) {
      console.error('Failed to fetch applications', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts()
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveApplication(id)
      setApplications(applications.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
    } catch (err) {
      console.error('Failed to approve', err)
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectApplication(id, rejectNote[id] || '')
      setApplications(applications.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a))
    } catch (err) {
      console.error('Failed to reject', err)
    }
  }

  const filtered = applications.filter(a => {
    if (activeTab === 'pending') return a.status === 'PENDING'
    if (activeTab === 'approved') return a.status === 'APPROVED'
    if (activeTab === 'rejected') return a.status === 'REJECTED'
    return true
  })

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      }
      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
      } else {
        await createProduct(data)
      }
      fetchProducts()
      setShowProductForm(false)
      setEditingProduct(null)
      setProductForm({ name: '', description: '', price: '', category: '', sizes: '', imageUrl: '', stock: 100 })
    } catch (err) {
      console.error('Failed to save product', err)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes || '',
      imageUrl: product.imageUrl,
      stock: product.stock
    })
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product', err)
    }
  }

  const handleToggleProduct = async (id) => {
    try {
      const res = await toggleProduct(id)
      setProducts(products.map(p => p.id === id ? res.data : p))
    } catch (err) {
      console.error('Failed to toggle product', err)
    }
  }

  const handleCreateStadium = async (e) => {
  e.preventDefault()

  try {
    const payload = {
      name: stadiumForm.name.trim(),
      city: stadiumForm.city.trim(),
      country: stadiumForm.country.trim(),
      capacity: stadiumForm.capacity ? Number(stadiumForm.capacity) : null,
      homeTeam: stadiumForm.homeTeam?.trim() || null,
      coverImageUrl: stadiumForm.coverImageUrl?.trim() || null
    }

    await createStadium(payload)

    setShowStadiumForm(false)
    setStadiumForm({
      name: '',
      city: '',
      country: '',
      capacity: '',
      homeTeam: '',
      coverImageUrl: ''
    })
    setStadiumPhoto(null)
    alert('Stadium created successfully!')
  } catch (err) {
    console.error('Failed to create stadium', err)
  }
}

  const tabs = [
    { key: 'pending', label: ' Pending', count: applications.filter(a => a.status === 'PENDING').length },
    { key: 'approved', label: '✅ Approved', count: applications.filter(a => a.status === 'APPROVED').length },
    { key: 'rejected', label: '❌ Rejected', count: applications.filter(a => a.status === 'REJECTED').length },
    { key: 'products', label: ' Products', count: products.length },
    { key: 'stadiums', label: ' Stadiums', count: null },
  ]

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: '0 0 8px'}}>
            ⚙️ Admin Panel
          </h1>
          <p style={{color: '#94a3b8', margin: 0}}>Manage author applications</p>
        </div>
      </div>

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '24px',
          backgroundColor: 'white', padding: '6px', borderRadius: '14px',
          border: '1px solid #f0f0f0'
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
              backgroundColor: activeTab === tab.key ? '#2563eb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>

        {activeTab !== 'products' && activeTab !== 'stadiums' && (loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: '#6b7280'}}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', color: '#6b7280'}}>
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>📭</div>
            No {activeTab} applications
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {filtered.map(app => (
              <div key={app.id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                border: '1px solid #f0f0f0', padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                  <div>
                    <p style={{color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 4px'}}>
                      
                    </p>
                    <p style={{color: '#6b7280', fontSize: '0.875rem', margin: '0 0 8px'}}>
                      Applied: {new Date(app.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
                    </p>
                    {app.message && (
                      <p style={{color: '#374151', fontSize: '0.9rem', margin: '0 0 12px', lineHeight: '1.6'}}>
                        "{app.message}"
                      </p>
                    )}
                    {app.pdfUrl && (
                      <a
                        href={`http://localhost:8080${app.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          color: '#2563eb', fontSize: '0.875rem', fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        📄 View PDF Application
                      </a>
                    )}
                  </div>
                  <span style={{
                    padding: '4px 14px', borderRadius: '999px', fontWeight: '700', fontSize: '0.8rem',
                    backgroundColor: app.status === 'PENDING' ? '#fef3c7' : app.status === 'APPROVED' ? '#f0fdf4' : '#fef2f2',
                    color: app.status === 'PENDING' ? '#d97706' : app.status === 'APPROVED' ? '#16a34a' : '#dc2626'
                  }}>
                    {app.status}
                  </span>
                </div>

                {app.status === 'PENDING' && (
                  <div style={{borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    <button onClick={() => handleApprove(app.id)} style={{
                      backgroundColor: '#16a34a', color: 'white',
                      padding: '8px 20px', borderRadius: '8px', border: 'none',
                      fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
                    }}>
                      ✅ Approve
                    </button>
                    <div style={{display: 'flex', gap: '8px', flex: 1}}>
                      <input
                        type="text"
                        placeholder="Rejection reason (optional)..."
                        value={rejectNote[app.id] || ''}
                        onChange={e => setRejectNote({ ...rejectNote, [app.id]: e.target.value })}
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: '8px',
                          border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none'
                        }}
                      />
                      <button onClick={() => handleReject(app.id)} style={{
                        backgroundColor: '#dc2626', color: 'white',
                        padding: '8px 20px', borderRadius: '8px', border: 'none',
                        fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
                      }}>
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                )}

                {app.adminNote && (
                  <p style={{color: '#6b7280', fontSize: '0.85rem', margin: '12px 0 0', fontStyle: 'italic'}}>
                    Admin note: {app.adminNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}

        {activeTab === 'stadiums' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e', margin: 0}}>Add New Stadium</h2>
              <button onClick={() => setShowStadiumForm(!showStadiumForm)} style={{
                backgroundColor: '#2563eb', color: 'white',
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
              }}>
                {showStadiumForm ? 'Cancel' : '+ Add Stadium'}
              </button>
            </div>

            {showStadiumForm && (
              <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
                <form onSubmit={handleCreateStadium}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                    {[
                      { label: 'Stadium Name ', key: 'name', required: true },
                      { label: 'City ', key: 'city', required: true },
                      { label: 'Country ', key: 'country', required: true },
                      { label: 'Capacity', key: 'capacity', required: false },
                      { label: 'Home Team', key: 'homeTeam', required: false },

                    ].map(field => (
                      <div key={field.key}>
                        <label style={{display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>{field.label}</label>
                        <input
                          type="text" required={field.required}
                          value={stadiumForm[field.key]}
                          onChange={e => setStadiumForm({...stadiumForm, [field.key]: e.target.value})}
                          style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #f0f0f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box'}}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>Stadium Photo (JPG, PNG or WebP — max 5MB each)</label>
                    <input
                      type="file"
                      accept="image/jpeg,.jpg"
                      onChange={(e) => setStadiumPhoto(e.target.files?.[0] || null)}
                      style={{fontSize: '0.875rem', color: '#374151'}}
                    />
                    {stadiumPhoto && (
                      <p style={{margin: '8px 0 0', fontSize: '0.8rem', color: '#6b7280'}}>
                        Selected: {stadiumPhoto.name}
                      </p>
                    )}
                  </div>
                  <button type="submit" style={{
                    backgroundColor: '#2563eb', color: 'white',
                    padding: '10px 24px', borderRadius: '8px', border: 'none',
                    fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
                  }}>
                    ✅ Create Stadium
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e', margin: 0}}>
                All Products ({products.length})
              </h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', category: '', sizes: '', imageUrl: '', stock: 100 }) }} style={{
                backgroundColor: '#2563eb', color: 'white',
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
              }}>
                + Add Product
              </button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
                <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={handleSaveProduct}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                    {[
                      { label: 'Name', key: 'name', type: 'text', required: true },
                      { label: 'Price (€)', key: 'price', type: 'number', required: true },
                      { label: 'Category', key: 'category', type: 'text', required: true },
                      { label: 'Stock', key: 'stock', type: 'number', required: true },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>{field.label}</label>
                        <input
                          type={field.type} required={field.required}
                          value={productForm[field.key]}
                          onChange={e => setProductForm({...productForm, [field.key]: e.target.value})}
                          style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #f0f0f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box'}}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom: '12px'}}>
                    <label style={{display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={e => setProductForm({...productForm, description: e.target.value})}
                      rows={2}
                      style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #f0f0f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit'}}
                    />
                  </div>
                  <div style={{marginBottom: '12px'}}>
                    <label style={{display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>Image URL</label>
                    <input
                      type="text" value={productForm.imageUrl}
                      onChange={e => setProductForm({...productForm, imageUrl: e.target.value})}
                      placeholder="https://..."
                      style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #f0f0f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>Sizes (comma separated, leave empty if not applicable)</label>
                    <input
                      type="text" value={productForm.sizes}
                      onChange={e => setProductForm({...productForm, sizes: e.target.value})}
                      placeholder="S,M,L,XL,XXL"
                      style={{width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #f0f0f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button type="submit" style={{
                      backgroundColor: '#2563eb', color: 'white',
                      padding: '10px 24px', borderRadius: '8px', border: 'none',
                      fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
                    }}>
                      {editingProduct ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null) }} style={{
                      backgroundColor: 'white', color: '#6b7280',
                      padding: '10px 24px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem'
                    }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {products.map(product => (
                <div key={product.id} style={{
                  backgroundColor: 'white', borderRadius: '14px',
                  border: '1px solid #f0f0f0', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  opacity: product.active ? 1 : 0.6
                }}>
                  <img src={product.imageUrl} alt={product.name}
                    style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0}} />
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px'}}>
                      <h3 style={{fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', margin: 0}}>{product.name}</h3>
                      <span style={{
                        padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700',
                        backgroundColor: product.active ? '#f0fdf4' : '#f3f4f6',
                        color: product.active ? '#16a34a' : '#6b7280'
                      }}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p style={{color: '#6b7280', fontSize: '0.8rem', margin: '0 0 2px'}}>{product.category} · Stock: {product.stock}</p>
                    {product.sizes && <p style={{color: '#9ca3af', fontSize: '0.75rem', margin: 0}}>Sizes: {product.sizes}</p>}
                  </div>
                  <div style={{fontWeight: '800', fontSize: '1rem', color: '#1a1a2e', flexShrink: 0}}>
                    €{product.price.toFixed(2)}
                  </div>
                  <div style={{display: 'flex', gap: '6px', flexShrink: 0}}>
                    <button onClick={() => handleEditProduct(product)} style={{
                      padding: '6px 14px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', backgroundColor: 'white',
                      color: '#374151', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                    }}>✏️ Edit</button>
                    <button onClick={() => handleToggleProduct(product.id)} style={{
                      padding: '6px 14px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', backgroundColor: product.active ? '#fef3c7' : '#f0fdf4',
                      color: product.active ? '#d97706' : '#16a34a', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                    }}>
                      {product.active ? '⏸ Disable' : '▶ Enable'}
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} style={{
                      padding: '6px 14px', borderRadius: '8px',
                      border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                      color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                    }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}