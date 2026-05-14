import Mousetrap from 'mousetrap'
import * as React from 'react'
import { normalizeShortcuts } from '../Getkeys'
import type { DuckShortcutProps } from './'

export const useDuckShortcut: React.FC<DuckShortcutProps> = ({ keys, onKeysPressed }) => {
  const normalizedKeys = React.useMemo(() => normalizeShortcuts(keys), [keys])

  React.useEffect(() => {
    Mousetrap.bind(normalizedKeys, onKeysPressed)
    return () => {
      Mousetrap.unbind(normalizedKeys)
    }
  }, [normalizedKeys, onKeysPressed])

  return null
}
