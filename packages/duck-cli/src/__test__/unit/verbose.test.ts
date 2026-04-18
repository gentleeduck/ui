import { afterEach, describe, expect, it } from 'vitest'
import { isVerbose, setVerbose } from '~/utils/verbose'

describe('verbose', () => {
  afterEach(() => {
    setVerbose(false)
  })

  it('defaults to false', () => {
    expect(isVerbose()).toBe(false)
  })

  it('can be set to true', () => {
    setVerbose(true)
    expect(isVerbose()).toBe(true)
  })

  it('can be set back to false', () => {
    setVerbose(true)
    setVerbose(false)
    expect(isVerbose()).toBe(false)
  })
})
