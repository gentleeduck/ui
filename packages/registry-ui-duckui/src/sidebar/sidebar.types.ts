import type { Direction } from '@gentleduck/primitives/direction'
import type { Dispatch, SetStateAction } from 'react'

export type SidebarDirection = Direction

export type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  openMobile: boolean
  setOpenMobile: Dispatch<SetStateAction<boolean>>
  isMobile: boolean
  toggleSidebar: () => void
  dir: SidebarDirection
}
