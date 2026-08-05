import { useMemo } from 'react'
import { useI18n } from '../i18n'
import panes from '../data/panes.json'
import { assetUrl } from '../utils/assetUrl'
import { vibrate } from '../utils/feedback'

export default function StartScreen({ onStart }) {
  const { t } = useI18n()

  const collage = useMemo(() => {
    const shuffled = [...panes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [])

  function handleStart() {
    // Redoble de tambor en miniatura: tap-tap-¡adelante! — para arrancar con ganas
    vibrate([15, 60, 15, 60, 40])
    onStart()
  }

  return (
    <div className="start-screen">
      <div className="start-collage" aria-hidden="true">
        {collage.map((pan) => (
          <img key={pan.id} src={assetUrl(pan.imagen)} alt="" loading="lazy" />
        ))}
      </div>

      <h1>{t('appTitle')}</h1>
      <p className="subtitle">{t('appSubtitle')}</p>

      <div className="start-card">
        <p>{t('start.description')}</p>
        <button type="button" className="btn btn-primary" onClick={handleStart}>
          {t('start.cta')}
        </button>
      </div>
    </div>
  )
}
