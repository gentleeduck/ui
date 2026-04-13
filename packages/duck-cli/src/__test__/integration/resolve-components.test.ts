import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockFetch } from '../helpers/mock-fetch'
import { createMockSpinner } from '../helpers/mock-spinner'

// Mock prompts for the prompt-path tests
const mockPrompts = vi.fn()
vi.mock('prompts', () => ({ default: mockPrompts }))

describe('resolveComponents', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', createMockFetch())
    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit(${code})`)
    }) as never)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches components by explicit names', async () => {
    const { resolveComponents } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()
    const result = await resolveComponents(['button', 'input'], spinner)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('button')
    expect(result[1].name).toBe('input')
    expect(spinner.succeed).toHaveBeenCalled()
  })

  it('filters out null results from failed fetches', async () => {
    const { resolveComponents } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()
    // 'nonexistent' will 404 and return null
    const result = await resolveComponents(['button', 'nonexistent'], spinner)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('button')
  })

  it('calls process.exit(0) when all fetches fail', async () => {
    const { resolveComponents } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()

    await expect(resolveComponents(['nonexistent1', 'nonexistent2'], spinner)).rejects.toThrow('process.exit(0)')
    expect(spinner.fail).toHaveBeenCalledWith('No components found to install')
  })

  it('fetches registry index and prompts user when no names given', async () => {
    mockPrompts.mockResolvedValue({ component: ['button', 'input'] })
    const { resolveComponents } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()

    const result = await resolveComponents([], spinner)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('button')
    expect(result[1].name).toBe('input')
    expect(mockPrompts).toHaveBeenCalled()
    expect(spinner.stop).toHaveBeenCalled()
    expect(spinner.start).toHaveBeenCalled()
  })

  it('exits with 0 when user selects nothing from prompt', async () => {
    mockPrompts.mockResolvedValue({})
    const { resolveComponents } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()

    await expect(resolveComponents([], spinner)).rejects.toThrow('process.exit(0)')
    expect(spinner.fail).toHaveBeenCalledWith('No components selected')
  })
})
