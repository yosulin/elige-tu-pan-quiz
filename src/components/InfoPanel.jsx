import { useState } from 'react'
import { useI18n } from '../i18n'
import { assetUrl } from '../utils/assetUrl'
import { vibrate } from '../utils/feedback'

export default function InfoPanel() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="corner-btn bottom-right"
        onClick={() => {
          vibrate(12)
          setOpen(true)
        }}
        aria-label={t('info.title')}
        title={t('info.title')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="info-overlay" onClick={() => setOpen(false)}>
          <div className="info-sheet" onClick={(e) => e.stopPropagation()}>
            <img src={assetUrl('favicon.svg')} alt="" className="info-logo" />
            <h3>{t('info.title')}</h3>

            <dl className="info-rows">
              <div>
                <dt>{t('info.version')}</dt>
                <dd>v{__APP_VERSION__}</dd>
              </div>
              <div>
                <dt>{t('info.build')}</dt>
                <dd>#{__GIT_HASH__}</dd>
              </div>
              <div>
                <dt>{t('info.updated')}</dt>
                <dd>{__BUILD_DATE__}</dd>
              </div>
            </dl>

            <p className="info-footer">{t('footer.madeIn')}</p>

            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
              {t('info.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
