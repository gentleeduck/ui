declare module 'react-dom/server' {
  import type { ReactElement } from 'react'

  export function renderToString(element: ReactElement): string
}
