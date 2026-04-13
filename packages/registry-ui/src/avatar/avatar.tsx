'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import * as AvatarPrimitive from '@gentleduck/primitives/avatar'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-img"
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export interface IAvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  imgs: { src?: string; alt?: string; fallback?: string; id?: string }[]
  maxVisible?: number
}

const AvatarGroup = React.forwardRef<HTMLDivElement, IAvatarGroupProps>(
  ({ imgs, maxVisible = 3, className, ...props }, ref) => {
    const visibleImgs = imgs.slice(0, maxVisible)
    const overflowCount = imgs.length > maxVisible ? imgs.length - maxVisible : 0

    return (
      <div className={cn('flex items-center -space-x-5', className)} ref={ref} {...props}>
        {visibleImgs.map((img) => (
          <Avatar className={cn('border-2 border-border')} key={img.id}>
            <AvatarImage alt={img.alt} src={img.src} />
            <AvatarFallback>{img.fallback?.slice(0, 2) ?? img.alt?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ))}

        {overflowCount > 0 && (
          <div className="relative z-10 inline-block">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm ring-2 ring-background">
              +{overflowCount}
            </div>
          </div>
        )}
      </div>
    )
  },
)
AvatarGroup.displayName = 'AvatarGroup'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const MOTION_AVATAR_OPTIONS = { transition: springBouncy } as const

const MotionAvatar = React.forwardRef<React.ComponentRef<typeof Avatar>, React.ComponentPropsWithoutRef<typeof Avatar>>(
  (props, ref) => {
    const content = useMotionPreset(scaleIn, MOTION_AVATAR_OPTIONS)
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div
          initial={content.initial}
          animate={content.animate}
          transition={content.transition}
          className="inline-flex">
          <Avatar ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionAvatar.displayName = 'MotionAvatar'

const MotionAvatarGroup = React.forwardRef<HTMLDivElement, IAvatarGroupProps>(
  ({ imgs, maxVisible = 3, className, ...props }, ref) => {
    const visibleImgs = imgs.slice(0, maxVisible)
    const overflowCount = imgs.length > maxVisible ? imgs.length - maxVisible : 0
    const content = useMotionPreset(scaleIn, MOTION_AVATAR_OPTIONS)

    return (
      <LazyMotion features={loadDomAnimation}>
        <div className={cn('flex items-center -space-x-5', className)} ref={ref} {...props}>
          {visibleImgs.map((img, i) => (
            <m.div
              key={img.id}
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

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage, MotionAvatar, MotionAvatarGroup }
