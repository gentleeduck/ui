'use client'

import * as AlertDialog from '@gentleduck/primitives/alert-dialog'
import styles from './styles.module.css'

export default function AlertDialogConfirmInternalExample() {
  return (
    <div className={styles.frame}>
      <p className={styles.label}>Destructive confirmation</p>
      <AlertDialog.AlertDialog>
        <AlertDialog.AlertDialogTrigger className={styles.trigger}>Open confirm</AlertDialog.AlertDialogTrigger>
        <AlertDialog.AlertDialogPortal>
          <AlertDialog.AlertDialogOverlay className={styles.overlay} />
          <AlertDialog.AlertDialogContent className={styles.content}>
            <AlertDialog.AlertDialogTitle className={styles.title}>Delete resource?</AlertDialog.AlertDialogTitle>
            <AlertDialog.AlertDialogDescription className={styles.description}>
              This action is permanent and cannot be undone.
            </AlertDialog.AlertDialogDescription>
            <div className={styles.actions}>
              <AlertDialog.AlertDialogCancel className={styles.secondary}>Cancel</AlertDialog.AlertDialogCancel>
              <AlertDialog.AlertDialogAction className={styles.danger}>Delete</AlertDialog.AlertDialogAction>
            </div>
          </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialogPortal>
      </AlertDialog.AlertDialog>
    </div>
  )
}
