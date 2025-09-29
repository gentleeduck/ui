import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  alwaysVisible?: boolean
  viewportClassName?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
}

const ScrollArea = ({
  children,
  className,
  viewportClassName,
  alwaysVisible = false,
  orientation = 'vertical',
  style,
  ...props
}: ScrollAreaProps) => {
  const V_THICKNESS = 4
  const H_THICKNESS = 4
  const containerRef = React.useRef<HTMLDivElement>(null)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const vThumbRef = React.useRef<HTMLDivElement>(null)
  const hThumbRef = React.useRef<HTMLDivElement>(null)
  const vTrackRef = React.useRef<HTMLDivElement>(null)
  const hTrackRef = React.useRef<HTMLDivElement>(null)

  const updateThumbs = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    // Vertical
    if (orientation === 'vertical' || orientation === 'both') {
      const thumb = vThumbRef.current as HTMLDivElement
      const track = vTrackRef.current as HTMLDivElement
      const scrollSize = viewport.scrollHeight
      const clientSize = viewport.clientHeight
      const scrollOffset = viewport.scrollTop
      const ratio = clientSize / scrollSize
      const thumbSize = Math.max(ratio * clientSize, 24)
      const maxThumbOffset = track.clientHeight - thumbSize
      const offset = maxThumbOffset === 0 ? 0 : (scrollOffset / (scrollSize - clientSize)) * maxThumbOffset
      thumb.style.height = `${thumbSize}px`
      thumb.style.transform = `translateY(${offset}px)`
      thumb.style.opacity = ratio < 1 || alwaysVisible ? '1' : '0'
      track.style.opacity = ratio < 1 || alwaysVisible ? '1' : '0'
    }
    // Horizontal
    if (orientation === 'horizontal' || orientation === 'both') {
      const thumb = hThumbRef.current as HTMLDivElement
      const track = hTrackRef.current as HTMLDivElement
      const scrollSize = viewport.scrollWidth
      const clientSize = viewport.clientWidth
      const scrollOffset = viewport.scrollLeft
      const ratio = clientSize / scrollSize
      const thumbSize = Math.max(ratio * clientSize, 24)
      const maxThumbOffset = track.clientWidth - thumbSize
      const offset = maxThumbOffset === 0 ? 0 : (scrollOffset / (scrollSize - clientSize)) * maxThumbOffset
      thumb.style.width = `${thumbSize}px`
      thumb.style.transform = `translateX(${offset}px)`
      thumb.style.opacity = ratio < 1 || alwaysVisible ? '1' : '0'
      track.style.opacity = ratio < 1 || alwaysVisible ? '1' : '0'
    }
  }

  const startDrag = (isVertical: boolean, clientPos: number) => {
    const viewport = viewportRef.current as HTMLDivElement
    const thumb = isVertical ? (vThumbRef.current as HTMLDivElement) : (hThumbRef.current as HTMLDivElement)
    const track = isVertical ? (vTrackRef.current as HTMLDivElement) : (hTrackRef.current as HTMLDivElement)
    const thumbSize = isVertical ? thumb.offsetHeight : thumb.offsetWidth
    const trackSize = isVertical ? track.offsetHeight : track.offsetWidth
    const maxThumbOffset = trackSize - thumbSize
    const scrollRange = isVertical
      ? viewport.scrollHeight - viewport.clientHeight
      : viewport.scrollWidth - viewport.clientWidth
    const initialOffset = parseFloat(thumb.style.transform.match(/-?\d+\.?\d*/)?.[0] || '0')

    const onMouseMove = (e: MouseEvent) => {
      const delta = (isVertical ? e.clientY : e.clientX) - clientPos
      const thumbOffset = Math.min(Math.max(initialOffset + delta, 0), maxThumbOffset)
      const scrollOffset = (thumbOffset / maxThumbOffset) * scrollRange
      if (isVertical) viewport.scrollTop = scrollOffset
      else viewport.scrollLeft = scrollOffset
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onDragThumb = (e: React.MouseEvent<HTMLDivElement>, isVertical: boolean) => {
    e.preventDefault()
    startDrag(isVertical, isVertical ? e.clientY : e.clientX)
  }

  const onClickTrack = (e: React.MouseEvent<HTMLDivElement>, isVertical: boolean) => {
    const viewport = viewportRef.current as HTMLDivElement
    const thumb = isVertical ? (vThumbRef.current as HTMLDivElement) : (hThumbRef.current as HTMLDivElement)
    const track = isVertical ? (vTrackRef.current as HTMLDivElement) : (hTrackRef.current as HTMLDivElement)
    if (e.target === thumb) return
    const rect = track.getBoundingClientRect()
    const clickPos = isVertical ? e.clientY - rect.top : e.clientX - rect.left
    const thumbSize = isVertical ? thumb.offsetHeight : thumb.offsetWidth
    const maxThumbOffset = (isVertical ? track.offsetHeight : track.offsetWidth) - thumbSize
    const newThumbOffset = Math.min(Math.max(clickPos - thumbSize / 2, 0), maxThumbOffset)
    const scrollRange = isVertical
      ? viewport.scrollHeight - viewport.clientHeight
      : viewport.scrollWidth - viewport.clientWidth
    const scrollOffset = (newThumbOffset / maxThumbOffset) * scrollRange
    if (isVertical) viewport.scrollTop = scrollOffset
    else viewport.scrollLeft = scrollOffset
  }

  React.useEffect(() => {
    const viewport = viewportRef.current as HTMLDivElement
    updateThumbs()
    viewport.addEventListener('scroll', updateThumbs)
    const obs = new ResizeObserver(updateThumbs)
    obs.observe(viewport)
    return () => {
      viewport.removeEventListener('scroll', updateThumbs)
      obs.disconnect()
    }
  }, [orientation])

  // Styles
  const isV = orientation === 'vertical' || orientation === 'both'
  const isH = orientation === 'horizontal' || orientation === 'both'
  const vTrackStyle: React.CSSProperties = { height: '100%', right: 0, top: 0, width: V_THICKNESS }
  const hTrackStyle: React.CSSProperties = { bottom: 0, height: H_THICKNESS, left: 0, width: '100%' }
  const paddingStyle: React.CSSProperties = {
    paddingBottom: isH ? H_THICKNESS : 0,
    paddingRight: isV ? V_THICKNESS : 0,
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      ref={containerRef}
      style={style}
      {...props}
      data-orientation={orientation}
      data-scrollbar-visible={isV || isH}
      data-slot="scroll-area">
      <div
        className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)}
        ref={viewportRef}
        style={paddingStyle}>
        {children}
      </div>

      {isV && (
        <div
          aria-hidden="true"
          className="absolute bg-transparent opacity-0 hover:opacity-100"
          data-slot="scroll-area-track"
          onMouseDown={(e) => onClickTrack(e, true)}
          ref={vTrackRef}
          style={vTrackStyle}>
          <div
            aria-hidden="true"
            className="absolute right-0 w-full rounded-full bg-secondary hover:bg-secondary"
            onMouseDown={(e) => onDragThumb(e, true)}
            ref={vThumbRef}
          />
        </div>
      )}

      {isH && (
        <div
          aria-hidden="true"
          className="absolute bg-transparent opacity-0 hover:opacity-100"
          data-slot="scroll-area-track"
          onMouseDown={(e) => onClickTrack(e, false)}
          ref={hTrackRef}
          style={hTrackStyle}>
          <div
            aria-hidden="true"
            className="absolute bottom-0 h-full rounded-full bg-secondary hover:bg-secondary"
            onMouseDown={(e) => onDragThumb(e, false)}
            ref={hThumbRef}
          />
        </div>
      )}
    </div>
  )
}

export { ScrollArea }
