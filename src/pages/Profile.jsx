import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getReviewsByUser, deleteReview, getUserProfile, updateBio, uploadAvatar } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { getUserApplications, applyForAuthor } from '../services/api'
import { getBucketList } from '../services/api'

export default function Profile() {
  const { user, logoutUser, updateUser } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [editingBio, setEditingBio] = useState(false)
  const [bioText, setBioText] = useState('')
  const [savingBio, setSavingBio] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [bucketList, setBucketList] = useState([])
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchData = async () => {
      try {
        const [reviewsRes, profileRes, bucketRes] = await Promise.all([
          getReviewsByUser(user.userId),
          getUserProfile(user.userId),
          getBucketList(user.userId)
        ])
        setReviews(reviewsRes.data)
        setProfile(profileRes.data)
        setBioText(profileRes.data.bio || '')
        setBucketList(bucketRes.data)
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
      updateUser({ avatarUrl: res.data.avatarUrl })
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
        <ApplyForAuthorSection userId={user.userId} />
        {/* Tabs */}
<div style={{display: 'flex', gap: '6px', marginBottom: '24px', backgroundColor: 'white', padding: '6px', borderRadius: '14px', border: '1px solid #f0f0f0'}}>
  {[
    { key: 'reviews', label: ` My Reviews (${reviews.length})` },
    { key: 'bucket', label: `⭐ Bucket List (${bucketList.length})` },
  ].map(tab => (
    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
      flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
      backgroundColor: activeTab === tab.key ? '#2563eb' : 'transparent',
      color: activeTab === tab.key ? 'white' : '#6b7280',
      fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
    }}>
      {tab.label}
    </button>
  ))}
</div>

{/* Reviews Tab */}
{activeTab === 'reviews' && (
  loading ? (
    <div style={{textAlign: 'center', padding: '60px', color: '#6b7280'}}>Loading...</div>
  ) : reviews.length === 0 ? (
    <div style={{
      textAlign: 'center', padding: '60px',
      backgroundColor: 'white', borderRadius: '20px',
      border: '1px solid #f0f0f0', color: '#6b7280'
    }}>
      <div style={{fontSize: '2.5rem', marginBottom: '12px'}}></div>
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
  )
)}

{/* Bucket List Tab */}
{activeTab === 'bucket' && (
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'}}>
    {bucketList.length === 0 ? (
      <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f0f0f0', color: '#6b7280'}}>
        <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>⭐</div>
        <p style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>No stadiums saved yet</p>
        <p style={{fontSize: '0.875rem', marginBottom: '20px'}}>Browse stadiums and save ones you want to visit!</p>
        <Link to="/stadiums" style={{backgroundColor: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.875rem'}}>
          Browse Stadiums
        </Link>
      </div>
    ) : bucketList.map(stadium => (
      <Link key={stadium.id} to={`/stadiums/${stadium.id}`} style={{textDecoration: 'none'}}>
        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          border: '1px solid #f0f0f0', overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {stadium.coverImageUrl ? (
            <img src={stadium.coverImageUrl} alt={stadium.name} style={{width: '100%', height: '140px', objectFit: 'cover'}} />
          ) : (
            <div style={{height: '140px', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem'}}>🏟️</div>
          )}
          <div style={{padding: '14px'}}>
            <h3 style={{fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px'}}>{stadium.name}</h3>
            <p style={{color: '#6b7280', fontSize: '0.8rem', margin: '0 0 8px'}}>📍 {stadium.city}, {stadium.country}</p>
            {stadium.averageRating && (
              <span style={{backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700'}}>
                ⭐ {parseFloat(stadium.averageRating).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    ))}
  </div>
)}
      </div>
    </div>
  )
}

function ApplyForAuthorSection({ userId }) {
  const [application, setApplication] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [pdf, setPdf] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await getUserApplications(userId)
        if (res.data.length > 0) setApplication(res.data[res.data.length - 1])
      } catch (err) {}
    }
    fetchApplication()
  }, [userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pdf) { setError('Please upload a PDF'); return }
    setSubmitting(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('message', message)
      formData.append('pdf', pdf)
      const res = await applyForAuthor(formData)
      setApplication(res.data)
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (application) {
    return (
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #f0f0f0', padding: '24px',
        marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 12px'}}>
           Author Application
        </h3>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <span style={{
            padding: '6px 16px', borderRadius: '999px', fontWeight: '700', fontSize: '0.875rem',
            backgroundColor: application.status === 'PENDING' ? '#fef3c7' : application.status === 'APPROVED' ? '#f0fdf4' : '#fef2f2',
            color: application.status === 'PENDING' ? '#d97706' : application.status === 'APPROVED' ? '#16a34a' : '#dc2626'
          }}>
            {application.status === 'PENDING' ? '⏳ Pending Review' : application.status === 'APPROVED' ? '✅ Approved!' : '❌ Rejected'}
          </span>
          {application.adminNote && (
            <p style={{color: '#6b7280', fontSize: '0.875rem', margin: 0}}>
              Note: {application.adminNote}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      border: '1px solid #f0f0f0', padding: '24px',
      marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px'}}>
         Become an Author
      </h3>
      <p style={{color: '#6b7280', fontSize: '0.875rem', margin: '0 0 16px'}}>
        Apply to write articles and share your football knowledge with the AwayDays community.
      </p>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={{
          backgroundColor: '#2563eb', color: 'white',
          padding: '10px 24px', borderRadius: '10px', border: 'none',
          fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
        }}>
          Apply Now →
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.875rem'}}>
              {error}
            </div>
          )}
          <div style={{marginBottom: '12px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>
              Why do you want to become an author?
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required rows={3}
              placeholder="Tell us about your football knowledge and writing experience..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '2px solid #f0f0f0', fontSize: '0.875rem', outline: 'none',
                resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit'
              }}
            />
          </div>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px'}}>
              Upload CV / Writing Sample (PDF)
            </label>
            <input
              type="file" accept=".pdf"
              onChange={e => setPdf(e.target.files[0])}
              required
              style={{fontSize: '0.875rem'}}
            />
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button type="submit" disabled={submitting} style={{
              backgroundColor: submitting ? '#93c5fd' : '#2563eb',
              color: 'white', padding: '10px 24px', borderRadius: '10px',
              border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              backgroundColor: 'white', color: '#6b7280',
              padding: '10px 24px', borderRadius: '10px',
              border: '1px solid #e5e7eb', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}