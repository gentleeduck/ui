import { parseCodeFenceMeta } from '../../../src/velite/plugins/metadata-utils'

describe('parseCodeFenceMeta', () => {
  it('extracts title and marks from code fence metadata', () => {
    const parsed = parseCodeFenceMeta('title="Demo block" /1,3-5/')

    expect(parsed.title).toBe('Demo block')
    expect(parsed.marks).toEqual(['1,3-5'])
  })

  it('returns undefined fields when metadata is absent', () => {
    const parsed = parseCodeFenceMeta('lineNumbers=true')

    expect(parsed.title).toBeUndefined()
    expect(parsed.marks).toBeUndefined()
  })
})
