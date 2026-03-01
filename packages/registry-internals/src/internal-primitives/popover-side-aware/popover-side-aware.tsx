'use client'

import * as Popover from '@gentleduck/primitives/popover'
import * as React from 'react'
import styles from './styles.module.css'

export default function PopoverSideAwareInternalExample() {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null)

  return (
    <div className={styles.frame} ref={setPortalContainer}>
      <Popover.Root>
        <Popover.Trigger className={styles.trigger}>Open filters</Popover.Trigger>
        <Popover.Portal container={portalContainer}>
          <Popover.Content
            align="start"
            className={styles.content}
            collisionBoundary={portalContainer ?? undefined}
            collisionPadding={10}
            side="bottom"
            sideOffset={10}>
            <h4 className={styles.title}>Quick filters</h4>
            <p className={styles.description}>Uses side, align, offset, and collision padding.</p>
            <div className={styles.chips}>
              <span>Recent</span>
              <span>Assigned</span>
              <span>Open</span>
            </div>
            <Popover.Arrow className={styles.arrow} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
