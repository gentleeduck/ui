import { useCallback, useState } from 'react'
import type { ServiceResult } from '~/services/service.types'

export type AsyncTaskState<T> =
  | { status: 'idle' }
  | { status: 'loading'; message: string }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

/** Adapts a `ServiceResult`-returning task into a React lifecycle, threading progress messages through state. */
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
