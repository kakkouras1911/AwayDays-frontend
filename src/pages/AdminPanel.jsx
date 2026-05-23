import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllApplications, approveApplication, rejectApplication } from '../services/api'

export default function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [rejectNote, setRejectNote] = useState({})

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return }
    fetchApplications()
  }, [user])

  const fetchApplications = async () => {
    try {
      const res = await getAllApplications()
      setApplications(res.data)
    } catch (err) {
      console.error('Failed to fetch applications', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveApplication(id)
      setApplications(applications.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
    } catch (err) {
      console.error('Failed to approve', err)
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectApplication(id, rejectNote[id] || '')
      setApplications(applications.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a))
    } catch (err) {
      console.error('Failed to reject', err)
    }
  }

  const filtered = applications.filter(a => {
    if (activeTab === 'pending') return a.status === 'PENDING'
    if (activeTab === 'approved') return a.status === 'APPROVED'
    if (activeTab === 'rejected') return a.status === 'REJECTED'
    return true
  })

  const tabs = [
    { key: 'pending', label: '⏳ Pending', count: applications.filter(a => a.status === 'PENDING').length },
    { key: 'approved', label: '✅ Approved', count: applications.filter(a => a.status === 'APPROVED').length },
    { key: 'rejected', label: '❌ Rejected', count: applications.filter(a => a.status === 'REJECTED').length },
  ]

  return (
    <div style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{
        background: '#0f3460',
        backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        padding: '48px 24px'
      }}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h1 style={{color: 'white', fontSize: '2rem', fontWeight: '900', margin: '0 0 8px'}}>
            ⚙️ Admin Panel
          </h1>
          <p style={{color: '#94a3b8', margin: 0}}>Manage author applications</p>
        </div>
      </div>

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '24px',
          backgroundColor: 'white', padding: '6px', borderRadius: '14px',
          border: '1px solid #f0f0f0'
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
              backgroundColor: activeTab === tab.key ? '#2563eb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: '#6b7280'}}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', color: '#6b7280'}}>
            <div style={{fontSize: '2rem', marginBottom: '12px'}}>📭</div>
            No {activeTab} applications
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {filtered.map(app => (
              <div key={app.id} style={{
                backgroundColor: 'white', borderRadius: '16px',
                border: '1px solid #f0f0f0', padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                  <div>
                    <p style={{color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 4px'}}>
                      User ID: {app.userId}
                    </p>
                    <p style={{color: '#6b7280', fontSize: '0.875rem', margin: '0 0 8px'}}>
                      Applied: {new Date(app.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
                    </p>
                    {app.message && (
                      <p style={{color: '#374151', fontSize: '0.9rem', margin: '0 0 12px', lineHeight: '1.6'}}>
                        "{app.message}"
                      </p>
                    )}
                    {app.pdfUrl && (
                      <a
                        href={`http://localhost:8080${app.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          color: '#2563eb', fontSize: '0.875rem', fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        📄 View PDF Application
                      </a>
                    )}
                  </div>
                  <span style={{
                    padding: '4px 14px', borderRadius: '999px', fontWeight: '700', fontSize: '0.8rem',
                    backgroundColor: app.status === 'PENDING' ? '#fef3c7' : app.status === 'APPROVED' ? '#f0fdf4' : '#fef2f2',
                    color: app.status === 'PENDING' ? '#d97706' : app.status === 'APPROVED' ? '#16a34a' : '#dc2626'
                  }}>
                    {app.status}
                  </span>
                </div>

                {app.status === 'PENDING' && (
                  <div style={{borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    <button onClick={() => handleApprove(app.id)} style={{
                      backgroundColor: '#16a34a', color: 'white',
                      padding: '8px 20px', borderRadius: '8px', border: 'none',
                      fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
                    }}>
                      ✅ Approve
                    </button>
                    <div style={{display: 'flex', gap: '8px', flex: 1}}>
                      <input
                        type="text"
                        placeholder="Rejection reason (optional)..."
                        value={rejectNote[app.id] || ''}
                        onChange={e => setRejectNote({ ...rejectNote, [app.id]: e.target.value })}
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: '8px',
                          border: '1px solid #e5e7eb', fontSize: '0.875rem', outline: 'none'
                        }}
                      />
                      <button onClick={() => handleReject(app.id)} style={{
                        backgroundColor: '#dc2626', color: 'white',
                        padding: '8px 20px', borderRadius: '8px', border: 'none',
                        fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem'
                      }}>
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                )}

                {app.adminNote && (
                  <p style={{color: '#6b7280', fontSize: '0.85rem', margin: '12px 0 0', fontStyle: 'italic'}}>
                    Admin note: {app.adminNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}