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
export type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type SidebarProps = React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
  mobileTitle?: string
  mobileDescription?: string
}
