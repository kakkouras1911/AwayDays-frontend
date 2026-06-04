import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const stripePromise = loadStripe('pk_test_51Tc8LQLU0MxYA5ujyOHRWCISr5PSzCAClAU9y6UenzuCIWFhaTAHEY4PZ5x4lRrx40GHYGYUBEpFVC1cwM4TKyJ900GFoRJyrW')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    try {
      // Create payment intent
      const response = await fetch('http://localhost:8080/api/shop/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          customerEmail: formData.email,
          customerName: formData.name,
          shippingAddress: formData.address,
          userId: user?.userId || null
        })
      })

      const { clientSecret, orderId } = await response.json()

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email
          }
        }
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        // Confirm order in backend
        await fetch('http://localhost:8080/api/shop/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: result.paymentIntent.id })
        })

        clearCart()
        navigate('/shop/success', { state: { orderId } })
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '2px solid #f0f0f0', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit'
  }

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: 0}}>💳 Checkout</h1>
        </div>
      </div>

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'flex-start'}}>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.875rem'}}>
                ⚠️ {error}
              </div>
            )}

            {/* Contact */}
            <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '16px'}}>
              <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>Contact Information</h2>
              <div style={{marginBottom: '12px'}}>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Full Name</label>
                <input type="text" required value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
              </div>
              <div style={{marginBottom: '12px'}}>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Email</label>
                <input type="email" required value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>Shipping Address</label>
                <textarea required value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  rows={3} placeholder="Street, City, Country..."
                  style={{...inputStyle, resize: 'none'}}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
              </div>
            </div>

            {/* Payment */}
            <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '24px', marginBottom: '16px'}}>
              <h2 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>💳 Payment Details</h2>
              <p style={{color: '#6b7280', fontSize: '0.8rem', margin: '0 0 12px'}}>
               
              </p>
              <div style={{
                padding: '14px 16px', borderRadius: '10px',
                border: '2px solid #f0f0f0', backgroundColor: 'white'
              }}>
                <CardElement options={{
                  style: {
                    base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } }
                  }
                }} />
              </div>
            </div>

            <button type="submit" disabled={loading || !stripe} style={{
              width: '100%', padding: '16px', backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', borderRadius: '12px',
              fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem', boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}>
              {loading ? 'Processing...' : `Pay €${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            border: '1px solid #f0f0f0', padding: '24px',
            position: 'sticky', top: '84px'
          }}>
            <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 16px'}}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center'}}>
                <img src={item.imageUrl} alt={item.name} style={{width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px'}} />
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontWeight: '600', fontSize: '0.875rem', color: '#1a1a2e'}}>{item.name}</p>
                  <p style={{margin: 0, color: '#6b7280', fontSize: '0.8rem'}}>x{item.quantity}</p>
                </div>
                <span style={{fontWeight: '700', fontSize: '0.875rem'}}>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{borderTop: '1px solid #f0f0f0', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontWeight: '800', color: '#1a1a2e'}}>Total</span>
              <span style={{fontWeight: '900', color: '#1a1a2e', fontSize: '1.2rem'}}>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}