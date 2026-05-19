'use client'

import { motionTransition, useDuckReducedMotion } from '@gentleduck/motion'
import type { Block } from '@gentleduck/registers'
import { AnimatePresence, motion } from 'motion/react'
import type * as React from 'react'
import { useLiftMode } from '~/hooks/use-lift-mode'

export function BlockWrapper({ block, children }: React.PropsWithChildren<{ block: Block }>) {
  const { isLiftMode } = useLiftMode(block.name)
  const prefersReducedMotion = useDuckReducedMotion()

  return (
    <>
      {children}
      <AnimatePresence>
        {isLiftMode && (
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-background/90 fill-mode-backwards"
            exit={{
              opacity: 0,
              transition: motionTransition(prefersReducedMotion, { duration: 0.38, ease: 'easeOut' } as const),
            }}
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={motionTransition(prefersReducedMotion, {
              delay: 0.18,
              duration: 0.2,
              ease: 'easeOut',
            } as const)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
