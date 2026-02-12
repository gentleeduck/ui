import React from 'react'

export function useSelectScroll(
  open: boolean,
  itemsRef: React.RefObject<HTMLLIElement[]>,
  selectedItemRef: React.RefObject<HTMLLIElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>, // make sure this is the scrollable div, not the dialog
) {
  React.useEffect(() => {
    if (!open || !contentRef.current) return

    const scrollContainer = contentRef.current
    const keyDown = scrollContainer.parentElement?.querySelector<HTMLButtonElement>('[duck-select-scroll-down-button]')
    const keyUp = scrollContainer.parentElement?.querySelector<HTMLButtonElement>('[duck-select-scroll-up-button]')

    if (!keyDown || !keyUp) return

    let intervalId: NodeJS.Timeout | null = null

    const moveSelectionDown = () => {
      if (!itemsRef.current || !selectedItemRef.current) return

      const currentIndex = itemsRef.current.findIndex((item) => item.id === selectedItemRef.current?.id)
      if (currentIndex === -1) return

      const nextIndex = Math.min(currentIndex + 1, itemsRef.current.length - 1)
      selectedItemRef.current = itemsRef.current[nextIndex] as HTMLLIElement

      // Instead of scrollIntoView, scroll only inside the container
      scrollContainer.scrollTop = selectedItemRef.current.offsetTop - scrollContainer.clientHeight / 2
    }

    const moveSelectionUp = () => {
      if (!itemsRef.current || !selectedItemRef.current) return

      const currentIndex = itemsRef.current.findIndex((item) => item.id === selectedItemRef.current?.id)
      if (currentIndex === -1) return

      const prevIndex = Math.max(currentIndex - 1, 0)
      selectedItemRef.current = itemsRef.current[prevIndex] as HTMLLIElement

      scrollContainer.scrollTop = selectedItemRef.current.offsetTop - scrollContainer.clientHeight / 2
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

    // Store references so removeEventListener works
    const handleDownEnter = () => startInterval(moveSelectionDown)
    const handleDownLeave = stopInterval
    const handleUpEnter = () => startInterval(moveSelectionUp)
    const handleUpLeave = stopInterval

    keyDown.addEventListener('mouseenter', handleDownEnter)
    keyDown.addEventListener('mouseleave', handleDownLeave)
    keyUp.addEventListener('mouseenter', handleUpEnter)
    keyUp.addEventListener('mouseleave', handleUpLeave)

    return () => {
      keyDown.removeEventListener('mouseenter', handleDownEnter)
      keyDown.removeEventListener('mouseleave', handleDownLeave)
      keyUp.removeEventListener('mouseenter', handleUpEnter)
      keyUp.removeEventListener('mouseleave', handleUpLeave)
      stopInterval()
    }
  }, [open, itemsRef, selectedItemRef, contentRef])
}
