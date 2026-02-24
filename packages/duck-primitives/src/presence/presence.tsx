import * as React from 'react'
import { useComposedRefs } from '../libs/compose-ref'
import { getComponentRef, usePresence } from './presence.libs'

/* -------------------------------------------------------------------------------------------------
 * Presence
 *
 * Controls mounting/unmounting of children based on a `present` prop while
 * respecting CSS animations. Uses a state machine (mounted / unmountSuspended /
 * unmounted) to detect exit animations and delay unmounting until they complete.
 *
 * Accepts either a ReactElement child or a render function for more control.
 * -----------------------------------------------------------------------------------------------*/

interface PresenceProps {
  children: React.ReactElement | ((props: { present: boolean }) => React.ReactElement)
  present: boolean
}

const Presence: React.FC<PresenceProps> = (props) => {
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
export type { PresenceProps }
