import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '~/utils/text-styling/logger'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('error() calls console.log and returns logger for chaining', () => {
    const result = logger.error({ args: ['test error'] })
    expect(console.log).toHaveBeenCalled()
    expect(result).toBe(logger)
  })

  it('warn() calls console.log and returns logger', () => {
    const result = logger.warn({ args: ['test warning'] })
    expect(console.log).toHaveBeenCalled()
    expect(result).toBe(logger)
  })

  it('info() calls console.log and returns logger', () => {
    const result = logger.info({ args: ['test info'] })
    expect(console.log).toHaveBeenCalled()
    expect(result).toBe(logger)
  })

  it('success() calls console.log and returns logger', () => {
    const result = logger.success({ args: ['test success'] })
    expect(console.log).toHaveBeenCalled()
    expect(result).toBe(logger)
  })

  it('break() outputs empty line and returns logger', () => {
    const result = logger.break()
    expect(console.log).toHaveBeenCalledWith('')
    expect(result).toBe(logger)
  })

  it('supports chaining multiple calls', () => {
    const result = logger
      .info({ args: ['one'] })
      .warn({ args: ['two'] })
      .break()
    expect(console.log).toHaveBeenCalledTimes(3)
    expect(result).toBe(logger)
  })
})
