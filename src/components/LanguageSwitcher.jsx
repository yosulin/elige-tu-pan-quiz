import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { LANGUAGES, useI18n } from '../i18n'
import { vibrate } from '../utils/feedback'

const PADDING = 4 // debe coincidir con el padding de .lang-switcher en el CSS
const DRAG_THRESHOLD = 6 // px de movimiento antes de considerarlo arrastre y no un tap

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const containerRef = useRef(null)
  const buttonRefs = useRef({})
  const [thumb, setThumb] = useState({ x: 0, width: 0, ready: false })
  const [dragging, setDragging] = useState(false)
  const gestureRef = useRef({ startX: 0, thumbStartX: 0, moved: false, pointerId: null, hoverLang: null })

  function measure() {
    const container = containerRef.current
    const btn = buttonRefs.current[lang]
    if (!container || !btn) return
    const containerBox = container.getBoundingClientRect()
    const btnBox = btn.getBoundingClientRect()
    setThumb({ x: btnBox.left - containerBox.left, width: btnBox.width, ready: true })
  }

  useLayoutEffect(() => {
    if (!dragging) measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  function closestLangForCenterX(centerX) {
    const containerBox = containerRef.current.getBoundingClientRect()
    let closestCode = lang
    let closestDist = Infinity
    for (const { code } of LANGUAGES) {
      const btn = buttonRefs.current[code]
      if (!btn) continue
      const box = btn.getBoundingClientRect()
      const btnCenter = box.left - containerBox.left + box.width / 2
      const dist = Math.abs(btnCenter - centerX)
      if (dist < closestDist) {
        closestDist = dist
        closestCode = code
      }
    }
    return closestCode
  }

  // El gesto empieza en el BOTÓN (que es lo que realmente se toca/pulsa),
  // no en la píldora — la píldora queda siempre tapada por el botón activo.
  function handlePointerDown(e) {
    gestureRef.current = {
      startX: e.clientX,
      thumbStartX: thumb.x,
      moved: false,
      pointerId: e.pointerId,
      hoverLang: lang
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    const g = gestureRef.current
    if (g.pointerId !== e.pointerId) return
    const deltaX = e.clientX - g.startX
    if (!g.moved && Math.abs(deltaX) < DRAG_THRESHOLD) return

    if (!g.moved) {
      g.moved = true
      setDragging(true)
    }

    const containerBox = containerRef.current.getBoundingClientRect()
    const maxX = containerBox.width - thumb.width - PADDING
    const newX = Math.max(PADDING, Math.min(g.thumbStartX + deltaX, maxX))
    setThumb((t) => ({ ...t, x: newX }))

    const overLang = closestLangForCenterX(newX + thumb.width / 2)
    if (overLang !== g.hoverLang) {
      g.hoverLang = overLang
      vibrate(8) // toque ligero, tipo "muesca", al cruzar a otro idioma
    }
  }

  function handlePointerUp(e) {
    const g = gestureRef.current
    if (g.pointerId !== e.pointerId) return
    if (g.moved) {
      setDragging(false)
      const thumbCenter = thumb.x + thumb.width / 2
      const closestCode = closestLangForCenterX(thumbCenter)
      if (closestCode !== lang) setLang(closestCode)
      else measure()
    }
    // si no hubo arrastre, el onClick nativo del botón se encarga del tap
  }

  function handleClick(code) {
    if (gestureRef.current.moved) return // ya resuelto como arrastre en pointerup
    setLang(code)
  }

  return (
    <div className="lang-switcher" ref={containerRef} role="group" aria-label="Idioma / Hizkuntza / Language / Langue">
      <span
        className={`lang-thumb${dragging ? ' is-dragging' : ''}`}
        style={{
          transform: `translateX(${thumb.x}px)`,
          width: `${thumb.width}px`,
          opacity: thumb.ready ? 1 : 0
        }}
        aria-hidden="true"
      />
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          ref={(el) => {
            buttonRefs.current[code] = el
          }}
          type="button"
          aria-pressed={lang === code}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={() => handleClick(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
