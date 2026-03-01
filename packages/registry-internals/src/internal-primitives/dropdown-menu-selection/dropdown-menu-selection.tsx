'use client'

import * as DropdownMenu from '@gentleduck/primitives/dropdown-menu'
import * as React from 'react'
import styles from './styles.module.css'

export default function DropdownMenuSelectionInternalExample() {
  const [showDeleted, setShowDeleted] = React.useState(false)
  const [view, setView] = React.useState<'grid' | 'list'>('grid')

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.trigger}>View mode</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} sideOffset={8}>
          <DropdownMenu.Label className={styles.menuLabel}>Display</DropdownMenu.Label>
          <DropdownMenu.RadioGroup onValueChange={(v) => setView(v as 'grid' | 'list')} value={view}>
            <DropdownMenu.RadioItem className={styles.item} value="grid">
              Grid
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem className={styles.item} value="list">
              List
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator className={styles.separator} />
          <DropdownMenu.CheckboxItem
            checked={showDeleted}
            className={styles.item}
            onCheckedChange={(checked) => setShowDeleted(checked === true)}>
            Show deleted
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
