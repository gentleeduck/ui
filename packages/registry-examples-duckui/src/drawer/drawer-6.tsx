'use client'

import { cn } from '@gentleduck/libs/cn'
import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@gentleduck/registry-ui-duckui/drawer'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { motion } from 'motion/react'
import { AnimateNumber } from 'motion-number'
import * as React from 'react'
import { toast } from 'sonner'

export default function DrawerDemo8() {
  const [open, setOpen] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const barCount = 37
  const filledBars = Math.floor((progress / 100) * barCount)
  const autoIncrement = true

  React.useEffect(() => {
    if (autoIncrement && progress < 100) {
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100))
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
    <Drawer fixed={true} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button className="mt-20" variant="outline">
          Hard Checklist
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto mb-8 max-w-xs overflow-hidden rounded-xl after:hidden">
        <div className={cn('parent mx-auto w-full max-w-sm overflow-hidden p-4 pt-2', open && 'parent2')}>
          <DuckTransition1 className={cn(open && 'one2')}>
            <HI
              barCount={barCount}
              filledBars={filledBars}
              getBadgeColor={getBadgeColor}
              getBarColor={getBarColor}
              progress={progress}
              setOpen={setOpen}
              setProgress={setProgress}
            />
          </DuckTransition1>
          <DuckTransition2 className={cn(open && 'two2')}>
            <HI2 setOpen={setOpen} />
          </DuckTransition2>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export interface DuckTransitionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DuckTransition1({ className, children, ...props }: DuckTransitionProps) {
  return (
    <div
      className={cn(
        // 'ease-[linear(0,_0.001_0.4%,_0.007_0.9%,_0.016_1.4%,_0.028_1.9%,_0.065_3%,_0.114_4.1%,_0.165_5.1%,_0.228_6.2%,_0.504_10.7%,_0.62_12.7%,_0.734_14.9%,_0.827_17%,_0.865_18%,_0.902_19.1%,_0.934_20.2%,_0.963_21.3%,_0.987_22.4%,_1.009_23.6%,_1.026_24.8%,_1.04_26%,_1.051_27.4%,_1.059_28.9%,_1.064_30.5%,_1.064_32.2%,_1.062_34%,_1.056_36.1%,_1.026_44.1%,_1.013_47.9%,_1.004_51.8%,_0.999_55.9%,_0.996_63.9%,_1_83.2%,_1)] p-4 flex flex-col gap-2 bg-background overflow-hidden',
        'one',
        className,
      )}
      {...props}>
      {children}
    </div>
  )
}

export function DuckTransition2({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('two', className)} {...props}>
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
          className={`w-[50px] rounded-lg transition-colors duration-300 will-change-auto ${getBadgeColor(progress)}`}
          variant="destructive">
          <AnimateNumber
            format={{ notation: 'standard', style: 'decimal' }}
            prefix="%"
            // animate={{ backgroundClip: 'text' }}
          >
            {progress}
          </AnimateNumber>
        </Badge>
      </div>
      <DrawerDescription>Complete the remaining steps in the checklist before going live.</DrawerDescription>
      <div className="flex w-full justify-between">
        {[...Array(barCount)].map((_, index) => (
          <motion.div
            animate={{
              height: '1.5rem',
              scale: index < filledBars ? [1, 1.1, 1] : 1,
            }}
            className={`h-[1rem] w-[5px] rounded-full transition-colors duration-300 ${
              index < filledBars ? getBarColor(index) : 'bg-gray-200'
            }`}
            initial={{ height: '1rem' }}
            key={`bar-${index + 1}`}
            transition={{ delay: index * 0.008, duration: 0.5 }}
          />
        ))}
      </div>

      <DrawerFooter className="px-0 pb-0">
        <Button
          onClick={() => {
            console.info('hi, i was clicked!!')
            setOpen((prev) => !prev)
          }}
          variant="secondary">
          See checklist
        </Button>
        <DrawerClose asChild>
          <Button
            className={cn(progress === 100 && 'bg-green-500 text-white hover:bg-green-500/90')}
            disabled={progress < 100}
            loading={progress < 100}
            onClick={() => {
              setProgress(0)
              toast.success('Wow duck you are done!')
            }}
            variant="secondary">
            {progress === 100 ? 'Complete the checklist' : 'Loading to checklist'}
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
          {
            description: 'Outline key milestones and deliverables.',
            title: 'Plan the project',
          },
          {
            description: 'Collect necessary tools, assets, and information.',
            title: 'Gather resources',
          },
          {
            description: 'Begin coding and implementing core features.',
            title: 'Start development',
          },
          {
            description: 'Perform debugging, QA, and performance optimizations.',
            title: 'Testing phase',
          },
          {
            description: 'Deploy the project and gather feedback for improvements.',
            title: 'Launch & review',
          },
        ].map((task, index) => (
          <li className="flex items-start gap-3" key={`todo-${index + 1}`}>
            <input className="mt-1 h-4 w-4 accent-green-500" id={`todo-${index}`} type="checkbox" />
            <div>
              <label className="block font-semibold text-md" htmlFor={`todo-${index}`}>
                {task.title}
              </label>
              <p className="text-muted-foreground text-sm">{task.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          setOpen(!open)
        }}
        variant="secondary">
        See checklist
      </Button>
    </>
  )
}
