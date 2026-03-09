import { afterEach, describe, expect, it } from 'vitest'
import { is_verbose, set_verbose } from '~/utils/verbose'

describe('verbose', () => {
  afterEach(() => {
    set_verbose(false)
  })

  it('defaults to false', () => {
    expect(is_verbose()).toBe(false)
  })

  it('can be set to true', () => {
    set_verbose(true)
    expect(is_verbose()).toBe(true)
  })

  it('can be set back to false', () => {
    set_verbose(true)
    set_verbose(false)
    expect(is_verbose()).toBe(false)
  })
})
