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
      }, 50)
      return () => clearInterval(timer)
    }
  }, [progress, autoIncrement])

  const getBarColor = (index: number) => {
    const progress = (index / barCount) * 100
    if (progress <= 15) return 'bg-red-500'
    if (progress <= 40) return 'bg-orange-500'
    if (progress <= 65) return 'bg-yellow-500'
    if (progress <= 90) return 'bg-lime-500'
    return 'bg-green-500'
  }
  // Calculate badge color based on progress
  const getBadgeColor = (progress: number) => {
    if (progress <= 15) return 'bg-red-500'
    if (progress <= 40) return 'bg-orange-500'
    if (progress <= 65) return 'bg-yellow-500'
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
          <DuckTransition1 className={cn(open && 'one2')}>
            <HI
              barCount={barCount}
              filledBars={filledBars}
              progress={progress}
              getBadgeColor={getBadgeColor}
              getBarColor={getBarColor}
              setOpen={setOpen}
              setProgress={setProgress}
            />
          </DuckTransition1>
          <DuckTransition2 className={cn(open && 'two2')}>
            <HI2 />
          </DuckTransition2>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function DuckTransition1({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('one', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function DuckTransition2({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('two', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function HI(props: {
  progress: number
  filledBars: number
  barCount: number
  getBadgeColor: (progress: number) => string
  getBarColor: (index: number) => string
  setProgress: React.Dispatch<React.SetStateAction<number>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { progress, getBadgeColor, barCount, filledBars, getBarColor, setOpen, setProgress } = props

  return (
    <>
      <div className="flex items-center justify-between">
        <DrawerTitle className="text-md">Almost there.</DrawerTitle>
        <Badge
          variant="destructive"
          className={`rounded-lg will-change-auto w-[50px] transition-colors duration-300 ${getBadgeColor(progress)}`}
        >
          <AnimateNumber
            format={{ style: 'decimal', notation: 'standard' }}
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

      <Button
        variant="secondary"
        onClick={() => {
          setOpen(!open)
        }}
      >
        See checklist
      </Button>

      <DrawerFooter>
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
    </>
  )
}

export function HI2(props: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { setOpen } = props
  return (
    <>
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
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(!open)
        }}
      >
        See checklist
      </Button>
    </>
  )
}
