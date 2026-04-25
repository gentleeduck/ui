import type * as React from 'react'
import type { PackageLifecycleStatus } from '~/config/package-status'

export interface INavItem {
  title: string
  href?: string
  description?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ElementType
  color?: string
  label?: string
  status?: PackageLifecycleStatus
  accordion?: boolean
  defaultOpen?: boolean
  collapsible?: boolean
}

export interface INavItemWithChildren extends INavItem {
  items?: INavItemWithChildren[]
}

export interface IMainNavItem extends INavItemWithChildren {}

export interface ISidebarNavItem extends INavItemWithChildren {}
