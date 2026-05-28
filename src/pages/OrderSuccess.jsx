import { Link, useLocation } from 'react-router-dom'

export default function OrderSuccess() {
  const { state } = useLocation()

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
      <div style={{
        backgroundColor: 'white', borderRadius: '24px',
        border: '1px solid #f0f0f0', padding: '60px 48px',
        textAlign: 'center', maxWidth: '500px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        <div style={{fontSize: '4rem', marginBottom: '16px'}}>🎉</div>
        <h1 style={{fontSize: '1.75rem', fontWeight: '900', color: '#1a1a2e', margin: '0 0 12px'}}>
          Order Confirmed!
        </h1>
        <p style={{color: '#6b7280', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 8px'}}>
          Thank you for your purchase! Your AwayDays merch is on its way.
        </p>
        {state?.orderId && (
          <p style={{color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 32px'}}>
            Order ID: {state.orderId}
          </p>
        )}
        <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/shop" style={{
            backgroundColor: '#2563eb', color: 'white',
            padding: '12px 24px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '700'
          }}>
            Continue Shopping
          </Link>
          <Link to="/" style={{
            backgroundColor: 'white', color: '#374151',
            padding: '12px 24px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '600',
            border: '1px solid #e5e7eb'
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}