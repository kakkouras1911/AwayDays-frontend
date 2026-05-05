import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getReviewById, getCommentsByReview, addComment, likeReview, unlikeReview, getLikes, deleteComment } from '../services/api'
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
    try {
      await deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment', err)
    }
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Loading...</div>
  )

  if (!review) return (
    <div style={{textAlign: 'center', padding: '64px', color: '#6b7280'}}>Review not found.</div>
  )

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '32px 16px'}}>

      {/* Back */}
      <Link to={`/stadiums/${review.stadiumId}`} style={{color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem'}}>
        ← Back to {review.stadiumName}
      </Link>

      {/* Review Card */}
      <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px', marginTop: '16px', marginBottom: '24px'}}>
        
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '4px'}}>
              {review.title}
            </h1>
            <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
              by <span style={{fontWeight: '600', color: '#2563eb'}}>{review.username}</span>
              {review.visitDate && ` · Visited ${new Date(review.visitDate).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}`}
            </p>
          </div>
          <div style={{
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            padding: '8px 16px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '1.125rem'
          }}>
            ⭐ {parseFloat(review.overallRating).toFixed(1)}
          </div>
        </div>

        {/* Content */}
        <p style={{color: '#374151', lineHeight: '1.8', marginBottom: '24px'}}>
          {review.content}
        </p>

        {/* Category Ratings */}
        {review.categoryRatings && Object.keys(review.categoryRatings).length > 0 && (
          <div style={{marginBottom: '24px'}}>
            <h3 style={{fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Category Ratings
            </h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px'}}>
              {Object.entries(review.categoryRatings).map(([category, rating]) => (
                <div key={category} style={{backgroundColor: '#f9fafb', borderRadius: '10px', padding: '10px 14px'}}>
                  <div style={{color: '#6b7280', fontSize: '0.75rem', textTransform: 'capitalize', marginBottom: '2px'}}>{category}</div>
                  <div style={{color: '#111827', fontWeight: '700'}}>⭐ {parseFloat(rating).toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {review.photoUrls && review.photoUrls.length > 0 && (
          <div style={{marginBottom: '24px'}}>
            <h3 style={{fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Photos
            </h3>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              {review.photoUrls.map((url, index) => (
                <img
                  key={index}
                  src={`http://localhost:8080${url}`}
                  alt={`Review photo ${index + 1}`}
                  style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e5e7eb'}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Like Button */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f3f4f6'}}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              border: `1px solid ${likes.isLiked ? '#2563eb' : '#e5e7eb'}`,
              backgroundColor: likes.isLiked ? '#eff6ff' : 'white',
              color: likes.isLiked ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            👍 {likes.likeCount} {likes.likeCount === 1 ? 'Like' : 'Likes'}
          </button>
          <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>
            {review.createdAt && new Date(review.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div style={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px'}}>
        <h2 style={{fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '20px'}}>
          Comments ({comments.length})
        </h2>

        {/* Add Comment */}
        {user ? (
          <form onSubmit={handleComment} style={{marginBottom: '24px'}}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical',
                marginBottom: '8px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px', textAlign: 'center'}}>
            <Link to="/login" style={{color: '#2563eb', fontWeight: '600'}}>Login</Link>
            <span style={{color: '#6b7280'}}> to leave a comment</span>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p style={{color: '#9ca3af', textAlign: 'center', padding: '24px'}}>No comments yet. Be the first!</p>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {comments.map(comment => (
              <div key={comment.id} style={{padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <span style={{fontWeight: '600', color: '#111827', fontSize: '0.875rem'}}>{comment.username}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>
                      {comment.createdAt && new Date(comment.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </span>
                    {user && user.username === comment.username && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem'}}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p style={{color: '#374151', fontSize: '0.875rem', lineHeight: '1.6'}}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}