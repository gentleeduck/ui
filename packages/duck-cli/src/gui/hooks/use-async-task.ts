import { useCallback, useState } from 'react'
import type { ServiceResult } from '~/services/service.types'

/**
 * Lifecycle states for an async operation:
 *   idle    - initial state, no operation started
 *   loading - in progress, with a progress message
 *   success - completed with result data
 *   error   - failed with an error message
 */
export type AsyncTaskState<T> =
  | { status: 'idle' }
  | { status: 'loading'; message: string }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

/**
 * Hook for managing async service calls with progress tracking.
 * Wraps a ServiceResult-returning function with loading/success/error state.
 */
export function useAsyncTask<T>() {
  const [state, setState] = useState<AsyncTaskState<T>>({ status: 'idle' })

  const run = useCallback(async (task: (onProgress: (msg: string) => void) => Promise<ServiceResult<T>>) => {
    setState({ status: 'loading', message: 'Starting...' })
    const onProgress = (message: string) => setState({ status: 'loading', message })

    const result = await task(onProgress)
    if (result.ok) {
      setState({ status: 'success', data: result.data })
    } else {
      setState({ status: 'error', error: result.error })
    }
    return result
  }, [])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, run, reset }
}
