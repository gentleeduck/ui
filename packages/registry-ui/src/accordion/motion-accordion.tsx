'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { heightAuto } from '@gentleduck/motion/presets/height-auto'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { duckMotionDuration, tweenExpand } from '@gentleduck/motion/transitions/tweens'
import * as AccordionPrimitive from '@gentleduck/primitives/accordion'
import { ChevronDown } from 'lucide-react'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import type { IAccordionProps } from './accordion'
import { Accordion, AccordionRenderOnceContext } from './accordion'

const MotionAccordionItem = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, 'asChild'> & { index?: number }
>(({ className, children, index = 0, ...props }, ref) => {
  const presetOptions = React.useMemo(() => ({ transition: springBouncy, delay: index * 0.05 }), [index])
  const content = useMotionPreset(scaleIn, presetOptions)

  return (
    <LazyMotion features={loadDomAnimation}>
      <AccordionPrimitive.Item asChild {...props}>
        <m.div
          ref={ref}
          className={cn('group overflow-hidden border-border border-b', className)}
          initial={content.initial}
          animate={content.animate}
          transition={content.transition}>
          {children}
        </m.div>
      </AccordionPrimitive.Item>
    </LazyMotion>
  )
})
MotionAccordionItem.displayName = 'MotionAccordionItem'

const MotionAccordion = React.forwardRef<HTMLDivElement, IAccordionProps>(({ children, ...props }, ref) => {
  let index = 0
  const injectIndex = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child) && child.type === MotionAccordionItem) {
      return React.cloneElement(child as React.ReactElement<{ index?: number }>, {
        index: index++,
      })
    }

    return child
  }

  return (
    <Accordion ref={ref} {...props}>
      {React.Children.map(children, injectIndex)}
    </Accordion>
  )
})
MotionAccordion.displayName = 'MotionAccordion'

const MotionAccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>, 'asChild'> & {
    icon?: React.ReactNode
  }
>(({ className, children, icon, ...props }, ref) => {
  const { open } = AccordionPrimitive.useAccordionItemContext('MotionAccordionTrigger', undefined)
  const content = useMotionPreset(scaleIn, { transition: springBouncy })

  return (
    <LazyMotion features={loadDomAnimation}>
      <AccordionPrimitive.Trigger asChild {...props}>
        <m.button
          ref={ref}
          className={cn(
            'flex w-full cursor-pointer select-none items-center justify-between py-4 font-sans font-medium not-italic text-base ring-offset-background transition-all hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className,
          )}>
          <m.span
            initial={content.initial}
            animate={content.animate}
            transition={content.transition}
            className="flex-1 text-left">
            {children}
          </m.span>
          <m.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={tweenExpand}
            className="ml-2 [&>svg]:size-4 [&>svg]:shrink-0"
            data-slot="accordion-icon">
            {icon ? icon : <ChevronDown aria-hidden="true" />}
          </m.span>
        </m.button>
      </AccordionPrimitive.Trigger>
    </LazyMotion>
  )
})
MotionAccordionTrigger.displayName = 'MotionAccordionTrigger'

const MotionAccordionContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>, 'asChild' | 'forceMount'>
>(({ className, children, ...props }, ref) => {
  const renderOnce = React.useContext(AccordionRenderOnceContext)
  const { open } = AccordionPrimitive.useAccordionItemContext('MotionAccordionContent', undefined)
  const [hasOpened, setHasOpened] = React.useState(open)

  React.useEffect(() => {
    if (open) setHasOpened(true)
  }, [open])

  if (renderOnce && !hasOpened) return null

  return (
    <LazyMotion features={loadDomAnimation}>
      <AccordionPrimitive.Content forceMount asChild inert={!open || undefined} {...props}>
        <m.div
          ref={ref}
          animate={open ? heightAuto.open : heightAuto.closed}
          initial={open ? heightAuto.open : heightAuto.closed}
          transition={{
            height: tweenExpand,
            opacity: { duration: duckMotionDuration.normal, delay: open ? 0.05 : 0 },
            filter: { duration: duckMotionDuration.normal, delay: open ? 0.05 : 0 },
          }}
          style={{ overflow: 'hidden' }}>
          <div className={cn('pt-0 pb-4 font-sans not-italic text-base', className)}>{children}</div>
        </m.div>
      </AccordionPrimitive.Content>
    </LazyMotion>
  )
})
MotionAccordionContent.displayName = 'MotionAccordionContent'

export { MotionAccordion, MotionAccordionContent, MotionAccordionItem, MotionAccordionTrigger }
