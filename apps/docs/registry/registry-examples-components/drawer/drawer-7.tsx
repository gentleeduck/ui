'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/registry-ui-components/drawer'
import { Button } from '@/registry/registry-ui-components/button'
import { Badge } from '@/registry/registry-ui-components/badge'
import { cn } from '@/lib'
import { AnimatePresence, motion } from 'motion/react'
import { AnimateNumber } from 'motion-number'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/registry-ui-components/accordion'
import { toast } from 'sonner'
import { Separator } from '@/registry/default/ui'

export default function DrawerDemo() {
  const [open, setOpen] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [count, setCount] = React.useState(30)
  const barCount = 37
  const filledBars = Math.floor((progress / 100) * barCount)
  const autoIncrement = true

  React.useEffect(() => {
    if (autoIncrement && progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 100))
      }, 105)
      return () => clearInterval(timer)
    }
  }, [progress, autoIncrement])

  const getBarColor = (index: number) => {
    const progress = (index / barCount) * 100
    if (progress <= 20) return 'bg-red-500'
    if (progress <= 60) return 'bg-orange-500'
    if (progress <= 80) return 'bg-yellow-500'
    if (progress <= 95) return 'bg-lime-500'
    return 'bg-green-500'
  }
  // Calculate badge color based on progress
  const getBadgeColor = (progress: number) => {
    if (progress <= 20) return 'bg-red-500'
    if (progress <= 60) return 'bg-orange-500'
    if (progress <= 80) return 'bg-yellow-500'
    if (progress <= 95) return 'bg-lime-500'
    return 'bg-green-500'
  }

  return (
    <Drawer
      fixed={true}
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="mt-20"
        >
          Hard Checklist
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xs mx-auto after:hidden mb-8 rounded-xl">
        <div className={cn('mx-auto w-full max-w-sm pt-2 overflow-hidden parent', open && 'parent2')}>
          <div
            className={cn(
              'grid gap-2 p-4 pb-0 bg-[hsl(var(--background))] transition-all duration-[550ms] h-[calc(var(--max-height)_/2)] overflow-hidden will-change-[transform,opacity,grid] ease-[var(--duck-spring)]',
              open &&
                'pt-0 pb-0 overflow-hidden opacity-0 h-[var(--min-height)] transform translate-y-[-5rem] scale-[0.8] pointer-events-none'
            )}
          >
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-md">Almost there.</DrawerTitle>
              <Badge
                variant="destructive"
                className={`rounded-lg will-change-auto w-[50px] transition-colors duration-300 ${getBadgeColor(progress)}`}
              >
                <AnimateNumber
                  format={{ style: 'decimal' }}
                  prefix="%"
                  // animate={{ backgroundClip: 'text' }}
                >
                  {progress}
                </AnimateNumber>
              </Badge>
            </div>
            <DrawerDescription>Complete the remaining steps in the checklist before going live.</DrawerDescription>
            <div className="flex justify-between w-full">
              {[...Array(barCount)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ height: '1rem' }}
                  animate={{ height: '1.5rem', scale: index < filledBars ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, delay: index * 0.008 }}
                  className={`w-[5px] h-[1rem] rounded-full transition-colors duration-300 ${
                    index < filledBars ? getBarColor(index) : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div
            className={cn(
              'grid gap-2 p-4 pt-0 transition-all duration-[550ms] will-change-[transform,opacity,grid] translate-y-0 overflow-hidden bg-[hsl(var(--background))] opacity-0 h-[var(--min-height)] pointer-events-none ease-[var(--duck-spring)] overflow-y-scroll',
              open &&
                'delay-[50ms] pt-4 pb-4 overflow-auto h-[var(--max-height)] translate-y-0 scale-100 opacity-100 pointer-events-auto'
            )}
          >
            <DrawerTitle className="text-md">Checklist</DrawerTitle>
            <Separator />
            <ul className="flex flex-col gap-3">
              {[
                { title: 'Plan the project', description: 'Outline key milestones and deliverables.' },
                { title: 'Gather resources', description: 'Collect necessary tools, assets, and information.' },
                { title: 'Start development', description: 'Begin coding and implementing core features.' },
                { title: 'Testing phase', description: 'Perform debugging, QA, and performance optimizations.' },
                { title: 'Launch & review', description: 'Deploy the project and gather feedback for improvements.' },
              ].map((task, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 accent-green-500"
                    id={`todo-${index}`}
                  />
                  <div>
                    <label
                      htmlFor={`todo-${index}`}
                      className="text-md font-semibold block"
                    >
                      {task.title}
                    </label>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <DrawerFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setOpen(!open)
              }}
            >
              See checklist
            </Button>
            <DrawerClose asChild>
              <Button
                variant="secondary"
                disabled={progress < 100}
                className={cn(progress === 100 && 'bg-green-500 text-white hover:bg-green-500/90')}
                onClick={() => {
                  setProgress(0)
                  toast.success('Wow duck you are done!')
                }}
              >
                {progress === 100 ? 'Complete the checklist' : 'Go to checklist'}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
