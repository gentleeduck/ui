'use client'

import * as React from 'react'

export interface IMountProps {
  open: boolean
  renderOnce?: boolean
  children?: React.ReactNode
  animationDuration?: number
}

function Mount({ open, renderOnce = false, children, animationDuration = 400 }: IMountProps) {
  const [mounted, setMounted] = React.useState(open)

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (open) {
      // Mount immediately on open
      setMounted(true)
    } else if (!open && mounted) {
      // Wait for the closing animation to finish
      timeout = setTimeout(() => {
        setMounted(false)
      }, animationDuration)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [open, animationDuration, mounted])

  if (!mounted && renderOnce) return null
  return <>{mounted ? children : null}</>
}

export { Mount }
