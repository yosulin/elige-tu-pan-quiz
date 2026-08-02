import { useI18n } from '../i18n'

function tierKey(percentage) {
  if (percentage >= 90) return 'result.tier.excellent'
  if (percentage >= 70) return 'result.tier.good'
  if (percentage >= 40) return 'result.tier.soso'
  return 'result.tier.low'
}

export default function ResultScreen({ correctCount, totalQuestions, percentage, onPlayAgain }) {
  const { t } = useI18n()

  return (
    <div className="result-screen">
      <div className="stamp" role="img" aria-label={`${percentage}%`}>
        <span className="stamp-percent">{percentage}%</span>
        <span className="stamp-label">OKIN</span>
      </div>

      <h2>{t('result.title')}</h2>
      <p className="tier">{t(tierKey(percentage))}</p>
      <p className="score-line">
        {t('result.score', { correct: correctCount, total: totalQuestions })}
      </p>

      <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
        {t('result.playAgain')}
      </button>
    </div>
  )
}
