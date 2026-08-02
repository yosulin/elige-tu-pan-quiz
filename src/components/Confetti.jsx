import { useEffect, useState } from 'react'

const COLORS = ['#C97C2C', '#55704A', '#9C3B26', '#FFFAF0', '#E0954A']
const PIECE_COUNT = 46

function makePieces() {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.4,
    rotation: Math.round(Math.random() * 360),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6,
    drift: Math.round((Math.random() - 0.5) * 80)
  }))
}

export default function Confetti() {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    // Respetamos prefers-reduced-motion: para quien lo activa, no lanzamos
    // ninguna pieza en vez de intentar una versión "estática" rara.
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    setPieces(makePieces())
    const timer = setTimeout(() => setPieces([]), 3800)
    return () => clearTimeout(timer)
  }, [])

  if (pieces.length === 0) return null

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            '--rot': `${p.rotation}deg`,
            '--drift': `${p.drift}px`
          }}
        />
      ))}
    </div>
  )
}
