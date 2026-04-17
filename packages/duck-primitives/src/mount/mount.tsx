'use client'

import * as React from 'react'
import type { IMount } from './mount.types'

function Mount({ open, renderOnce = false, children, animationDuration = 400 }: IMount.IProps) {
  const [mounted, setMounted] = React.useState(open)

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (open) {
      setMounted(true)
    } else if (!open && mounted) {
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
