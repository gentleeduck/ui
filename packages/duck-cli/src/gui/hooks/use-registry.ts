import { useReducer, useCallback } from 'react'
import type { Registry } from '~/utils/get-registry'
import { fetch_registry } from '../services/registry.service'

type State = {
  index: Registry | null
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'fetch' }
  | { type: 'success'; data: Registry }
  | { type: 'error'; error: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'fetch':
      return { ...state, loading: true, error: null }
    case 'success':
      return { index: action.data, loading: false, error: null }
    case 'error':
      return { ...state, loading: false, error: action.error }
  }
}

export function useRegistry() {
  const [state, dispatch] = useReducer(reducer, {
    index: null,
    loading: false,
    error: null,
  })

  const fetch = useCallback(async () => {
    if (state.index) return
    dispatch({ type: 'fetch' })

    const result = await fetch_registry()
    if (result.ok) {
      dispatch({ type: 'success', data: result.data })
    } else {
      dispatch({ type: 'error', error: result.error })
    }
  }, [state.index])

  return { index: state.index, loading: state.loading, error: state.error, fetch }
}
