import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import '@gentleduck/motion/css'
import { App } from './App.tsx'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
