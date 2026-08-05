import { describe, it, expect } from 'vitest'
import { buildShareText } from './ResultScreen'

const t = (key) => {
  if (key === 'appTitle') return '¿Qué pan es?'
  if (key === 'share.cta') return '¿Tú cuántos aciertas?'
  return key
}

describe('buildShareText', () => {
  it('incluye el marcador, el porcentaje y la cuadrícula en el orden correcto', () => {
    const text = buildShareText({
      t,
      correctCount: 3,
      totalQuestions: 4,
      percentage: 75,
      history: [true, false, true, true]
    })

    expect(text).toContain('3/4')
    expect(text).toContain('75%')
    expect(text).toContain('🟫⬜🟫🟫')
    expect(text).toContain('¿Tú cuántos aciertas?')
  })

  it('incluye una URL sin parámetros de consulta ni fragmento', () => {
    const text = buildShareText({
      t,
      correctCount: 10,
      totalQuestions: 10,
      percentage: 100,
      history: Array(10).fill(true)
    })
    const lastLine = text.trim().split('\n').at(-1)
    expect(lastLine).not.toContain('?')
    expect(lastLine).not.toContain('#')
  })
})
