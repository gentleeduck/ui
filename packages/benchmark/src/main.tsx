import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import { lazy } from "react"
// @ts-expect-error d
import "@gentelduck/motion/css"

// import App from './App'
const App = lazy(()=> import('./App')) 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
 