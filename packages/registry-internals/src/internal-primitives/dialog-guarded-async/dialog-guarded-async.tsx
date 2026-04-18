'use client'

import * as Dialog from '@gentleduck/primitives/dialog'
import * as React from 'react'
import styles from './styles.module.css'

export default function DialogGuardedAsyncInternalExample() {
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  async function onConfirm() {
    try {
      setBusy(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles['trigger']}>Delete project</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles['overlay']} />
        <Dialog.Content
          className={styles['content']}
          onEscapeKeyDown={(event) => {
            if (busy) event.preventDefault()
          }}
          onInteractOutside={(event) => {
            if (busy) event.preventDefault()
          }}>
          <Dialog.Title className={styles['title']}>Delete project?</Dialog.Title>
          <Dialog.Description className={styles['description']}>This action cannot be undone.</Dialog.Description>
          <div className={styles['actions']}>
            <Dialog.Close asChild>
              <button className={styles['secondary']} disabled={busy} type="button">
                Cancel
              </button>
            </Dialog.Close>
            <button className={styles['danger']} disabled={busy} onClick={onConfirm} type="button">
              {busy ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
