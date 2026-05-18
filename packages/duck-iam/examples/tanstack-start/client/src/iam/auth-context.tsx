import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { mockBackend } from './mock-backend'
import { engine, seedSubjectAttributes } from './engine'
import type { User } from './types'

interface IAuthState {
  currentUserId: string | null
  users: User[]
  setCurrentUserId: (id: string | null) => void
}

const AuthCtx = React.createContext<IAuthState | null>(null)

const STORAGE_KEY = 'iam-demo:current-user'
const DEFAULT_USER_ID = 'u-alice'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => mockBackend.listUsers(),
  })

  const [currentUserId, setCurrentUserIdState] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return DEFAULT_USER_ID
    return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_USER_ID
  })

  React.useEffect(() => {
    void seedSubjectAttributes()
  }, [])

  const setCurrentUserId = React.useCallback(
    (id: string | null) => {
      setCurrentUserIdState(id)
      if (typeof window !== 'undefined') {
        if (id) window.localStorage.setItem(STORAGE_KEY, id)
        else window.localStorage.removeItem(STORAGE_KEY)
      }
      queryClient.invalidateQueries({ queryKey: ['iam'] })
    },
    [queryClient],
  )

  const value = React.useMemo(() => ({ currentUserId, users, setCurrentUserId }), [currentUserId, users, setCurrentUserId])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth(): IAuthState {
  const ctx = React.useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function useCurrentUser(): User | null {
  const { currentUserId, users } = useAuth()
  return React.useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [currentUserId, users])
}

export { engine }
