'use client'

import { cn } from '@gentelduck/libs/cn'
import * as React from 'react'
import { Button } from '../button'
import { hoverCardVariants } from './hover-card.constants'
import {
  HoverCardContentProps,
  HoverCardProps,
  HoverCardTriggerProps,
} from './hover-card.types'

function HoverCard({
  delayDuration = 500,
  sideOffset = 4,
  open = false,
  className,
  style,
  size,
  ...props
}: HoverCardProps) {
  return (
    <div
      data-method={open ? 'forced' : 'hover'}
      className={cn('whitespace-nowrap group/hover-card relative', className)}
      style={
        {
          '--hover-card-delay': `${delayDuration}ms`,
          '--side-offset': `${sideOffset}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

function HoverCardTrigger({ onClick, ...props }: HoverCardTriggerProps) {
  return <Button {...props} />
}

const HoverCardContent = ({
  position = 'center',
  variant,
  className,
  showArrow = false,
  ref,
  ...props
}: HoverCardContentProps) => (
  <div
    ref={ref}
    role='hover-card'
    className={cn(hoverCardVariants({ variant, position }), className)}
    data-side={position}
    {...props}
  />
)

export { HoverCard, HoverCardTrigger, HoverCardContent }
