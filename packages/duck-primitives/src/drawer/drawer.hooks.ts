import { useDebounce } from '@gentleduck/hooks'
import React from 'react'
export interface UseDrawerDragProps {
  ref: React.RefObject<HTMLDialogElement>
  holdUpThreshold?: number
  onOpenChange?: (open: boolean) => void
}

export interface UseDrawerDragReturn {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void
}

export function useScaleBackground({
  ref,
  open,
  // direction,
  // shouldScaleBackground,
  // setBackgroundColorOnScale,
  // noBodyStyles,
}: {
  ref: React.RefObject<HTMLDialogElement>
  open: boolean
  direction: 'top' | 'bottom' | 'left' | 'right'
  shouldScaleBackground: boolean
  setBackgroundColorOnScale: boolean
  noBodyStyles: boolean
}) {
  return React.useEffect(() => {
    if (open) {
      document.body.classList.add(
        'transition-all',
        'duration-250',
        'ease-(--duck-motion-ease)',
        'will-change-[transform,border-radius]',
        'transition-discrete',
      )
      document.body.style.transform = 'scale(0.97) translateY(1rem)'
      document.body.style.borderRadius = '20px'
      document.documentElement.style.background = 'black'
    } else {
      document.body.style.transform = ''
      document.body.style.borderRadius = ''
      if (ref?.current) {
        ref.current.style.transform = 'translateY(0px)'
      }
    }
  }, [open, ref])
}

export function useDrawerDrag({ ref, onOpenChange, holdUpThreshold = 10 }: UseDrawerDragProps): UseDrawerDragReturn {
  let isDragging = false
  let startY = 0
  let currentY = 0
  const FRAME_TIME = 4
  const SMOOTH_FACTOR = 1

  // @ts-ignore
  const updateTransform = useDebounce<(deltaY: number) => void>((deltaY) => {
    if (!ref?.current) return
    const limitedDeltaY = Math.max(-holdUpThreshold, Math.min(deltaY, window.innerHeight))
    const currentTransform =
      Number.parseFloat(ref.current.style.transform.replace('translateY(', '').replace('px)', '')) || 0
    const smoothedDeltaY = currentTransform + (limitedDeltaY - currentTransform) * SMOOTH_FACTOR

    ref.current.style.transform = `translateY(${Math.round(smoothedDeltaY)}px)`
  }, FRAME_TIME)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Only handle left mouse button
    isDragging = true
    startY = e.clientY
    currentY = startY

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaY = Math.round(e.clientY - startY)
      updateTransform(deltaY)
      currentY = e.clientY
    }

    const handleMouseUp = () => {
      if (!ref?.current) return
      isDragging = false
      const deltaY = Math.round(currentY - startY)
      const shouldClose = deltaY > 150 // Close if dragged more than 150px

      if (shouldClose && onOpenChange) {
        onOpenChange(false)
      } else {
        ref.current.style.transform = ''
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging = true
    startY = e.touches[0]?.clientY ?? 0
    currentY = startY
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !e.touches[0]) return
    const deltaY = Math.round(e.touches[0].clientY - startY)
    updateTransform(deltaY)
    currentY = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (!ref?.current) return
    isDragging = false
    const deltaY = Math.round(currentY - startY)
    const shouldClose = deltaY > 150 // Close if dragged more than 150px

    if (shouldClose && onOpenChange) {
      onOpenChange(false)
    } else {
      ref.current.style.transform = ''
    }
  }

  return {
    isDragging,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
