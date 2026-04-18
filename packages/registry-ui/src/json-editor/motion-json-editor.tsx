'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import type { FieldValues } from 'react-hook-form'
import { MotionButton } from '../button'
import { MotionPopover, MotionPopoverContent } from '../popover'
import { MotionSheet, MotionSheetContent } from '../sheet'
import { JsonTextareaField } from './json-editor'
import type { IJsonTextareaFieldProps } from './json-editor.types'

const motionComponents = {
  Button: MotionButton as typeof import('../button').Button,
  Popover: MotionPopover as typeof import('../popover').Popover,
  PopoverContent: MotionPopoverContent as typeof import('../popover').PopoverContent,
  Sheet: MotionSheet as typeof import('../sheet').Sheet,
  SheetContent: MotionSheetContent as typeof import('../sheet').SheetContent,
}

function MotionJsonTextareaField<TFieldValues extends FieldValues>(
  props: IJsonTextareaFieldProps<TFieldValues>,
): React.JSX.Element {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <JsonTextareaField {...props} components={motionComponents} />
      </m.div>
    </LazyMotion>
  )
}
MotionJsonTextareaField.displayName = 'MotionJsonTextareaField'

export { MotionJsonTextareaField }
