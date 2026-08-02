import { useI18n } from './i18n'
import { useQuiz } from './hooks/useQuiz'
import { assetUrl } from './utils/assetUrl'
import LanguageSwitcher from './components/LanguageSwitcher'
import StartScreen from './components/StartScreen'
import QuizCard from './components/QuizCard'
import ResultScreen from './components/ResultScreen'
import InstallPrompt from './components/InstallPrompt'

export default function App() {
  const { t } = useI18n()
  const quiz = useQuiz()

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">
          <img src={assetUrl('favicon.svg')} alt="" className="brand-logo" />
          OKIN<span>·</span>Quiz
        </span>
        <LanguageSwitcher />
      </header>

      <main>
        {quiz.status === 'idle' && <StartScreen onStart={quiz.startGame} />}

        {quiz.status === 'playing' && quiz.currentQuestion && (
          <QuizCard
            question={quiz.currentQuestion}
            index={quiz.currentIndex}
            total={quiz.totalQuestions}
            answered={quiz.answered}
            onAnswer={quiz.answer}
            onNext={quiz.next}
          />
        )}

        {quiz.status === 'finished' && (
          <ResultScreen
            correctCount={quiz.correctCount}
            totalQuestions={quiz.totalQuestions}
            percentage={quiz.percentage}
            history={quiz.history}
            onPlayAgain={quiz.startGame}
          />
        )}
      </main>

      <p className="footer-note">{t('footer.madeIn')}</p>
      <InstallPrompt />
    </div>
  )
}
