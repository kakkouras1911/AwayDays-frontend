import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Hero */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '80px 24px', textAlign: 'center'
      }}>
        <h1 style={{color: 'white', fontSize: '3rem', fontWeight: '900', margin: '0 0 16px'}}>
          About AwayDays
        </h1>
        <p style={{color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7'}}>
          Born from a passion for football and the unmatched experience of following your team away from home.
        </p>
      </div>

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '60px 24px'}}>

        {/* Our Story */}
        <section style={{marginBottom: '64px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center'}}>
            <div>
              <p style={{color: '#2563eb', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px'}}>Our Story</p>
              <h2 style={{fontSize: '2rem', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px', lineHeight: '1.2'}}>
                Every Away Day Tells a Story
              </h2>
              <p style={{color: '#6b7280', lineHeight: '1.8', marginBottom: '16px'}}>
                AwayDays was born from a simple frustration. When planning a trip to watch football at a stadium you have never visited, where do you turn? Generic travel sites tell you about hotels and restaurants. Football forums are full of opinions but short on detail.
              </p>
              <p style={{color: '#6b7280', lineHeight: '1.8', marginBottom: '16px'}}>
                We wanted something built specifically for away fans. A platform where the people who have actually made the journey — bought the ticket, navigated the unfamiliar city, found their seat in the away end — could share their experiences honestly.
              </p>
              <p style={{color: '#6b7280', lineHeight: '1.8'}}>
                That is AwayDays. A community of football travellers helping each other make the most of every away day.
              </p>
            </div>
            <div style={{borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'}}>
              <img
                src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600"
                alt="Football stadium"
                style={{width: '100%', height: '320px', objectFit: 'cover'}}
              />
            </div>
          </div>
        </section>


        {/* Inspiration */}
        <section style={{marginBottom: '64px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center'}}>
            <div style={{borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'}}>
              <img
                src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600"
                alt="Away fans"
                style={{width: '100%', height: '320px', objectFit: 'cover'}}
              />
            </div>
            <div>
              <p style={{color: '#2563eb', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px'}}>Our Inspiration</p>
              <h2 style={{fontSize: '2rem', fontWeight: '900', color: '#1a1a2e', margin: '0 0 20px', lineHeight: '1.2'}}>
                Built by Fans, for Fans
              </h2>
              <p style={{color: '#6b7280', lineHeight: '1.8', marginBottom: '16px'}}>
                We were inspired by platforms like TripAdvisor and Google Maps but felt they never quite captured what makes football travel unique. The away end. The pre-match pub. The unfamiliar city. The shared experience with strangers who support the same club.
              </p>
              <p style={{color: '#6b7280', lineHeight: '1.8'}}>
                AwayDays is our attempt to build the platform we always wished existed. We hope it helps you plan your next away day, discover a new stadium, and connect with the global community of football travellers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          backgroundColor: '#2563eb', borderRadius: '24px',
          padding: '48px', textAlign: 'center'
        }}>
          <h2 style={{color: 'white', fontSize: '1.75rem', fontWeight: '900', margin: '0 0 12px'}}>
            Ready to Plan Your Next Away Day?
          </h2>
          <p style={{color: 'rgba(255,255,255,0.8)', margin: '0 0 28px', fontSize: '1rem'}}>
            Join thousands of away fans sharing their experiences across 1,820 stadiums worldwide.
          </p>
          <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
            <Link to="/stadiums" style={{
              backgroundColor: 'white', color: '#2563eb',
              padding: '12px 28px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: '800', fontSize: '0.95rem'
            }}>
              Browse Stadiums →
            </Link>
            <Link to="/signup" style={{
              backgroundColor: 'rgba(255,255,255,0.15)', color: 'white',
              padding: '12px 28px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              Create Account
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div style={{backgroundColor: '#1a1a2e', color: '#94a3b8', textAlign: 'center', padding: '32px 24px', marginTop: '48px'}}>
        <p style={{margin: 0, fontSize: '0.875rem'}}>© 2026 AwayDays — The Away Fan's Stadium Guide</p>
      </div>
    </div>
  )
}