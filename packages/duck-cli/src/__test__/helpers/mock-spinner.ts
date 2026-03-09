import type { Ora } from 'ora'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

type SpinnerMethods = 'fail' | 'info' | 'start' | 'stop' | 'succeed' | 'warn'

export type MockSpinner = Ora & {
  [K in SpinnerMethods]: Mock<(...args: Parameters<Ora[K]>) => Ora>
}

export function createMockSpinner(): MockSpinner {
  const spinner = {} as MockSpinner

  spinner.fail = vi.fn().mockReturnValue(spinner)
  spinner.info = vi.fn().mockReturnValue(spinner)
  spinner.start = vi.fn().mockReturnValue(spinner)
  spinner.stop = vi.fn().mockReturnValue(spinner)
  spinner.succeed = vi.fn().mockReturnValue(spinner)
  spinner.warn = vi.fn().mockReturnValue(spinner)

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
