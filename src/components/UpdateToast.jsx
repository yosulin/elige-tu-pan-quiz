import { useRegisterSW } from 'virtual:pwa-register/react'
import { useI18n } from '../i18n'

export default function UpdateToast() {
  const { t } = useI18n()

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Si la pestaña se queda abierta horas (típico en una PWA instalada),
      // comprobamos cada hora si hay una versión nueva sin esperar a que
      // el usuario recargue por su cuenta.
      if (!registration) return
      setInterval(() => registration.update(), 60 * 60 * 1000)
    }
  })

  if (!needRefresh) return null

  return (
    <div className="update-toast" role="status">
      <span>{t('update.available')}</span>
      <button type="button" className="btn-next" onClick={() => updateServiceWorker(true)}>
        {t('update.reload')}
      </button>
      <button
        type="button"
        className="install-close"
        onClick={() => setNeedRefresh(false)}
        aria-label={t('update.dismiss')}
      >
        ×
      </button>
    </div>
  )
}
