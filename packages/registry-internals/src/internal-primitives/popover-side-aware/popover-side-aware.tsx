'use client'

import * as Popover from '@gentleduck/primitives/popover'
import styles from './styles.module.css'

export default function PopoverSideAwareInternalExample() {
  return (
    <Popover.Root>
      <Popover.Trigger className={styles['trigger']}>Open filters</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className={styles['content']}
          collisionPadding={10}
          side="bottom"
          sideOffset={10}>
          <h4 className={styles['title']}>Quick filters</h4>
          <p className={styles['description']}>Uses side, align, offset, and collision padding.</p>
          <div className={styles['chips']}>
            <span>Recent</span>
            <span>Assigned</span>
            <span>Open</span>
          </div>
          <Popover.Arrow className={styles['arrow']} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
