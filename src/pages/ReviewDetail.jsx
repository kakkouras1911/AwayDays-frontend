import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
// ΠΡΟΣΟΧΗ: Πρόσθεσα το deleteReview στα imports!
import { getReviewById, getCommentsByReview, addComment, likeReview, unlikeReview, getLikes, deleteComment, deleteReview } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ReviewDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [review, setReview] = useState(null)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState({ likeCount: 0, isLiked: false })
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // ΝΕΟ STATE: Κρατάει το URL της εικόνας που θέλουμε να κάνουμε expand
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewRes, commentsRes] = await Promise.all([
          getReviewById(id),
          getCommentsByReview(id)
        ])
        setReview(reviewRes.data)
        setComments(commentsRes.data)
        if (user) {
          const likesRes = await getLikes(id)
          setLikes(likesRes.data)
        }
      } catch (err) {
        console.error('Failed to fetch review', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    try {
      if (likes.isLiked) {
        const res = await unlikeReview(id)
        setLikes(res.data)
      } else {
        const res = await likeReview(id)
        setLikes(res.data)
      }
    } catch (err) {
      console.error('Failed to like/unlike', err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      const res = await addComment(id, { content: commentText })
      setComments([...comments, res.data])
      setCommentText('')
    } catch (err) {
      console.error('Failed to add comment', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    // Προσθέτουμε ένα confirm για ασφάλεια
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment', err)
    }
  }

  // ΝΕΑ ΛΕΙΤΟΥΡΓΙΑ: Delete Review από Admin
  const handleAdminDeleteReview = async () => {
    if (!window.confirm('ADMIN ACTION: Are you sure you want to completely delete this review?')) return;
    try {
      await deleteReview(id)
      navigate(`/stadiums/${review.stadiumId}`) // Μετά τη διαγραφή, γυρνάμε στη σελίδα του γηπέδου
    } catch (err) {
      console.error('Failed to delete review', err)
      alert('Error deleting review. Check console.');
    }
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
      <div style={{fontSize: '2rem', marginBottom: '12px'}}>📝</div>
      Loading...
    </div>
  )

  if (!review) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>Review not found.</div>
  )

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh', position: 'relative'}}>

      {/* ΝΕΟ: Photo Expand Overlay (Lightbox) */}
      {expandedPhoto && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setExpandedPhoto(null)} // Κλείνει αν πατήσεις οπουδήποτε
        >
          <img 
            src={`http://localhost:8080${expandedPhoto}`} 
            alt="Expanded review" 
            style={{maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'}}
          />
          <div style={{position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '2rem', fontWeight: 'bold'}}>
            &times;
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <Link to={`/stadiums/${review.stadiumId}`} style={{
            color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem',
            display: 'inline-block', marginBottom: '20px'
          }}>
            ← Back to {review.stadiumName}
          </Link>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.02em'}}>
                {review.title}
              </h1>
              <p style={{color: '#94a3b8', margin: 0, fontSize: '0.9rem'}}>
                by <span style={{color: '#60a5fa', fontWeight: '600'}}>{review.username}</span>
                {review.visitDate && ` · Visited ${new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}`}
              </p>
            </div>
            <div style={{
              backgroundColor: '#fef3c7',
              color: '#d97706',
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: '900',
              fontSize: '1.25rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              marginLeft: '16px'
            }}>
              ⭐ {parseFloat(review.overallRating).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto', padding: '32px 24px'}}>

        {/* Review Content */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          border: '1px solid #f0f0f0', padding: '32px',
          marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{color: '#374151', lineHeight: '1.8', fontSize: '1rem', margin: '0 0 28px'}}>
            {review.content}
          </p>

          {/* Category Ratings */}
          {review.categoryRatings && Object.keys(review.categoryRatings).length > 0 && (
            <div style={{marginBottom: '28px'}}>
              <h3 style={{fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em'}}>
                Category Ratings
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px'}}>
                {Object.entries(review.categoryRatings).map(([category, rating]) => (
                  <div key={category} style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    border: '1px solid #f0f0f0'
                  }}>
                    <div style={{color: '#9ca3af', fontSize: '0.75rem', textTransform: 'capitalize', marginBottom: '4px', fontWeight: '500'}}>{category}</div>
                    <div style={{color: '#1a1a2e', fontWeight: '800', fontSize: '1.1rem'}}>
                      <span style={{color: '#f59e0b'}}>★</span> {parseFloat(rating).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos - Τροποποιημένο για Expand! */}
          {review.photoUrls && review.photoUrls.length > 0 && (
            <div style={{marginBottom: '28px'}}>
              <h3 style={{fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em'}}>
                Photos
              </h3>
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                {review.photoUrls.map((url, index) => (
                  <img key={index} src={`http://localhost:8080${url}`}
                    alt={`Review photo ${index + 1}`}
                    onClick={() => setExpandedPhoto(url)} // ΝΕΟ: Ενεργοποιεί το modal
                    style={{
                      width: '160px', height: '160px', objectFit: 'cover', 
                      borderRadius: '12px', border: '1px solid #f0f0f0', 
                      cursor: 'pointer', transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.03)'} // Εφεδάκι hover
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Like + Date + ADMIN DELETE REVIEW BUTTON */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #f3f4f6'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <button onClick={handleLike} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '999px',
                border: `2px solid ${likes.isLiked ? '#2563eb' : '#e5e7eb'}`,
                backgroundColor: likes.isLiked ? '#eff6ff' : 'white',
                color: likes.isLiked ? '#2563eb' : '#6b7280',
                cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}>
                👍 {likes.likeCount} {likes.likeCount === 1 ? 'Like' : 'Likes'}
              </button>
              {review.createdAt && (
                <span style={{color: '#9ca3af', fontSize: '0.85rem'}}>
                  {new Date(review.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
                </span>
              )}
            </div>
            
            {/* Κουμπί Διαγραφής Review αποκλειστικά για ADMIN */}
            {user && user.role === 'ADMIN' && (
              <button onClick={handleAdminDeleteReview} style={{
                backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5',
                padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
              }}>
                🗑️ Delete Review 
              </button>
            )}
          </div>
        </div>

        {/* Comments */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          border: '1px solid #f0f0f0', padding: '32px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 24px'}}>
            Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleComment} style={{marginBottom: '28px'}}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: '12px', border: '2px solid #f0f0f0',
                  fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                  marginBottom: '10px', boxSizing: 'border-box',
                  fontFamily: 'inherit', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
              <button type="submit" disabled={submitting || !commentText.trim()} style={{
                backgroundColor: submitting || !commentText.trim() ? '#93c5fd' : '#2563eb',
                color: 'white', padding: '10px 24px', borderRadius: '10px',
                border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
              }}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div style={{
              marginBottom: '28px', padding: '16px 20px',
              backgroundColor: '#f8f9fa', borderRadius: '12px',
              textAlign: 'center', border: '1px solid #f0f0f0'
            }}>
              <Link to="/login" style={{color: '#2563eb', fontWeight: '700'}}>Login</Link>
              <span style={{color: '#6b7280'}}> to leave a comment</span>
            </div>
          )}

          {comments.length === 0 ? (
            <p style={{color: '#9ca3af', textAlign: 'center', padding: '32px', margin: 0}}>
              No comments yet. Be the first!
            </p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {comments.map(comment => (
                <div key={comment.id} style={{
                  padding: '16px 20px', backgroundColor: '#f8f9fa',
                  borderRadius: '12px', border: '1px solid #f0f0f0'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      {/* Εδώ λέμε στη React: Αν το σχόλιο έχει avatarUrl, δείξ'το! */}
                      {comment.avatarUrl ? (
                        <img
                          src={`http://localhost:8080${comment.avatarUrl}`}
                          alt={comment.username}
                          style={{width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover'}}
                        />
                      ) : (
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          backgroundColor: '#2563eb', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: '700'
                        }}>
                          {comment.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{fontWeight: '700', color: '#1a1a2e', fontSize: '0.875rem'}}>{comment.username}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>
                        {comment.createdAt && new Date(comment.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
                      </span>
                      
                      {/* ΝΕΟ: Το κουμπί Delete εμφανίζεται σε δικά σου σχόλια Ή αν είσαι ADMIN */}
                      {user && (user.username === comment.username || user.role === 'ADMIN') && (
                        <button onClick={() => handleDeleteComment(comment.id)} style={{
                          color: '#ef4444', background: 'none', border: 'none',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                        }}>
                          {user.role === 'ADMIN' && user.username !== comment.username ? 'Delete ' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{color: '#374151', fontSize: '0.9rem', lineHeight: '1.6', margin: 0}}>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}