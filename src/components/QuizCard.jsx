import { useI18n } from '../i18n'

export default function QuizCard({ question, index, total, answered, onAnswer, onNext }) {
  const { t } = useI18n()
  const { pan, options, correctId } = question

  function optionClass(optionId) {
    if (!answered) return 'option-btn'
    if (optionId === correctId) return 'option-btn is-correct'
    if (optionId === answered.selectedId) return 'option-btn is-incorrect'
    return 'option-btn'
  }

  return (
    <div className="ticket">
      <div className="ticket-header">
        <span className="ticket-code">{t('quiz.question', { current: index + 1, total })}</span>
        <span className="score-pill">{pan.id.slice(0, 6).toUpperCase()}</span>
      </div>

      <div className="ticket-photo-frame">
        <img src={pan.imagen} alt="" />
      </div>

      <p className="ticket-prompt">{t('quiz.prompt')}</p>

      <div className="options">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={optionClass(opt.id)}
            disabled={!!answered}
            onClick={() => onAnswer(opt.id)}
          >
            {opt.nombre}
          </button>
        ))}
      </div>

      <div className="feedback-row">
        {answered ? (
          <span className={`feedback-text ${answered.isCorrect ? 'is-correct' : 'is-incorrect'}`}>
            {answered.isCorrect ? t('quiz.correct') : t('quiz.incorrect', { name: pan.nombre })}
          </span>
        ) : (
          <span />
        )}
        {answered && (
          <button type="button" className="btn-next" onClick={onNext}>
            {t('quiz.next')}
          </button>
        )}
      </div>
    </div>
  )
}
