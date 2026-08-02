import { useState } from 'react'
import { useI18n } from '../i18n'
import Confetti from './Confetti'

function tierKey(percentage) {
  if (percentage >= 90) return 'result.tier.excellent'
  if (percentage >= 70) return 'result.tier.good'
  if (percentage >= 40) return 'result.tier.soso'
  return 'result.tier.low'
}

function buildShareText({ t, correctCount, totalQuestions, percentage, history }) {
  const grid = history.map((ok) => (ok ? '🟫' : '⬜')).join('')
  const url = window.location.href.split('?')[0].split('#')[0]
  return [
    `🍞 ${t('appTitle')} — ${correctCount}/${totalQuestions} (${percentage}%)`,
    grid,
    '',
    t('share.cta'),
    url
  ].join('\n')
}

export default function ResultScreen({ correctCount, totalQuestions, percentage, history, onPlayAgain }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const text = buildShareText({ t, correctCount, totalQuestions, percentage, history })
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {
        // el usuario canceló el diálogo de compartir; no hacemos nada
      }
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // sin API de portapapeles disponible; no hay fallback razonable más
    }
  }

  return (
    <div className="result-screen">
      {percentage >= 90 && <Confetti />}
      <div className="stamp" role="img" aria-label={`${percentage}%`}>
        <span className="stamp-percent">{percentage}%</span>
        <span className="stamp-label">OKIN</span>
      </div>

      <h2>{t('result.title')}</h2>
      <p className="tier">{t(tierKey(percentage))}</p>
      <p className="score-line">
        {t('result.score', { correct: correctCount, total: totalQuestions })}
      </p>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
          {t('result.playAgain')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleShare}>
          {copied ? t('share.copied') : t('share.button')}
        </button>
      </div>
    </div>
  )
}
