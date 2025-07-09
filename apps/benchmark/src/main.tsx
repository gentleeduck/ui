import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
// @ts-expect-error css
import '@gentleduck/motion/css'
import { TableDemo } from '@gentleduck/registry-ui-duckui/table'

import { lazy } from 'react'

// import App from './App'
const App = lazy(() => import('./App'))

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <TableDemo />
  </StrictMode>,
)
