import { useDebounce } from '@gentleduck/libs'
import React from 'react'
import { UseDrawerDragProps } from './drawer.types'

export function useDrawerDrag({ ref, onOpenChange, holdUpThreshold = 10 }: UseDrawerDragProps) {
  const isDraggingRef = React.useRef(false)
  const startYRef = React.useRef(0)
  const currentYRef = React.useRef(0)
  const animationFrameRef = React.useRef<number | null>(null)

  const [isDragging, setIsDragging] = React.useState(false)

  const FRAME_TIME = 1
  const SMOOTH_FACTOR = 0.2
  const SNAP_THRESHOLD = 0.3 // 30%

  // @ts-ignore FIX: this type should be fixed
  const updateTransform = useDebounce((deltaY: number) => {
    if (!ref?.current) return
    const limited = Math.max(-holdUpThreshold, Math.min(deltaY, window.innerHeight))
    const currentTransform =
      Number.parseFloat(ref.current.style.transform.replace('translateY(', '').replace('px)', '')) || 0
    const smoothed = currentTransform + (limited - currentTransform) * SMOOTH_FACTOR
    ref.current.style.transform = `translateY(${Math.round(smoothed)}px)`
  }, FRAME_TIME)

  const shouldClose = (deltaY: number): boolean => {
    if (!ref?.current) return false
    return deltaY > ref.current.offsetHeight * SNAP_THRESHOLD
  }

  const resetTransform = () => {
    if (!ref?.current) return
    ref.current.style.transform = ''
  }

  const endDrag = () => {
    if (!ref?.current) return
    const deltaY = currentYRef.current - startYRef.current
    isDraggingRef.current = false
    setIsDragging(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (shouldClose(deltaY) && onOpenChange) {
      ref.current.style.transform = 'translateY(0)'
      onOpenChange(false)
    } else {
      resetTransform()
    }
  }

  const onPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if (!ref?.current) return

    const rect = ref.current.getBoundingClientRect()
    if (e.clientY > rect.top + rect.height / 2) return

    isDraggingRef.current = true
    setIsDragging(true)
    startYRef.current = e.clientY
    currentYRef.current = e.clientY

    // start animation loop
    const step = () => {
      if (!isDraggingRef.current) return
      const delta = currentYRef.current - startYRef.current
      updateTransform(delta)
      animationFrameRef.current = requestAnimationFrame(step)
    }
    animationFrameRef.current = requestAnimationFrame(step)
  }

  const onPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    currentYRef.current = e.clientY
  }

  const onPointerUp = (_e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    endDrag()
  }

  const els = document.querySelectorAll('[data-drawer]')

  const value = els[0]?.attributes.getNamedItem('data-open')?.value
  console.log(value, els?.[0]?.id)
  // INFO: i fucking hate my job any way i will use the GPT to get some inspirations.

  // NOTE: i am kinda stuck here have no idea what to do
  // els.forEach((el) => {
  //   const value = el?.attributes.getNamedItem('data-open')?.value
  //   console.log(value, el.id)
  // })
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return { isDragging, onPointerDown, onPointerMove, onPointerUp }
}
