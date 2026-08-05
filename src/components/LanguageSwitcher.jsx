import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { LANGUAGES, useI18n } from '../i18n'

const PADDING = 4 // debe coincidir con el padding de .lang-switcher en el CSS

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const containerRef = useRef(null)
  const buttonRefs = useRef({})
  const [thumb, setThumb] = useState({ x: 0, width: 0, ready: false })
  const [dragging, setDragging] = useState(false)
  const dragOffsetRef = useRef(0)

  function measure() {
    const container = containerRef.current
    const btn = buttonRefs.current[lang]
    if (!container || !btn) return
    const containerBox = container.getBoundingClientRect()
    const btnBox = btn.getBoundingClientRect()
    setThumb({ x: btnBox.left - containerBox.left, width: btnBox.width, ready: true })
  }

  // Mientras se arrastra, la posición la controla el puntero, no este efecto
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

  function handlePointerDown(e) {
    const container = containerRef.current
    if (!container) return
    const containerBox = container.getBoundingClientRect()
    const pointerX = e.clientX - containerBox.left
    dragOffsetRef.current = pointerX - thumb.x
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!dragging) return
    const container = containerRef.current
    if (!container) return
    const containerBox = container.getBoundingClientRect()
    const pointerX = e.clientX - containerBox.left
    const maxX = containerBox.width - thumb.width - PADDING
    const newX = Math.max(PADDING, Math.min(pointerX - dragOffsetRef.current, maxX))
    setThumb((t) => ({ ...t, x: newX }))
  }

  function handlePointerUp() {
    if (!dragging) return
    setDragging(false)
    const thumbCenter = thumb.x + thumb.width / 2
    const closestCode = closestLangForCenterX(thumbCenter)
    if (closestCode !== lang) setLang(closestCode)
    else measure() // soltó sin cambiar: que vuelva a encajar en su sitio
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
