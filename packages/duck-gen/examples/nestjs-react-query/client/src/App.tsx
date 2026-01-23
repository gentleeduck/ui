import { createDuckQueryClient } from '@gentleduck/query'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApiRoutes, RouteReq, RouteRes } from '../../generated/duck-gen-api-routes'
import type { Locale } from './i18n'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'
const client = createDuckQueryClient<ApiRoutes>({
  baseURL: API_BASE,
})

const signInPath = '/api/auth/signin' as const

type SignInPath = typeof signInPath
type SignInReq = RouteReq<SignInPath>
type SignInRes = RouteRes<SignInPath>

export function App() {
  const { i18n: i18nInstance, t } = useTranslation('auth')
  const [locale, setLocale] = useState<Locale>('en')
  const [username, setUsername] = useState('duck')
  const [password, setPassword] = useState('quack')

  useEffect(() => {
    void i18nInstance.changeLanguage(locale)
  }, [i18nInstance, locale])

  const mutation = useMutation<SignInRes, Error, SignInReq>({
    mutationFn: async (req) => {
      let hi = await client.get('/api/auth/dup', {})
      let hi1 = await client.post('/api/auth/dup', {})

      hi.data.method
      hi1.data.method

      const response = await client.post(signInPath, req)
      return response.data
    },
  })

  const message = useMemo(() => {
    if (!mutation.data) return null
    return t(mutation.data.message)
  }, [locale, mutation.data, t])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({
      body: {
        username,
        password,
      },
    })
  }

  return (
    <div className="app">
      <header>
        <h1>Duck Gen Example</h1>
        <p>Type-safe API routes + i18n messages from your NestJS server.</p>
      </header>

      <section className="panel">
        <div className="row">
          <span>Locale</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Response</h2>
        {mutation.error ? <p className="error">{mutation.error.message}</p> : null}
        {mutation.data ? (
          <div className="result">
            <p className={mutation.data.ok ? 'success' : 'error'}>
              {mutation.data.ok ? 'OK' : 'ERROR'}: {message}
            </p>
            <pre>{JSON.stringify(mutation.data, null, 2)}</pre>
          </div>
        ) : (
          <p className="hint">Submit the form to see the typed response.</p>
        )}
      </section>
    </div>
  )
}
