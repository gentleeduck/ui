'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { checkerBounce, contentTransition } from '@gentleduck/motion/presets/content'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { checkersStylePattern } from '@gentleduck/motion/variants'
import { useSvgIndicator } from '@gentleduck/primitives/checkers'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Label } from '../label'
import type { CheckboxGroupProps, CheckedState, ICheckboxProps, ICheckboxWithLabelProps } from './checkbox.types'

const Checkbox = React.forwardRef<HTMLInputElement, ICheckboxProps>(
  (
    {
      className,
      indicator,
      checkedIndicator,
      style,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      dir,
      ...props
    },
    ref,
  ) => {
    const direction = useDirection(dir as Direction)
    const { indicatorReady, checkedIndicatorReady, inputStyle, SvgIndicator } = useSvgIndicator({
      checkedIndicator,
      indicator,
    })
    const inputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : defaultChecked

    const handleChange = (next: CheckedState) => {
      onCheckedChange?.(next)
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: changeCheckedState is stable and defined in render scope
    React.useEffect(() => {
      if (ref && typeof ref !== 'function' && checked === 'indeterminate' && ref.current) {
        ref.current.indeterminate = true
        changeCheckedState(checked, ref.current)
      }
      changeCheckedState(checked, inputRef.current as HTMLInputElement)
    }, [checked, ref])

    function changeCheckedState(state: CheckedState, input: HTMLInputElement) {
      if (state === 'indeterminate') {
        input.indeterminate = true
        input.checked = false
      } else {
        input.indeterminate = false
        input.checked = state as boolean
      }
      input.setAttribute('data-checked', `${state}`)
    }

    return (
      <>
        <input
          className={cn(
            checkersStylePattern({
              indicatorState:
                indicatorReady && checkedIndicatorReady
                  ? 'both'
                  : indicatorReady
                    ? 'indicatorReady'
                    : checkedIndicatorReady
                      ? 'checkedIndicatorReady'
                      : 'default',
              type: 'checkbox',
            }),
            'transition-all transition-discrete duration-[200ms,150ms] ease-(--duck-motion-ease)',
            '[&:before,&:after]:transition-gpu [&:before,&:after]:duration-200 [&:before,&:after]:ease-[cubic-bezier(0.34,1.56,0.64,1)] [&:before,&:after]:will-change-[inherit]',
            (indicatorReady && checkedIndicatorReady) || indicatorReady
              ? ''
              : 'after:mb-0.5 after:h-2.25 after:w-1 after:border-[2px] after:border-t-0 after:border-l-0 after:bg-transparent',
            'data-[checked="indeterminate"]:border-primary data-[checked="indeterminate"]:bg-primary data-[checked="indeterminate"]:text-primary-foreground',
            'data-[checked="indeterminate"]:after:mask-none data-[checked="indeterminate"]:after:mb-0 data-[checked="indeterminate"]:after:h-0.5 data-[checked="indeterminate"]:after:w-2 data-[checked="indeterminate"]:after:rotate-0 data-[checked="indeterminate"]:after:scale-100 data-[checked="indeterminate"]:after:rounded-full data-[checked="indeterminate"]:after:border-0 data-[checked="indeterminate"]:after:bg-current data-[checked="indeterminate"]:after:opacity-100',
            'rounded-sm bg-transparent',
            className,
          )}
          data-slot="checkbox"
          onChange={(e) => {
            const nextChecked = e.target.checked ? true : e.target.indeterminate ? 'indeterminate' : false
            e.target.indeterminate = false
            changeCheckedState(nextChecked, e.target)
            handleChange(nextChecked)
          }}
          ref={ref ?? inputRef}
          dir={direction}
          style={{ ...style, ...inputStyle }}
          type="checkbox"
          {...props}
        />
        <SvgIndicator className="sr-only" />
      </>
    )
  },
)
Checkbox.displayName = 'Checkbox'

const CheckboxWithLabel = React.forwardRef<HTMLDivElement, Omit<ICheckboxWithLabelProps, 'ref'>>(
  ({ id, _checkbox, _label, className, ...props }, ref) => {
    const { className: labelClassName, ...labelProps } = _label
    return (
      <div
        className={cn('flex items-center justify-start gap-2', className)}
        ref={ref}
        {...props}
        data-slot="checkbox-with-label">
        <Checkbox id={id} {..._checkbox} />
        <Label className={cn('cursor-pointer', labelClassName)} htmlFor={id} {...labelProps} />
      </div>
    )
  },
)
CheckboxWithLabel.displayName = 'CheckboxWithLabel'

const CheckboxGroup = React.forwardRef<HTMLDivElement, Omit<CheckboxGroupProps, 'ref'>>(
  ({ subtasks, subtasks_default_values, ...props }, ref) => {
    const { _checkbox, _label } = subtasks_default_values || {}
    return (
      <div className={cn('mb-3 flex flex-col gap-2')} {...props} data-slot="checkbox-group" ref={ref}>
        {subtasks.map(({ id, title, checked }) => (
          <CheckboxWithLabel
            _checkbox={{
              ..._checkbox,
              checked,
              className: 'w-4 h-4 rounded-full border-muted-foreground/80',
            }}
            _label={{ ..._label, children: title }}
            data-slot="checkbox-with-label"
            id={id}
            key={id}
          />
        ))}
      </div>
    )
  },
)
CheckboxGroup.displayName = 'CheckboxGroup'

/* ------------------------------------------------------------------ */
/*  MotionCheckbox + MotionCheckboxWithLabel + MotionCheckboxGroup       */
/* ------------------------------------------------------------------ */

const MotionCheckbox = React.forwardRef<HTMLInputElement, ICheckboxProps>(({ onCheckedChange, ...props }, ref) => {
  const [bounce, setBounce] = React.useState(false)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        animate={bounce ? checkerBounce : {}}
        transition={contentTransition}
        onAnimationComplete={() => setBounce(false)}
        className="inline-flex">
        <Checkbox
          ref={ref}
          onCheckedChange={(next) => {
            setBounce(true)
            onCheckedChange?.(next)
          }}
          {...props}
        />
      </m.div>
    </LazyMotion>
  )
})
MotionCheckbox.displayName = 'MotionCheckbox'

const MotionCheckboxWithLabel = React.forwardRef<
  HTMLDivElement,
  Omit<ICheckboxWithLabelProps, 'ref'> & { index?: number }
>(({ id, _checkbox, _label, className, index = 0 }, ref) => {
  const { className: labelClassName, ...labelProps } = _label
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: index * 0.05 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        className={cn('flex items-center justify-start gap-2', className)}
        ref={ref}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        data-slot="checkbox-with-label">
        <MotionCheckbox id={id} {..._checkbox} />
        <Label className={cn('cursor-pointer', labelClassName)} htmlFor={id} {...labelProps} />
      </m.div>
    </LazyMotion>
  )
})
MotionCheckboxWithLabel.displayName = 'MotionCheckboxWithLabel'

const MotionCheckboxGroup = React.forwardRef<HTMLDivElement, Omit<CheckboxGroupProps, 'ref'>>(
  ({ subtasks, subtasks_default_values, ...props }, ref) => {
    const { _checkbox, _label } = subtasks_default_values || {}
    return (
      <div className={cn('mb-3 flex flex-col gap-2')} {...props} data-slot="checkbox-group" ref={ref}>
        {subtasks.map(({ id, title, checked }, i) => (
          <MotionCheckboxWithLabel
            _checkbox={{
              ..._checkbox,
              checked,
              className: 'w-4 h-4 rounded-full border-muted-foreground/80',
            }}
            _label={{ ..._label, children: title }}
            data-slot="checkbox-with-label"
            id={id}
            key={id}
            index={i}
          />
        ))}
      </div>
    )
  },
)
MotionCheckboxGroup.displayName = 'MotionCheckboxGroup'

export { Checkbox, CheckboxGroup, CheckboxWithLabel, MotionCheckbox, MotionCheckboxGroup, MotionCheckboxWithLabel }
