import { useI18n } from './i18n'
import { useQuiz } from './hooks/useQuiz'
import { useTheme } from './hooks/useTheme'
import { assetUrl } from './utils/assetUrl'
import LanguageSwitcher from './components/LanguageSwitcher'
import ThemeToggle from './components/ThemeToggle'
import StartScreen from './components/StartScreen'
import QuizCard from './components/QuizCard'
import ResultScreen from './components/ResultScreen'
import InstallPrompt from './components/InstallPrompt'
import InfoPanel from './components/InfoPanel'

export default function App() {
  const { t } = useI18n()
  const quiz = useQuiz()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">
          <img src={assetUrl('favicon.svg')} alt="" className="brand-logo" />
          OKIN<span>·</span>Quiz
        </span>
        <div className="topbar-actions">
          <LanguageSwitcher />
        </div>
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
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <InfoPanel />
    </div>
  )
}
