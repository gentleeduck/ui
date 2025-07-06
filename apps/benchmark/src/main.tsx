import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
// @ts-expect-error css
import '@gentleduck/motion/css'
import { TableDemo } from '@gentleduck/registry-ui-duckui/table'

import { lazy } from 'react'

// import App from './App'
const App = lazy(() => import('./App'))

import { atom, useAtom } from '@gentleduck/state/atom'
export const countAtom = atom(0)

export function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <TableDemo />
  </StrictMode>,
)
