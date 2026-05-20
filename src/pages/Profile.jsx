import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getReviewsByUser, deleteReview, getUserProfile, updateBio, uploadAvatar } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [editingBio, setEditingBio] = useState(false)
  const [bioText, setBioText] = useState('')
  const [savingBio, setSavingBio] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchData = async () => {
      try {
        const [reviewsRes, profileRes] = await Promise.all([
          getReviewsByUser(user.userId),
          getUserProfile(user.userId)
        ])
        setReviews(reviewsRes.data)
        setProfile(profileRes.data)
        setBioText(profileRes.data.bio || '')
      } catch (err) {
        console.error('Failed to fetch data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const handleBioSave = async () => {
    setSavingBio(true)
    try {
      await updateBio(user.userId, bioText)
      setProfile({ ...profile, bio: bioText })
      setEditingBio(false)
    } catch (err) {
      console.error('Failed to update bio', err)
    } finally {
      setSavingBio(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const res = await uploadAvatar(user.userId, file)
      setProfile({ ...profile, avatarUrl: res.data.avatarUrl })
    } catch (err) {
      console.error('Failed to upload avatar', err)
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (!user) return null

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '20px'}}>

            {/* Avatar */}
            <div style={{position: 'relative', flexShrink: 0}}>
              {profile?.avatarUrl ? (
                <img
                  src={`http://localhost:8080${profile.avatarUrl}`}
                  alt="Avatar"
                  style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)'
                  }}
                />
              ) : (
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.75rem', fontWeight: '900',
                  border: '3px solid rgba(255,255,255,0.2)'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Upload button */}
              <label style={{
                position: 'absolute', bottom: '0', right: '0',
                backgroundColor: '#2563eb', color: 'white',
                width: '24px', height: '24px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.7rem',
                border: '2px solid white'
              }}>
                {uploadingAvatar ? '...' : '📷'}
                <input
                  type="file" accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{display: 'none'}}
                />
              </label>
            </div>

            {/* Info */}
            <div>
              <h1 style={{color: 'white', fontSize: '1.75rem', fontWeight: '900', margin: '0 0 4px'}}>
                {user.username}
              </h1>
              <p style={{color: '#94a3b8', margin: '0 0 8px', fontSize: '0.875rem'}}>{user.email}</p>

              {/* Bio */}
              {editingBio ? (
                <div style={{display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '8px'}}>
                  <textarea
                    value={bioText}
                    onChange={e => setBioText(e.target.value)}
                    rows={2}
                    placeholder="Tell us about yourself..."
                    style={{
                      padding: '8px 12px', borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white', fontSize: '0.875rem',
                      outline: 'none', resize: 'none', width: '280px',
                      fontFamily: 'inherit'
                    }}
                  />
                  <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <button onClick={handleBioSave} disabled={savingBio} style={{
                      padding: '6px 12px', borderRadius: '6px',
                      backgroundColor: '#2563eb', color: 'white',
                      border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600'
                    }}>
                      {savingBio ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingBio(false)} style={{
                      padding: '6px 12px', borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.1)', color: 'white',
                      border: 'none', cursor: 'pointer', fontSize: '0.75rem'
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px'}}>
                  <p style={{color: '#94a3b8', margin: 0, fontSize: '0.875rem', fontStyle: profile?.bio ? 'normal' : 'italic'}}>
                    {profile?.bio || 'No bio yet'}
                  </p>
                  <button onClick={() => setEditingBio(true)} style={{
                    backgroundColor: 'rgba(255,255,255,0.1)', color: '#94a3b8',
                    border: 'none', borderRadius: '6px', padding: '2px 8px',
                    cursor: 'pointer', fontSize: '0.75rem'
                  }}>
                    ✏️ Edit
                  </button>
                </div>
              )}

              <p style={{color: '#60a5fa', margin: '8px 0 0', fontSize: '0.875rem', fontWeight: '600'}}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written
              </p>
            </div>
          </div>

          <button onClick={handleLogout} style={{
            padding: '10px 20px', borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: 'white', cursor: 'pointer',
            fontWeight: '600', fontSize: '0.875rem',
            backdropFilter: 'blur(10px)', flexShrink: 0
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
        <h2 style={{fontSize: '1.25rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '20px'}}>
          My Reviews
        </h2>

        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: '#6b7280'}}>Loading...</div>
        ) : reviews.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px',
            backgroundColor: 'white', borderRadius: '20px',
            border: '1px solid #f0f0f0', color: '#6b7280'
          }}>
            <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>📝</div>
            <p style={{fontWeight: '600', marginBottom: '8px', color: '#374151'}}>No reviews yet</p>
            <p style={{fontSize: '0.875rem', marginBottom: '20px'}}>Start sharing your stadium experiences!</p>
            <Link to="/stadiums" style={{
              backgroundColor: '#2563eb', color: 'white',
              padding: '10px 24px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: '700', fontSize: '0.875rem'
            }}>
              Browse Stadiums
            </Link>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {reviews.map(review => (
              <div key={review.id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                border: '1px solid #f0f0f0', padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <Link to={`/reviews/${review.id}`} style={{textDecoration: 'none'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <div>
                      <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px'}}>{review.title}</h3>
                      <p style={{color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', margin: 0}}>{review.stadiumName}</p>
                    </div>
                    <div style={{
                      backgroundColor: '#fef3c7', color: '#d97706',
                      padding: '4px 14px', borderRadius: '999px',
                      fontWeight: '800', fontSize: '0.875rem', whiteSpace: 'nowrap'
                    }}>
                      ⭐ {parseFloat(review.overallRating).toFixed(1)}
                    </div>
                  </div>
                  <p style={{color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6', margin: '0 0 10px'}}>
                    {review.content.length > 120 ? review.content.substring(0, 120) + '...' : review.content}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af'}}>
                    {review.visitDate && (
                      <span>📅 {new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}</span>
                    )}
                    <span>👍 {review.likeCount} likes</span>
                  </div>
                </Link>
                <div style={{display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6'}}>
                  <Link to={`/reviews/${review.id}/edit`} style={{
                    padding: '6px 16px', borderRadius: '8px',
                    border: '1px solid #e5e7eb', backgroundColor: 'white',
                    color: '#374151', textDecoration: 'none',
                    fontSize: '0.8rem', fontWeight: '600'
                  }}>
                    ✏️ Edit
                  </Link>
                  <button onClick={async () => {
                    if (window.confirm('Delete this review?')) {
                      try {
                        await deleteReview(review.id)
                        setReviews(reviews.filter(r => r.id !== review.id))
                      } catch (err) {
                        console.error('Failed to delete', err)
                      }
                    }
                  }} style={{
                    padding: '6px 16px', borderRadius: '8px',
                    border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                    color: '#dc2626', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                  }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}