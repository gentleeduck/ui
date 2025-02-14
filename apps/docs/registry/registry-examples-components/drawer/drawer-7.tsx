'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/registry-ui-components/drawer'
import { Button } from '@/registry/registry-ui-components/button'
import { Badge } from '@/registry/registry-ui-components/badge'
import { cn } from '@/lib'
import { AnimatePresence } from 'motion/react'

export default function DrawerDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <Drawer
      fixed={true}
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent
        className="max-w-xs mx-auto after:hidden mb-8 rounded-xl"
        overlay={{ className: 'bg-zinc-900/50 backdrop-blur-xs' }}
      >
        <div className="mx-auto w-full max-w-sm pt-2 overflow-hidden grid">
          <div className={cn('one', open && 'one2')}>
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-md">Almost there.</DrawerTitle>
              <Badge
                variant="destructive"
                size={'sm'}
                className="rounded-md"
              >
                30%
              </Badge>
            </div>
            <DrawerDescription className="">
              Complete the remaining steps in the checklist before going live.
            </DrawerDescription>
            <div
              className="flex gap-1"
              style={{
                background: 'linear-gradient(to right, red, green)', // Gradient applied to the parent
                WebkitMaskImage: 'linear-gradient(to right, black, black)', // Ensures children inherit the gradient effect
                maskImage: 'linear-gradient(to right, black, black)',
              }}
            >
              {[...Array(30)].map((_, index) => (
                <div
                  key={index}
                  className="h-[15px] w-[3px] rounded-full bg-white"
                ></div>
              ))}
            </div>
          </div>
          <div className={cn('two', open && 'two2')}>
            <div className="flex flex-col items-center justify-between">
              <DrawerTitle className="text-md text-start">Hi duck, how are you?</DrawerTitle>
              <DrawerDescription className="text-start">this is your checklist</DrawerDescription>
            </div>
            <div className="overflow-hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-zinc-100" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-zinc-900">
                        <span className="absolute inset-0" />
                        Step {index + 1}
                      </div>
                      <p className="text-sm text-zinc-700">well</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DrawerFooter>
            <Button
              variant={'secondary'}
              onClick={() => setOpen(!open)}
            >
              Go to checklist
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
