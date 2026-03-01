'use client'

import * as Select from '@gentleduck/primitives/select'
import * as React from 'react'
import styles from './styles.module.css'

export default function SelectControlledInternalExample() {
  const [value, setValue] = React.useState('apple')

  return (
    <Select.Select value={value} onValueChange={setValue}>
      <Select.SelectTrigger className={styles.trigger}>
        <Select.SelectValue placeholder="Choose fruit" />
      </Select.SelectTrigger>
      <Select.SelectPortal>
        <Select.SelectContent className={styles.content} sideOffset={8}>
          <Select.SelectViewport>
            <Select.SelectItem className={styles.item} value="apple">
              <Select.SelectItemText>Apple</Select.SelectItemText>
            </Select.SelectItem>
            <Select.SelectItem className={styles.item} value="banana">
              <Select.SelectItemText>Banana</Select.SelectItemText>
            </Select.SelectItem>
            <Select.SelectItem className={styles.item} value="orange">
              <Select.SelectItemText>Orange</Select.SelectItemText>
            </Select.SelectItem>
          </Select.SelectViewport>
        </Select.SelectContent>
      </Select.SelectPortal>
    </Select.Select>
  )
}
