'use client'

import { cn } from '@gentleduck/libs/cn'
import * as SliderPrimitive from '@gentleduck/primitives/slider'
import type * as React from 'react'

function Slider({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      data-slot="slider"
      ref={ref}
      {...props}>
      <SliderPrimitive.Track
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
        data-slot="track">
        <SliderPrimitive.Range className="absolute h-full bg-primary" data-slot="range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        data-slot="thumb"
        index={0}
      />
    </SliderPrimitive.Root>
  )
}
function SliderRange({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      data-slot="slider-range"
      ref={ref}
      {...props}>
      <SliderPrimitive.Track
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
        data-slot="track-range">
        <SliderPrimitive.Range className="absolute h-full bg-primary" data-slot="range-range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block size-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        data-slot="thumb-range"
        index={0}
      />
      <SliderPrimitive.Thumb
        className="block size-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        data-slot="thumb-range"
        index={1}
      />
    </SliderPrimitive.Root>
  )
}

export { Slider, SliderRange }
