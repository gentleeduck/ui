import React from 'react'

export function useSelectScroll(
  open: boolean,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
  contentRef: React.RefObject<HTMLDialogElement | null>,
) {
  React.useEffect(() => {
    if (!open) return
    setTimeout(() => {
      const keyDown = contentRef.current?.querySelector<HTMLDivElement>('[duck-select-scroll-down-button]')
      const keyUp = contentRef.current?.querySelector<HTMLDivElement>('[duck-select-scroll-up-button]')
      if (!keyDown || !keyUp) return

      let intervalId: NodeJS.Timeout | null = null

      const moveSelectionDown = () => {
        if (!itemsRef.current || !selectedItemRef.current) return

        const currentIndex = itemsRef.current.findIndex((item) => item.id === selectedItemRef.current?.id)
        if (currentIndex === -1) return

        const nextIndex = Math.min(currentIndex + 1, itemsRef.current.length - 1)
        selectedItemRef.current = itemsRef.current[nextIndex]!

        selectedItemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }

      const moveSelectionUp = () => {
        if (!itemsRef.current || !selectedItemRef.current) return

        const currentIndex = itemsRef.current.findIndex((item) => item.id === selectedItemRef.current?.id)
        if (currentIndex === -1) return

        const prevIndex = Math.max(currentIndex - 1, 0)
        selectedItemRef.current = itemsRef.current[prevIndex]!

        selectedItemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }

      const startInterval = (fn: () => void) => {
        stopInterval()
        fn()
        intervalId = setInterval(fn, 40)
      }

      const stopInterval = () => {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      }

      keyDown.addEventListener('mouseenter', () => startInterval(moveSelectionDown))
      keyDown.addEventListener('mouseleave', stopInterval)

      keyUp.addEventListener('mouseenter', () => startInterval(moveSelectionUp))
      keyUp.addEventListener('mouseleave', stopInterval)

      return () => {
        keyDown.removeEventListener('mouseenter', () => startInterval(moveSelectionDown))
        keyDown.removeEventListener('mouseleave', stopInterval)

        keyUp.removeEventListener('mouseenter', () => startInterval(moveSelectionUp))
        keyUp.removeEventListener('mouseleave', stopInterval)

        stopInterval()
      }
    }, 0)
  }, [open])
}
