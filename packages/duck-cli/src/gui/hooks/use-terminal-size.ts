import { useEffect, useRef, useState } from 'react'

export interface ITerminalSize {
  columns: number
  rows: number
}

/** Subscribes to stdout `resize` and skips setState when dimensions are unchanged. 80x24 fallback for non-TTY. */
export function useTerminalSize(): ITerminalSize {
  const [size, setSize] = useState<ITerminalSize>({
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
