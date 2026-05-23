import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getArticleById, publishArticle, deleteArticle } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ArticleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await getArticleById(id)
        setArticle(res.data)
      } catch (err) {
        console.error('Failed to fetch article', err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  const handlePublish = async () => {
    try {
      const res = await publishArticle(id)
      setArticle(res.data)
    } catch (err) {
      console.error('Failed to publish', err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this article?')) return
    try {
      await deleteArticle(id)
      navigate('/articles')
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
      <div style={{fontSize: '2rem', marginBottom: '12px'}}>✍️</div>
      Loading...
    </div>
  )

  if (!article) return (
    <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>Article not found.</div>
  )

  const isOwner = user && user.userId === article.authorId
  const isAdmin = user && user.role === 'ADMIN'

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Cover Image or Header */}
      {article.coverImageUrl ? (
        <div style={{height: '400px', overflow: 'hidden', position: 'relative'}}>
          <img
            src={`http://localhost:8080${article.coverImageUrl}`}
            alt={article.title}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
          }} />
          <div style={{position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', padding: '0 24px', boxSizing: 'border-box'}}>
            <Link to="/articles" style={{color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '12px'}}>
              ← Back to Articles
            </Link>
            <h1 style={{color: 'white', fontSize: '2.25rem', fontWeight: '900', margin: 0, lineHeight: '1.2'}}>
              {article.title}
            </h1>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#0f3460',
          backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          padding: '60px 24px'
        }}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <Link to="/articles" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '16px'}}>
              ← Back to Articles
            </Link>
            <h1 style={{color: 'white', fontSize: '2.25rem', fontWeight: '900', margin: 0, lineHeight: '1.2'}}>
              {article.title}
            </h1>
          </div>
        </div>
      )}

      <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 24px'}}>

        {/* Meta */}
        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          border: '1px solid #f0f0f0', padding: '20px 24px',
          marginBottom: '24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap'}}>
            <span style={{color: '#6b7280', fontSize: '0.875rem'}}>
              📅 {new Date(article.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
            </span>
            <span style={{
              padding: '3px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700',
              backgroundColor: article.status === 'PUBLISHED' ? '#f0fdf4' : '#fef3c7',
              color: article.status === 'PUBLISHED' ? '#16a34a' : '#d97706'
            }}>
              {article.status}
            </span>
            {article.tags && article.tags.split(',').map((tag, i) => (
              <span key={i} style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>
                {tag.trim()}
              </span>
            ))}
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            {(isOwner || isAdmin) && article.status === 'DRAFT' && (
              <button onClick={handlePublish} style={{
                backgroundColor: '#16a34a', color: 'white',
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
              }}>
                🚀 Publish
              </button>
            )}
            {(isOwner || isAdmin) && (
              <button onClick={handleDelete} style={{
                backgroundColor: '#fef2f2', color: '#dc2626',
                padding: '8px 18px', borderRadius: '8px',
                border: '1px solid #fecaca',
                fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
              }}>
                🗑️ Delete
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          border: '1px solid #f0f0f0', padding: '40px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <p style={{color: '#374151', lineHeight: '1.9', fontSize: '1.05rem', margin: 0, whiteSpace: 'pre-wrap'}}>
            {article.content}
          </p>

          {article.stadiumId && (
            <div style={{marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0'}}>
              <Link to={`/stadiums/${article.stadiumId}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#eff6ff', color: '#2563eb',
                padding: '10px 20px', borderRadius: '10px',
                textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem'
              }}>
                🏟️ View Related Stadium →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}