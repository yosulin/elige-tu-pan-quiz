import { useMemo } from 'react'
import { useI18n } from '../i18n'
import panes from '../data/panes.json'

export default function StartScreen({ onStart }) {
  const { t } = useI18n()

  const collage = useMemo(() => {
    const shuffled = [...panes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [])

  return (
    <div className="start-screen">
      <div className="start-collage" aria-hidden="true">
        {collage.map((pan) => (
          <img key={pan.id} src={pan.imagen} alt="" loading="lazy" />
        ))}
      </div>

      <h1>{t('appTitle')}</h1>
      <p className="subtitle">{t('appSubtitle')}</p>

      <div className="start-card">
        <p>{t('start.description')}</p>
        <button type="button" className="btn btn-primary" onClick={onStart}>
          {t('start.cta')}
        </button>
      </div>
    </div>
  )
}
