import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockFetch } from '../helpers/mock-fetch'
import { createMockSpinner } from '../helpers/mock-spinner'

// Mock prompts for the prompt-path tests
const mockPrompts = vi.fn()
vi.mock('prompts', () => ({ default: mockPrompts }))

describe('resolve_components', () => {
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
    const { resolve_components } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()
    const result = await resolve_components(['button', 'input'], spinner as any)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('button')
    expect(result[1].name).toBe('input')
    expect(spinner.succeed).toHaveBeenCalled()
  })

  it('filters out null results from failed fetches', async () => {
    const { resolve_components } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()
    // 'nonexistent' will 404 and return null
    const result = await resolve_components(['button', 'nonexistent'], spinner as any)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('button')
  })

  it('calls process.exit(0) when all fetches fail', async () => {
    const { resolve_components } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()

    await expect(
      resolve_components(['nonexistent1', 'nonexistent2'], spinner as any),
    ).rejects.toThrow('process.exit(0)')
    expect(spinner.fail).toHaveBeenCalledWith('No components found to install')
  })

  it('fetches registry index and prompts user when no names given', async () => {
    mockPrompts.mockResolvedValue({ component: ['button', 'input'] })
    const { resolve_components } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()

    const result = await resolve_components([], spinner as any)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('button')
    expect(result[1].name).toBe('input')
    expect(mockPrompts).toHaveBeenCalled()
    expect(spinner.stop).toHaveBeenCalled()
    expect(spinner.start).toHaveBeenCalled()
  })

  it('exits with 0 when user selects nothing from prompt', async () => {
    mockPrompts.mockResolvedValue({})
    const { resolve_components } = await import('~/utils/resolve-components')
    const spinner = createMockSpinner()

    await expect(resolve_components([], spinner as any)).rejects.toThrow('process.exit(0)')
    expect(spinner.fail).toHaveBeenCalledWith('No components selected')
  })
})
