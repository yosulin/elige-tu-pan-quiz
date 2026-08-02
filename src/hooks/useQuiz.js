import { useCallback, useMemo, useState } from 'react'
import panes from '../data/panes.json'

const QUESTIONS_PER_GAME = 10
const OPTIONS_PER_QUESTION = 4

function shuffle(array) {
  // Fisher-Yates
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildQuestion(correctPan, pool) {
  // Distractores: nombres de otros panes, sin repetir entre sí ni con el correcto
  const others = pool.filter((p) => p.id !== correctPan.id)
  const distractors = shuffle(others).slice(0, OPTIONS_PER_QUESTION - 1)
  const options = shuffle([correctPan, ...distractors])
  return {
    pan: correctPan,
    options,
    correctId: correctPan.id
  }
}

export function useQuiz() {
  // 'idle' | 'playing' | 'finished'
  const [status, setStatus] = useState('idle')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(null) // { selectedId, isCorrect } | null
  const [history, setHistory] = useState([]) // bool[] - resultado de cada pregunta, en orden

  const totalQuestions = questions.length

  const startGame = useCallback(() => {
    // Sin repetir imagen dentro de la misma partida: barajamos el mazo completo
    // de 56 panes y tomamos los primeros N, sin reemplazo.
    const deck = shuffle(panes).slice(0, Math.min(QUESTIONS_PER_GAME, panes.length))
    const built = deck.map((pan) => buildQuestion(pan, panes))
    setQuestions(built)
    setCurrentIndex(0)
    setCorrectCount(0)
    setAnswered(null)
    setHistory([])
    setStatus('playing')
  }, [])

  const answer = useCallback(
    (selectedId) => {
      if (answered) return // evita doble respuesta
      const current = questions[currentIndex]
      const isCorrect = selectedId === current.correctId
      setAnswered({ selectedId, isCorrect })
      setHistory((h) => [...h, isCorrect])
      if (isCorrect) setCorrectCount((c) => c + 1)
    },
    [answered, questions, currentIndex]
  )

  const next = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setStatus('finished')
      return
    }
    setCurrentIndex((i) => i + 1)
    setAnswered(null)
  }, [currentIndex, totalQuestions])

  const reset = useCallback(() => {
    setStatus('idle')
    setQuestions([])
    setCurrentIndex(0)
    setCorrectCount(0)
    setAnswered(null)
    setHistory([])
  }, [])

  const percentage = useMemo(() => {
    if (totalQuestions === 0) return 0
    return Math.round((correctCount / totalQuestions) * 100)
  }, [correctCount, totalQuestions])

  return {
    status,
    currentQuestion: questions[currentIndex],
    currentIndex,
    totalQuestions,
    correctCount,
    percentage,
    answered,
    history,
    startGame,
    answer,
    next,
    reset
  }
}
