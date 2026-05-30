'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import type { IMotionPreset, IUseMotionPresetOptions } from '@gentleduck/motion/motion-presets'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

/** Props omitted on wrapped element to avoid React/Motion lifecycle overload conflicts. */
export type MotionConflictKeys = 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'

const DEFAULT_INLINE_WRAPPER = 'inline-flex'

export interface IMotionShellProps {
  /** Motion preset object or registered preset name. */
  preset: IMotionPreset
  /** Optional preset transition overrides (delay, transition, direction). */
  options?: IUseMotionPresetOptions
  /** className applied to the motion `<m.div>` wrapper. */
  wrapperClassName?: string
  /** Children rendered inside the animated wrapper. */
  children: React.ReactNode
}

/**
 * Inline-motion wrapper around a non-motion primitive — tiny `<m.div>` inside `LazyMotion`.
 * For motion-as-root patterns use `useMotionContent` directly.
 */
export function MotionShell({
  preset,
  options,
  wrapperClassName = DEFAULT_INLINE_WRAPPER,
  children,
}: IMotionShellProps) {
  const content = useMotionPreset(preset, options)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        className={wrapperClassName}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}>
        {children}
      </m.div>
    </LazyMotion>
  )
}
MotionShell.displayName = 'MotionShell'

/**
 * HOC: wraps `Component` in `MotionShell` with `preset`. Fourth arg accepts a `wrapperClassName`
 * string OR `{ wrapperClassName?, optionsFromProps? }` (per-instance overrides for stagger).
 * Use bespoke `motion-*.tsx` when motion element must be the component root.
 * @example withMotion(Avatar, scaleIn, { transition: springBouncy })
 */
export interface IWithMotionConfig<TProps> {
  wrapperClassName?: string
  optionsFromProps?: (props: TProps) => IUseMotionPresetOptions | undefined
}

export function withMotion<TProps extends object, TRef>(
  Component: React.ForwardRefExoticComponent<TProps & React.RefAttributes<TRef>>,
  preset: IMotionPreset,
  options?: IUseMotionPresetOptions,
  config?: string | IWithMotionConfig<TProps>,
): React.ForwardRefExoticComponent<TProps & React.RefAttributes<TRef>> {
  const displayName = `Motion(${Component.displayName ?? Component.name ?? 'Component'})`
  const wrapperClassName = typeof config === 'string' ? config : config?.wrapperClassName
  const optionsFromProps = typeof config === 'object' ? config?.optionsFromProps : undefined
  const Motionised = React.forwardRef<TRef, TProps>((props, ref) => {
    const dynamic = optionsFromProps?.(props as TProps)
    const mergedOptions = dynamic ? { ...options, ...dynamic } : options
    return (
      <MotionShell preset={preset} options={mergedOptions} wrapperClassName={wrapperClassName}>
        <Component {...(props as TProps)} ref={ref} />
      </MotionShell>
    )
  }) as React.ForwardRefExoticComponent<TProps & React.RefAttributes<TRef>>
  Motionised.displayName = displayName
  return Motionised
}
