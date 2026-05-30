'use client'

import { useKeyBind } from '@gentleduck/vim/react'

/**
 * Renderless component that binds a global keyboard shortcut while mounted
 * and unbinds it on unmount. Shared by `MenubarShortcut` and
 * `DropdownMenuShortcut` (and any future shortcut-bearing menu item).
 *
 * Always calls `event.preventDefault()` to keep the shortcut from triggering
 * browser-level behaviour (e.g. `Ctrl+S` saving the page).
 */
export function ShortcutBinder({ keys, handler }: { keys: string; handler: () => void }) {
  useKeyBind(keys, handler, { preventDefault: true })
  return null
}
