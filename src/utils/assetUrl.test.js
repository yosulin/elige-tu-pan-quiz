import { describe, it, expect } from 'vitest'
import { assetUrl } from './assetUrl'

describe('assetUrl', () => {
  it('resuelve una ruta absoluta sin duplicar barras', () => {
    const url = assetUrl('/images/foo.jpg')
    expect(url).not.toMatch(/\/\/images/)
    expect(url).toMatch(/images\/foo\.jpg$/)
  })

  it('resuelve una ruta sin barra inicial igual', () => {
    const url = assetUrl('images/foo.jpg')
    expect(url).toMatch(/images\/foo\.jpg$/)
  })
})
