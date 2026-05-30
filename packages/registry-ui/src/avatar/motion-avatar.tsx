'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { withMotion } from '../_internal/motion-shell'
import type { IAvatarGroupProps } from './avatar'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const MotionAvatar = withMotion(Avatar, scaleIn, { transition: springBouncy })
MotionAvatar.displayName = 'MotionAvatar'

const MotionAvatarGroup = React.forwardRef<HTMLDivElement, IAvatarGroupProps>(
  ({ imgs, maxVisible = 3, className, ...props }, ref) => {
    const visibleImgs = imgs.slice(0, maxVisible)
    const overflowCount = imgs.length > maxVisible ? imgs.length - maxVisible : 0
    const content = useMotionPreset(scaleIn, { transition: springBouncy })

    return (
      <LazyMotion features={loadDomAnimation}>
        <div className={cn('flex items-center -space-x-5', className)} ref={ref} {...props}>
          {visibleImgs.map((img, i) => (
            <m.div
              key={img.id ?? img.src ?? img.alt ?? i}
              initial={content.initial}
              animate={content.animate}
              transition={{ ...content.transition, delay: i * 0.08 }}>
              <Avatar className={cn('border-2 border-border')}>
                <AvatarImage alt={img.alt} src={img.src} />
                <AvatarFallback>{img.fallback?.slice(0, 2) ?? img.alt?.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </m.div>
          ))}
          {overflowCount > 0 && (
            <m.div
              initial={content.initial}
              animate={content.animate}
              transition={{ ...content.transition, delay: visibleImgs.length * 0.08 }}
              className="relative z-10 inline-block">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm ring-2 ring-background">
                +{overflowCount}
              </div>
            </m.div>
          )}
        </div>
      </LazyMotion>
    )
  },
)
MotionAvatarGroup.displayName = 'MotionAvatarGroup'

export { MotionAvatar, MotionAvatarGroup }
