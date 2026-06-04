import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Articles() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await getArticles()
        setArticles(res.data)
      } catch (err) {
        console.error('Failed to fetch articles', err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>

      {/* Header */}
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '60px 24px'
      }}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <p style={{color: '#60a5fa', fontWeight: '600', fontSize: '0.875rem', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              From Our Authors
            </p>
            <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 8px'}}>
               Articles
            </h1>
            <p style={{color: '#94a3b8', margin: 0}}>
              In-depth football stadium guides and stories
            </p>
          </div>
          {(user?.role === 'AUTHOR' || user?.role === 'ADMIN') && (
            <Link to="/articles/new" style={{
              backgroundColor: '#2563eb', color: 'white',
              padding: '12px 24px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}>
              + Write Article
            </Link>
          )}
        </div>
      </div>

      <div style={{maxWidth: '1000px', margin: '0 auto', padding: '40px 24px'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '80px', color: '#6b7280'}}>
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>✍️</div>
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            backgroundColor: 'white', borderRadius: '20px',
            border: '1px solid #f0f0f0', color: '#6b7280'
          }}>
            <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>📝</div>
            <p style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>No articles yet</p>
            <p style={{fontSize: '0.875rem'}}>Be the first to share your football knowledge!</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {articles.map(article => (
              <Link key={article.id} to={`/articles/${article.id}`} style={{textDecoration: 'none'}}>
                <div style={{
                  backgroundColor: 'white', borderRadius: '20px',
                  border: '1px solid #f0f0f0', overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                  display: 'flex'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {/* Cover Image */}
                  {article.coverImageUrl ? (
                    <img
                      src={`http://localhost:8080${article.coverImageUrl}`}
                      alt={article.title}
                      style={{width: '280px', height: '180px', objectFit: 'cover', flexShrink: 0}}
                    />
                  ) : (
                    <div style={{
                      width: '280px', height: '180px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      ✍️
                    </div>
                  )}

                  {/* Content */}
                  <div style={{padding: '24px', flex: 1}}>
                    <div style={{display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap'}}>
                      {article.tags && article.tags.split(',').map((tag, i) => (
                        <span key={i} style={{
                          backgroundColor: '#eff6ff', color: '#2563eb',
                          padding: '2px 10px', borderRadius: '999px',
                          fontSize: '0.75rem', fontWeight: '600'
                        }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <h2 style={{fontSize: '1.25rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 10px', lineHeight: '1.3'}}>
                      {article.title}
                    </h2>
                    <p style={{color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 16px'}}>
                      {article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content}
                    </p>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid #f0f0f0', paddingTop: '12px'}}>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
                      </span>
                      <span style={{color: '#2563eb', fontWeight: '600'}}>Read more →</span>
                    </div>
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