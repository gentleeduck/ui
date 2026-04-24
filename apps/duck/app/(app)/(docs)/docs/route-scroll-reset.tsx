'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function DocsRouteScrollReset() {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }

    // Force-reset scroll on docs route changes where soft navigation may preserve position.
    requestAnimationFrame(() => {
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })

    previousPathname.current = pathname
  }, [pathname])

  return null
}
