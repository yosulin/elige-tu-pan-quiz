import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { LANGUAGES, useI18n } from '../i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const containerRef = useRef(null)
  const buttonRefs = useRef({})
  const [thumb, setThumb] = useState({ x: 0, width: 0, ready: false })

  function measure() {
    const container = containerRef.current
    const btn = buttonRefs.current[lang]
    if (!container || !btn) return
    const containerBox = container.getBoundingClientRect()
    const btnBox = btn.getBoundingClientRect()
    setThumb({ x: btnBox.left - containerBox.left, width: btnBox.width, ready: true })
  }

  // Medimos tras pintar (no antes) para no animar desde 0,0 en el primer render
  useLayoutEffect(measure, [lang])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div className="lang-switcher" ref={containerRef} role="group" aria-label="Idioma / Hizkuntza / Language / Langue">
      <span
        className="lang-thumb"
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
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
