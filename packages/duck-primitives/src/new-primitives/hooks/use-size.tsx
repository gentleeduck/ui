import * as React from 'react'
import { useLayoutEffect } from './use-layout-effect'

/**
 * Observes an element's border-box size via ResizeObserver.
 * Returns { width, height } or undefined when the element is null.
 * Provides the initial size synchronously via offsetWidth/offsetHeight.
 */
function useSize(element: HTMLElement | null) {
  const [size, setSize] = React.useState<{ width: number; height: number } | undefined>(undefined)

  useLayoutEffect(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight })

      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) return

        const entry = entries[0]!
        let width: number
        let height: number

        if ('borderBoxSize' in entry) {
          const borderSize = Array.isArray(entry['borderBoxSize']) ? entry['borderBoxSize'][0] : entry['borderBoxSize']
          width = borderSize['inlineSize']
          height = borderSize['blockSize']
        } else {
          width = element.offsetWidth
          height = element.offsetHeight
        }

        setSize({ width, height })
      })

      resizeObserver.observe(element, { box: 'border-box' })

      return () => resizeObserver.unobserve(element)
    } else {
      setSize(undefined)
    }
  }, [element])

  return size
}

export { useSize }
