'use client'

import { cn } from '@gentleduck/libs/cn'
import { Block, type BlockChunk } from '@gentleduck/registers'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'
import { BlockCopyButton } from '~/components/blocks'
import { V0Button } from '~/components/V0'
import { useLiftMode } from '~/hooks/use-lift-mode'

export function BlockChunk({
  block,
  chunk,
  children,
  ...props
}: React.PropsWithChildren<{ block: Block; chunk?: BlockChunk }>) {
  const { isLiftMode } = useLiftMode(block.name)

  if (!chunk) {
    return null
  }

  return (
    <AnimatePresence>
      {isLiftMode && (
        <motion.div
          animate={{ opacity: 1 }}
          className={cn('group rounded-xl bg-background shadow-xl transition', chunk.container?.className)}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
          initial={{ opacity: 0 }}
          key={chunk.name}
          transition={{ duration: 0.2, ease: 'easeIn' }}
          x-chunk-container={chunk.name}
          {...props}>
          <div className="relative z-30">{children}</div>
          {chunk.code && (
            <div className="absolute inset-x-0 top-0 z-30 flex px-4 py-3 opacity-0 transition-all duration-200 ease-in group-hover:-translate-y-12 group-hover:opacity-100">
              <div className="flex w-full items-center justify-end gap-2">
                <BlockCopyButton code={chunk.code} event="copy_chunk_code" name={chunk.name} />
                <V0Button
                  block={{
                    code: chunk.code,
                    description: chunk.description || '',
                    name: chunk.name,
                    style: block.style,
                  }}
                  size="icon"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
