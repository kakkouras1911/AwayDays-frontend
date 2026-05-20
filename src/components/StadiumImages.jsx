import { useState, useEffect, useRef } from 'react'
import { updateStadiumCoverImage } from '../services/api'

const UNSPLASH_KEY = 'SIwsGqvxkoY8RDnNG8DtSiD_V25HvY1tR2V2FBMqLDQ'
const imageCache = {}

export default function StadiumImage({ stadiumId, stadiumName, coverImageUrl, height = '180px' }) {
  const [imageUrl, setImageUrl] = useState(coverImageUrl || null)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // If we already have a cover image from DB, use it
    if (coverImageUrl) {
      setImageUrl(coverImageUrl)
      return
    }

    if (!isVisible) return
    if (imageCache[stadiumName]) {
      setImageUrl(imageCache[stadiumName])
      return
    }

    const fetchImage = async () => {
      try {
        const query = encodeURIComponent(`${stadiumName} stadium football`)
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
        )
        if (!response.ok) return
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          const url = data.results[0].urls.regular
          imageCache[stadiumName] = url
          setImageUrl(url)

          // Save to DB so we don't fetch again
          if (stadiumId) {
            updateStadiumCoverImage(stadiumId, url).catch(() => {})
          }
        }
      } catch (err) {
        // silently fail
      }
    }

    fetchImage()
  }, [isVisible, stadiumName, coverImageUrl])

  return (
    <div ref={ref}>
      {imageUrl ? (
        <div style={{ height, overflow: 'hidden', position: 'relative' }}>
          <img
            src={imageUrl}
            alt={stadiumName}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)'
          }} />
        </div>
      ) : (
        <div style={{
          height,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem'
        }}>
          🏟️
        </div>
      )}
    </div>
  )
}