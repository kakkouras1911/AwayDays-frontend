import { useState, useRef, useEffect } from 'react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I\'m the AwayDays AI. Ask me anything about stadiums! 🏟️' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I\'m offline right now.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: '#2563eb', color: 'white',
          border: 'none', cursor: 'pointer', fontSize: '1.5rem',
          boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
          zIndex: 1000, transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px',
          width: '360px', height: '500px',
          backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid #f0f0f0',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem'
            }}>🤖</div>
            <div>
              <div style={{color: 'white', fontWeight: '700', fontSize: '0.95rem'}}>AwayDays AI</div>
              <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>Stadium Assistant</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: msg.sender === 'user' ? '#2563eb' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#374151',
                  fontSize: '0.875rem', lineHeight: '1.5',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: msg.sender === 'ai' ? '1px solid #f0f0f0' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <div style={{
                  padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
                  backgroundColor: 'white', border: '1px solid #f0f0f0',
                  color: '#9ca3af', fontSize: '0.875rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex', gap: '8px',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about stadiums..."
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: '10px', border: '2px solid #f0f0f0',
                fontSize: '0.875rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#f0f0f0'}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px', borderRadius: '10px',
                backgroundColor: loading || !input.trim() ? '#93c5fd' : '#2563eb',
                color: 'white', border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}