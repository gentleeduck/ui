import type * as React from 'react'
import { Portal as PortalPrimitive } from '../portal'
import type { ISelect } from './select.types'

const PORTAL_NAME = 'SelectPortal'

export const SelectPortal: React.FC<ISelect.IPortalProps> = (props: ISelect.IScoped<ISelect.IPortalProps>) => {
  return <PortalPrimitive asChild {...props} />
}

SelectPortal.displayName = PORTAL_NAME
