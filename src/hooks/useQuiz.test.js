import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuiz } from './useQuiz'

describe('useQuiz', () => {
  it('juega 10 preguntas sin repetir el mismo pan en la partida', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.startGame())

    const seenIds = new Set()
    for (let i = 0; i < 10; i++) {
      const q = result.current.currentQuestion
      expect(q).toBeTruthy()
      expect(seenIds.has(q.pan.id)).toBe(false)
      seenIds.add(q.pan.id)

      // 4 opciones, y la correcta está entre ellas
      expect(q.options).toHaveLength(4)
      expect(q.options.some((o) => o.id === q.correctId)).toBe(true)

      act(() => result.current.answer(q.correctId))
      act(() => result.current.next())
    }

    expect(seenIds.size).toBe(10)
    expect(result.current.status).toBe('finished')
  })

  it('cuenta bien los aciertos y calcula el porcentaje', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.startGame())

    for (let i = 0; i < 10; i++) {
      const q = result.current.currentQuestion
      const wrongOption = q.options.find((o) => o.id !== q.correctId)
      act(() => result.current.answer(wrongOption.id)) // fallamos todas a propósito
      act(() => result.current.next())
    }

    expect(result.current.correctCount).toBe(0)
    expect(result.current.percentage).toBe(0)
  })

  it('ignora una segunda respuesta a la misma pregunta', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.startGame())

    const q = result.current.currentQuestion
    act(() => result.current.answer(q.correctId))
    const afterFirst = result.current.correctCount

    const otherOption = q.options.find((o) => o.id !== q.correctId)
    act(() => result.current.answer(otherOption.id))

    expect(result.current.correctCount).toBe(afterFirst) // no cambia
  })

  it('reset() vuelve al estado inicial', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.startGame())
    act(() => result.current.reset())

    expect(result.current.status).toBe('idle')
    expect(result.current.totalQuestions).toBe(0)
    expect(result.current.correctCount).toBe(0)
  })
})
