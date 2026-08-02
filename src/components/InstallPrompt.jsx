import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { assetUrl } from '../utils/assetUrl'

const DISMISS_KEY = 'okin-quiz-install-dismissed'

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  )
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isSafari() {
  const ua = window.navigator.userAgent
  return /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua)
}

export default function InstallPrompt() {
  const { t } = useI18n()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === '1') setDismissed(true)
    } catch {
      // sin storage disponible, seguimos sin recordar el cierre
    }

    if (isStandalone()) return

    function handleBeforeInstall(event) {
      event.preventDefault()
      setDeferredPrompt(event)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    function handleInstalled() {
      setDeferredPrompt(null)
      setDismissed(true)
    }
    window.addEventListener('appinstalled', handleInstalled)

    // iOS Safari no dispara beforeinstallprompt: no hay forma programática
    // de instalar, así que mostramos instrucciones manuales.
    if (isIos() && isSafari()) setShowIosHint(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignorar si no hay storage
    }
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (dismissed || isStandalone()) return null
  if (!deferredPrompt && !showIosHint) return null

  return (
    <div className="install-banner" role="dialog" aria-label={t('install.title')}>
      <img src={assetUrl('favicon.svg')} alt="" className="install-icon" />
      <div className="install-copy">
        <strong>{t('install.title')}</strong>
        <p>{showIosHint && !deferredPrompt ? t('install.iosDescription') : t('install.description')}</p>
      </div>
      {deferredPrompt && (
        <button type="button" className="btn btn-primary btn-install" onClick={handleInstallClick}>
          {t('install.cta')}
        </button>
      )}
      <button
        type="button"
        className="install-close"
        onClick={dismiss}
        aria-label={t('install.dismiss')}
      >
        ×
      </button>
    </div>
  )
}
