'use client'
import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import {
  contentTransition,
  contentTransitionFast,
  fadeBlurPopOut,
  spinIn,
  tapScale,
} from '@gentleduck/motion/presets/content'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { Slot, Slottable } from '@gentleduck/primitives/slot'
import { Loader } from 'lucide-react'
import { AnimatePresence, LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { buttonVariants } from './button.constants'
import type { AnimationIconProps, ButtonProps } from './button.types'

/**
 * Renders a customizable button component, supporting various styles and behaviors.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      border = 'default',
      asChild,
      className,
      loading,
      isCollapsed,
      icon,
      secondIcon,
      type = 'button',
      disabled,
      ...props
    },
    ref,
  ) => {
    const Component = (asChild ? Slot : 'button') as React.ElementType

    return (
      <Component
        data-slot="button"
        {...props}
        aria-busy={loading ? true : undefined}
        className={cn(
          buttonVariants({
            border,
            className,
            size: isCollapsed ? 'icon' : size,
            variant,
          }),
        )}
        disabled={Boolean(loading) || disabled}
        ref={ref}
        type={type}>
        {loading ? <Loader aria-hidden="true" className="animate-spin" /> : icon}
        <Slottable>{!isCollapsed && children}</Slottable>
        {!isCollapsed && secondIcon && secondIcon}
      </Component>
    )
  },
)
Button.displayName = 'Button'

/**
 * Renders an animation icon component.
 */
function AnimationIcon({ children, animationIcon }: AnimationIconProps): React.JSX.Element {
  return (
    <>
      {animationIcon?.icon && animationIcon.iconPlacement === 'left' && (
        <div className="w-0 pe-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pe-2 group-hover:opacity-100 ltr:translate-x-[-1.3em] ltr:group-hover:-translate-x-1 rtl:translate-x-[1.3em] rtl:group-hover:translate-x-1">
          {animationIcon?.icon}
        </div>
      )}
      {children}
      {animationIcon?.icon && animationIcon.iconPlacement === 'right' && (
        <div className="w-0 ps-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:ps-2 group-hover:opacity-100 ltr:translate-x-[1.3em] rtl:translate-x-[-1.3em]">
          {animationIcon?.icon}
        </div>
      )}
    </>
  )
}
AnimationIcon.displayName = 'AnimationIcon'

/* ------------------------------------------------------------------ */
/*  MotionButton                                                       */
/* ------------------------------------------------------------------ */

const MOTION_BUTTON_OPTIONS = { transition: springBouncy } as const

const MotionButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'asChild' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      border = 'default',
      className,
      loading,
      isCollapsed,
      icon,
      secondIcon,
      type = 'button',
      disabled,
      ...props
    },
    ref,
  ) => {
    const content = useMotionPreset('scaleIn', MOTION_BUTTON_OPTIONS)
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.button
          data-slot="button"
          initial={content.initial}
          animate={content.animate}
          whileTap={tapScale}
          transition={content.transition}
          {...props}
          aria-busy={loading ? true : undefined}
          className={cn(
            buttonVariants({ border, className, size: isCollapsed ? 'icon' : size, variant }),
            'overflow-hidden',
          )}
          disabled={Boolean(loading) || disabled}
          ref={ref}
          type={type as 'button' | 'submit' | 'reset'}>
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <m.span key="loader" {...spinIn} transition={contentTransition} className="inline-flex">
                <Loader aria-hidden="true" className="animate-spin" />
              </m.span>
            ) : icon ? (
              <m.span key="icon" {...spinIn} transition={contentTransition} className="inline-flex">
                {icon}
              </m.span>
            ) : null}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {!isCollapsed && (
              <m.span
                key="text"
                {...fadeBlurPopOut}
                transition={contentTransitionFast}
                className={cn(
                  'inline-flex flex-1 origin-left items-center gap-2',
                  // Single child: center it (default button behavior). Multiple
                  // children: spread them via justify-between so e.g. combobox
                  // triggers can have "label ... icon".
                  React.Children.count(children) > 1 ? 'justify-between' : 'justify-center',
                )}>
                {children}
              </m.span>
            )}
            {!isCollapsed && secondIcon && (
              <m.span
                key="second-icon"
                {...fadeBlurPopOut}
                transition={contentTransitionFast}
                className="inline-flex origin-left">
                {secondIcon}
              </m.span>
            )}
          </AnimatePresence>
        </m.button>
      </LazyMotion>
    )
  },
)
MotionButton.displayName = 'MotionButton'

export { AnimationIcon, Button, MotionButton }
