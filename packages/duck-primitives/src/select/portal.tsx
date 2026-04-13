import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import type { ScopedProps } from './select'

const PORTAL_NAME = 'SelectPortal'

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

export interface ISelectPortalProps {
  children?: React.ReactNode
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container']
}

export const SelectPortal: React.FC<ISelectPortalProps> = (props: ScopedProps<ISelectPortalProps>) => {
  return <PortalPrimitive asChild {...props} />
}

SelectPortal.displayName = PORTAL_NAME
