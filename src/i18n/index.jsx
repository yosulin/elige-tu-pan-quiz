import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import es from './es.json'
import eu from './eu.json'
import en from './en.json'
import fr from './fr.json'

export const LANGUAGES = [
  { code: 'es', label: 'ES' },
  { code: 'eu', label: 'EU' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' }
]

const DICTIONARIES = { es, eu, en, fr }
const DEFAULT_LANG = 'es'
const STORAGE_KEY = 'okin-quiz-lang'

function detectInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && DICTIONARIES[stored]) return stored
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.)
  }
  const browserLang = (navigator.language || 'es').slice(0, 2)
  return DICTIONARIES[browserLang] ? browserLang : DEFAULT_LANG
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage)

  const setLang = useCallback((code) => {
    if (!DICTIONARIES[code]) return
    setLangState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // ignorar si no hay storage disponible
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      const dict = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG]
      let str = dict[key] ?? DICTIONARIES[DEFAULT_LANG][key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, v)
        }
      }
      return str
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>')
  return ctx
}
