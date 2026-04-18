import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { getComponentRef, usePresence } from './presence.libs'
import type { IPresence } from './presence.types'

const Presence: React.FC<IPresence.IProps> = (props) => {
  const { present, children } = props
  const presence = usePresence(present)

  const child = (
    typeof children === 'function' ? children({ present: presence.isPresent }) : React.Children.only(children)
  ) as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>

  const ref = useComposedRefs(presence.ref, getComponentRef(child))
  const forceMount = typeof children === 'function'
  return forceMount || presence.isPresent ? React.cloneElement(child, { ref }) : null
}

Presence.displayName = 'Presence'

export { Presence }
