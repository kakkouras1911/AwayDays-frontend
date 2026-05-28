import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: 0}}>🛒 Your Cart</h1>
        </div>
      </div>
      <div style={{maxWidth: '800px', margin: '40px auto', padding: '0 24px', textAlign: 'center'}}>
        <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '60px', border: '1px solid #f0f0f0'}}>
          <div style={{fontSize: '3rem', marginBottom: '16px'}}>🛒</div>
          <h2 style={{color: '#1a1a2e', marginBottom: '8px'}}>Your cart is empty</h2>
          <p style={{color: '#6b7280', marginBottom: '24px'}}>Browse our shop and add some items!</p>
          <Link to="/shop" style={{
            backgroundColor: '#2563eb', color: 'white',
            padding: '12px 28px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '700'
          }}>
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <Link to="/shop" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '16px'}}>
            ← Continue Shopping
          </Link>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: 0}}>
            🛒 Your Cart ({itemCount} items)
          </h1>
        </div>
      </div>

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'flex-start'}}>

          {/* Items */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {cart.map(item => (
              <div key={item.id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                border: '1px solid #f0f0f0', padding: '20px',
                display: 'flex', gap: '16px', alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <img src={item.imageUrl} alt={item.name}
                  style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px'}} />
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px'}}>{item.name}</h3>
                  <p style={{color: '#6b7280', fontSize: '0.85rem', margin: '0 0 12px'}}>
                    {item.category} {item.selectedSize && `· Size: ${item.selectedSize}`}
                  </p>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '4px 8px'}}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: '800', color: '#374151', padding: '0 4px'
                      }}>−</button>
                      <span style={{fontWeight: '700', minWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: '800', color: '#374151', padding: '0 4px'
                      }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#dc2626', fontSize: '0.8rem', fontWeight: '600'
                    }}>Remove</button>
                  </div>
                </div>
                <div style={{fontWeight: '900', fontSize: '1.1rem', color: '#1a1a2e'}}>
                  €{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            border: '1px solid #f0f0f0', padding: '24px',
            position: 'sticky', top: '84px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 20px'}}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem'}}>
                <span style={{color: '#6b7280'}}>{item.name} x{item.quantity}</span>
                <span style={{color: '#374151', fontWeight: '600'}}>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{borderTop: '1px solid #f0f0f0', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <span style={{fontWeight: '800', color: '#1a1a2e', fontSize: '1.1rem'}}>Total</span>
              <span style={{fontWeight: '900', color: '#1a1a2e', fontSize: '1.4rem'}}>€{total.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/shop/checkout')} style={{
              width: '100%', padding: '14px', backgroundColor: '#2563eb',
              color: 'white', border: 'none', borderRadius: '12px',
              fontWeight: '800', cursor: 'pointer', fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}>
              Proceed to Checkout →
            </button>
            <Link to="/shop" style={{
              display: 'block', textAlign: 'center', marginTop: '12px',
              color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none'
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}