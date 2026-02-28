import { vi } from 'vitest'

export function createMockSpinner() {
  const spinner: Record<string, any> = {
    fail: vi.fn().mockReturnThis(),
    info: vi.fn().mockReturnThis(),
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    text: '',
    warn: vi.fn().mockReturnThis(),
  }

  // Make text assignable and readable
  let _text = ''
  Object.defineProperty(spinner, 'text', {
    get: () => _text,
    set: (val: string) => {
      _text = val
    },
  })

  return spinner
}
