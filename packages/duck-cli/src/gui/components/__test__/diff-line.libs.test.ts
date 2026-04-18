import { describe, expect, it } from 'vitest'
import { getRenderableDiffSegments } from '../diff-line.libs'

describe('getRenderableDiffSegments', () => {
  it('assigns stable unique keys to duplicate segments', () => {
    const segments = getRenderableDiffSegments([
      { text: 'duck', highlight: false },
      { text: 'duck', highlight: false },
      { text: 'duck', highlight: true, color: 'green' },
      { text: 'duck', highlight: true, color: 'green' },
    ])

    expect(segments.map((segment) => segment.key)).toEqual([
      'duck\u0000false\u0000\u00000',
      'duck\u0000false\u0000\u00001',
      'duck\u0000true\u0000green\u00000',
      'duck\u0000true\u0000green\u00001',
    ])
  })

  it('preserves the original segment data', () => {
    const [segment] = getRenderableDiffSegments([{ text: 'ui', highlight: true, color: 'red' }])

    expect(segment).toMatchObject({
      color: 'red',
      highlight: true,
      text: 'ui',
    })
  })
})
