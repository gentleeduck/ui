'use client'

import { useLiftMode } from '@gentleduck/docs/client'
import type { Block } from '@gentleduck/registers'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type * as React from 'react'

export function BlockWrapper({ block, children }: React.PropsWithChildren<{ block: Block }>) {
  const { isLiftMode } = useLiftMode(block.name)
  const prefersReducedMotion = useReducedMotion()

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
              transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.38, ease: 'easeOut' },
            }}
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.18, duration: 0.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
