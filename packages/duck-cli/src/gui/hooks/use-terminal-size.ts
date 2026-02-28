import { useRef, useState, useEffect } from 'react'

export interface TerminalSize {
  columns: number
  rows: number
}

export function useTerminalSize(): TerminalSize {
  const [size, setSize] = useState<TerminalSize>({
    columns: process.stdout.columns ?? 80,
    rows: process.stdout.rows ?? 24,
  })

  const prev = useRef(size)

  useEffect(() => {
    const onResize = () => {
      const next = {
        columns: process.stdout.columns ?? 80,
        rows: process.stdout.rows ?? 24,
      }
      if (next.columns !== prev.current.columns || next.rows !== prev.current.rows) {
        prev.current = next
        setSize(next)
      }
    }

    process.stdout.on('resize', onResize)
    return () => {
      process.stdout.off('resize', onResize)
    }
  }, [])

  return size
}
