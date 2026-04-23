import Mousetrap from 'mousetrap'
import * as React from 'react'
import { normalizeShortcuts } from '../Getkeys'
import type { DuckShortcutProps } from './'

export const useDuckShortcut: React.FC<DuckShortcutProps> = ({ keys, onKeysPressed }) => {
  // Normalize the shortcuts in a state
  const normalizedKeys = React.useMemo(() => normalizeShortcuts(keys), [keys])

  React.useEffect(() => {
    // Bind the keys using Mousetrap when the component mounts
    Mousetrap.bind(normalizedKeys, onKeysPressed)

    // Unbind the keys when the component unmounts
    return () => {
      Mousetrap.unbind(normalizedKeys)
    }
  }, [normalizedKeys, onKeysPressed])

  // The component doesn't render anything
  return null
}
