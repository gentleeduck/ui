'use client'

import { cn } from '@gentleduck/duck-libs/cn'
import React from 'react'

type SliderContextValue = {
  min: number
  max: number
  step: number
  values: number[]
  orientation: 'horizontal' | 'vertical'
  rtl: boolean
  trackRef: React.RefObject<HTMLDivElement | null>
  setValueAt: (index: number, val: number) => void
  positionToValue: (pos: number, rect: DOMRect) => number
}

const SliderContext = React.createContext<SliderContextValue | null>(null)

function useSliderContext() {
  const ctx = React.useContext(SliderContext)
  if (!ctx) throw new Error('Slider components must be inside SliderRoot')
  return ctx
}

function Root({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [50],
  onValueChange,
  orientation = 'horizontal',
  rtl = false,
  children,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'defaultValue'> & {
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  orientation?: 'horizontal' | 'vertical'
  rtl?: boolean
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const trackRef = React.useRef<HTMLDivElement>(null)

  const values = value ?? internalValue

  const setValueAt = React.useCallback(
    (index: number, newValue: number) => {
      const clamped = Math.min(max, Math.max(min, newValue))
      const rounded = Math.round(clamped / step) * step

      const updated = [...values]
      updated[index] = rounded

      if (onValueChange) onValueChange(updated)
      if (value === undefined) setInternalValue(updated)
    },
    [values, min, max, step, onValueChange, value],
  )

  const positionToValue = React.useCallback(
    (pos: number, rect: DOMRect) => {
      const percent = orientation === 'horizontal' ? (pos - rect.left) / rect.width : 1 - (pos - rect.top) / rect.height

      const adjusted = rtl && orientation === 'horizontal' ? 1 - percent : percent
      return min + adjusted * (max - min)
    },
    [min, max, orientation, rtl],
  )

  return (
    <SliderContext.Provider
      value={{
        min,
        max,
        step,
        values,
        orientation,
        rtl,
        trackRef,
        setValueAt,
        positionToValue,
      }}>
      <div {...props}>{children}</div>
    </SliderContext.Provider>
  )
}

function Track({ className, style, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { trackRef, orientation } = useSliderContext()

  return (
    <div
      ref={trackRef}
      style={{
        ...(orientation === 'horizontal' ? { width: '200px', height: '6px' } : { width: '6px', height: '200px' }),
        ...style,
      }}
      className={cn('relative rounded-full bg-muted', className)}>
      {children}
    </div>
  )
}

function Range({ style, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { min, max, values, orientation } = useSliderContext()

  const startValue = values.length > 1 ? Math.min(...values) : min
  const endValue = values.length > 1 ? Math.max(...values) : (values[0] ?? 0)

  return (
    <div
      className={cn('absolute rounded-full bg-foreground', className)}
      style={{
        ...(orientation === 'horizontal'
          ? {
              left: `${((startValue - min) / (max - min)) * 100}%`,
              width: `${((endValue - startValue) / (max - min)) * 100}%`,
              height: '100%',
            }
          : {
              bottom: `${((startValue - min) / (max - min)) * 100}%`,
              height: `${((endValue - startValue) / (max - min)) * 100}%`,
              width: '100%',
            }),
        ...style,
      }}
      {...props}
    />
  )
}

function Thumb({ index, style, className }: React.HTMLProps<HTMLDivElement> & { index: number }) {
  const { min, max, values, orientation, setValueAt, trackRef, positionToValue } = useSliderContext()

  const val = values[index] as number

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    const track = trackRef.current
    if (!track) return

    const move = (ev: PointerEvent) => {
      const rect = track.getBoundingClientRect()
      const newVal = positionToValue(orientation === 'horizontal' ? ev.clientX : ev.clientY, rect)
      setValueAt(index, newVal)
    }

    const up = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }

    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let delta = 0
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = 1
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -1
        break
      case 'PageUp':
        delta = 10
        break
      case 'PageDown':
        delta = -10
        break
      case 'Home':
        setValueAt(index, min)
        return
      case 'End':
        setValueAt(index, max)
        return
    }
    if (delta !== 0) {
      e.preventDefault()
      setValueAt(index, val + delta)
    }
  }

  return (
    <button
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={val}
      aria-orientation={orientation}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={cn('absolute size-0 cursor-grab rounded-full border-3 border-foreground bg-background', className)}
      style={{
        transform: 'translate(-50%, -50%)',
        ...(orientation === 'horizontal'
          ? {
              left: `${((val - min) / (max - min)) * 100}%`,
              top: '50%',
            }
          : {
              bottom: `${((val - min) / (max - min)) * 100}%`,
              left: '50%',
            }),
        ...style,
      }}
    />
  )
}

export { Root, Range, Track, Thumb, SliderContext, useSliderContext }
export default { Root, Range, Track, Thumb, SliderContext, useSliderContext }
