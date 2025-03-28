'use client'

import * as React from 'react'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@gentelduck/libs/cn'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  delayDuration?: number
  sideOffset?: number
  position?: TooltipPosition
  className?: string
  disabled?: boolean
  showArrow?: boolean
  autoPosition?: boolean
  contentMargin?: number | { top?: number; right?: number; bottom?: number; left?: number }
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delayDuration = 200,
  sideOffset = 8,
  position = 'top',
  className,
  disabled = false,
  showArrow = true,
  autoPosition = true,
  contentMargin = 0,
}) => {
  const [computedPosition, setComputedPosition] = useState<TooltipPosition>(position)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 11)}`).current
  const dimensions = useRef({ width: 0, height: 0 })
  const [, forceUpdate] = useState({})
  // Add refs to track current position and isHovering state
  const currentPositionRef = useRef<TooltipPosition>(position)
  const isHoveringRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update dimensions handler
  const updateDimensions = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        dimensions.current = {
          width: rect.width,
          height: rect.height
        }
        forceUpdate({})
      }
    }
  }, [])

  // Calculate the optimal position based on available space
  const calculateOptimalPosition = useCallback(() => {
    // Skip calculations if tooltip isn't being hovered
    if (!isHoveringRef.current || !triggerRef.current || !tooltipRef.current || !autoPosition) {
      if (currentPositionRef.current !== position) {
        currentPositionRef.current = position;
        setComputedPosition(position);
      }
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Add a small buffer for better appearance
    const buffer = 8

    // Check space in each direction
    const space = {
      top: triggerRect.top - tooltipRect.height - sideOffset - buffer,
      bottom: viewportHeight - triggerRect.bottom - tooltipRect.height - sideOffset - buffer,
      left: triggerRect.left - tooltipRect.width - sideOffset - buffer,
      right: viewportWidth - triggerRect.right - tooltipRect.width - sideOffset - buffer,
    }

    // If the preferred position has enough space, use it
    if (space[position] >= 0) {
      if (position !== currentPositionRef.current) {
        currentPositionRef.current = position;
        setComputedPosition(position);
      }
      return;
    }

    // Find alternative positions in order of preference
    const opposites: Record<TooltipPosition, TooltipPosition> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }

    const opposite = opposites[position]
    if (space[opposite] >= 0) {
      if (opposite !== currentPositionRef.current) {
        currentPositionRef.current = opposite;
        setComputedPosition(opposite);
      }
      return;
    }

    // Then try horizontal/vertical alternatives
    const alternatives = position === 'top' || position === 'bottom'
      ? ['left', 'right'] as TooltipPosition[]
      : ['top', 'bottom'] as TooltipPosition[]
    
    for (const alt of alternatives) {
      if (space[alt] >= 0) {
        if (alt !== currentPositionRef.current) {
          currentPositionRef.current = alt;
          setComputedPosition(alt);
        }
        return;
      }
    }

    // If no good options, use the position with the most space
    const bestPosition = Object.entries(space).reduce(
      (best, [pos, spaceAvailable]) => 
        spaceAvailable > best.space ? { position: pos as TooltipPosition, space: spaceAvailable } : best,
      { position: position, space: -Infinity }
    )

    // Only update state if position has changed
    if (bestPosition.position !== currentPositionRef.current) {
      currentPositionRef.current = bestPosition.position;
      setComputedPosition(bestPosition.position);
    }
  }, [position, sideOffset, autoPosition])

  // Throttle function to limit how often a function can run
  const throttle = useCallback((callback: Function, limit: number) => {
    let inThrottle = false;
    return function(...args: any[]) {
      if (!inThrottle) {
        callback(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Setup resize observer and viewport position calculation
  useEffect(() => {
    updateDimensions()

    if (triggerRef.current) {
      setTimeout(updateDimensions, 10)
    }

    // Setup resize observer
    const observer = new ResizeObserver(() => {
      updateDimensions()
      if (isHoveringRef.current) {
        calculateOptimalPosition()
      }
    })

    if (triggerRef.current) {
      observer.observe(triggerRef.current)
    }

    // Initial position calculation
    calculateOptimalPosition()

    // Create throttled handler for scroll events (runs at most once every 100ms)
    const throttledHandleViewportChange = throttle(() => {
      if (isHoveringRef.current) {
        calculateOptimalPosition()
      }
    }, 100)

    window.addEventListener('scroll', throttledHandleViewportChange, { passive: true })
    window.addEventListener('resize', throttledHandleViewportChange, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', throttledHandleViewportChange)
      window.removeEventListener('resize', throttledHandleViewportChange)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [updateDimensions, calculateOptimalPosition, throttle])

  // Memoize position styles calculation
  const positionStyles = useMemo(() => {
    const triggerWidth = dimensions.current.width || 100
    const triggerHeight = dimensions.current.height || 40
    
    switch (computedPosition) {
      case 'top':
        return {
          bottom: `calc(100% + ${sideOffset}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center',
          width: 'max-content',
          maxWidth: `calc(2 * ${Math.max(triggerWidth, 100)}px)`,
        }
      case 'bottom':
        return {
          top: `calc(100% + ${sideOffset}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center',
          width: 'max-content',
          maxWidth: `calc(2 * ${Math.max(triggerWidth, 100)}px)`,
        }
      case 'left':
        return {
          right: `calc(100% + ${sideOffset}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          transformOrigin: 'right center',
          width: 'max-content',
          maxHeight: `calc(2 * ${Math.max(triggerHeight, 40)}px)`,
        }
      case 'right':
        return {
          left: `calc(100% + ${sideOffset}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          transformOrigin: 'left center',
          width: 'max-content',
          maxHeight: `calc(2 * ${Math.max(triggerHeight, 40)}px)`,
        }
    }
  }, [computedPosition, sideOffset])

  // Process content margin into a style object
  const contentMarginStyle = useMemo(() => {
    if (typeof contentMargin === 'number') {
      return { margin: `${contentMargin}px` };
    } else if (contentMargin) {
      return {
        marginTop: contentMargin.top !== undefined ? `${contentMargin.top}px` : undefined,
        marginRight: contentMargin.right !== undefined ? `${contentMargin.right}px` : undefined,
        marginBottom: contentMargin.bottom !== undefined ? `${contentMargin.bottom}px` : undefined,
        marginLeft: contentMargin.left !== undefined ? `${contentMargin.left}px` : undefined,
      };
    }
    return {};
  }, [contentMargin]);

  // Get animation classes based on position
  const getAnimationClasses = () => {
    switch (computedPosition) {
      case 'top':
        return 'data-side-top'
      case 'bottom':
        return 'data-side-bottom'
      case 'left':
        return 'data-side-left'
      case 'right':
        return 'data-side-right'
      default:
        return ''
    }
  }

  // Render arrow
  const arrowElement = useMemo(() => {
    if (!showArrow) return null
    
    const arrowStyles: React.CSSProperties = {}
    let arrowClassName = 'absolute w-2 h-2 bg-popover rotate-45 border'

    switch (computedPosition) {
      case 'top':
        arrowStyles.bottom = '-4px'
        arrowStyles.left = '50%'
        arrowStyles.marginLeft = '-4px'
        arrowStyles.borderRight = '1px solid'
        arrowStyles.borderBottom = '1px solid'
        arrowStyles.borderColor = 'inherit'
        break
      case 'bottom':
        arrowStyles.top = '-4px'
        arrowStyles.left = '50%'
        arrowStyles.marginLeft = '-4px'
        arrowStyles.borderLeft = '1px solid'
        arrowStyles.borderTop = '1px solid'
        arrowStyles.borderColor = 'inherit'
        break
      case 'left':
        arrowStyles.right = '-4px'
        arrowStyles.top = '50%'
        arrowStyles.marginTop = '-4px'
        arrowStyles.borderTop = '1px solid'
        arrowStyles.borderRight = '1px solid'
        arrowStyles.borderColor = 'inherit'
        break
      case 'right':
        arrowStyles.left = '-4px'
        arrowStyles.top = '50%'
        arrowStyles.marginTop = '-4px'
        arrowStyles.borderBottom = '1px solid'
        arrowStyles.borderLeft = '1px solid'
        arrowStyles.borderColor = 'inherit'
        break
    }

    return <span className={arrowClassName} style={arrowStyles} />
  }, [computedPosition, showArrow])

  // CSS only hovering approach
  return (
    <div 
      ref={wrapperRef}
      className={cn(
        "group/tooltip relative inline-block",
        disabled && "tooltip-disabled"
      )}
      style={{ 
        // Add custom CSS variable for delay
        "--tooltip-delay": `${delayDuration}ms`
      } as React.CSSProperties}
      onMouseEnter={() => { isHoveringRef.current = true; calculateOptimalPosition(); }}
      onMouseLeave={() => { isHoveringRef.current = false; }}
      onFocus={() => { isHoveringRef.current = true; calculateOptimalPosition(); }}
      onBlur={() => { isHoveringRef.current = false; }}
    >
      <div ref={triggerRef} aria-describedby={tooltipId}>
        {children}
      </div>
      
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={cn(
          'z-50 absolute rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md text-center',
          'opacity-0 scale-95 pointer-events-none',
          'transition-all duration-200',
          getAnimationClasses(),
          
          // Position-based animations - initial states
          computedPosition === 'top' && '-translate-y-1',
          computedPosition === 'bottom' && 'translate-y-1',
          computedPosition === 'left' && '-translate-x-1',
          computedPosition === 'right' && 'translate-x-1',
          
          // Show on hover/focus with transition delay
          'group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 group-hover/tooltip:translate-y-0 group-hover/tooltip:scale-100',
          'group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:translate-x-0 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:scale-100',
          
          // Add delay on appearance
          'group-hover/tooltip:transition-delay-[var(--tooltip-delay)]',
          'group-focus-within/tooltip:transition-delay-[var(--tooltip-delay)]',
          
          disabled && 'hidden',
          className
        )}
        style={{...positionStyles, ...contentMarginStyle}}
        data-side={computedPosition}
      >
        {content}
        {arrowElement}
      </div>
    </div>
  )
}

// For backward compatibility with Radix UI API (optimized)
const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const TooltipRoot: React.FC<TooltipProps> = React.memo((props) => {
  return <Tooltip {...props} />
})

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const TooltipTrigger = React.memo(
  React.forwardRef<HTMLElement, TooltipTriggerProps>(
    ({ children }, _ref) => {
      return <>{children}</>
    }
  )
)

TooltipTrigger.displayName = 'TooltipTrigger'

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
  contentMargin?: number | { top?: number; right?: number; bottom?: number; left?: number }
  children: React.ReactNode
}

const TooltipContent = React.memo(
  React.forwardRef<HTMLDivElement, TooltipContentProps>(
    ({ children, className, contentMargin, ...props }, ref) => {
      // Process content margin into a style object
      const contentMarginStyle = useMemo(() => {
        if (typeof contentMargin === 'number') {
          return { margin: `${contentMargin}px` };
        } else if (contentMargin) {
          return {
            marginTop: contentMargin.top !== undefined ? `${contentMargin.top}px` : undefined,
            marginRight: contentMargin.right !== undefined ? `${contentMargin.right}px` : undefined,
            marginBottom: contentMargin.bottom !== undefined ? `${contentMargin.bottom}px` : undefined,
            marginLeft: contentMargin.left !== undefined ? `${contentMargin.left}px` : undefined,
          };
        }
        return {};
      }, [contentMargin]);

      return (
        <div 
          ref={ref} 
          className={cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            className
          )}
          style={contentMarginStyle}
          {...props}
        >
          {children}
        </div>
      )
    }
  )
)

TooltipContent.displayName = 'TooltipContent'

// Memoize the Tooltip component
const MemoizedTooltip = React.memo(Tooltip);

// Export all components with proper syntax
export { 
  MemoizedTooltip as Tooltip,
  TooltipRoot as Root,
  TooltipTrigger as Trigger,
  TooltipContent as Content,
  TooltipProvider as Provider
} 