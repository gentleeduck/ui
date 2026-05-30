import type * as React from 'react'

export interface INavItem {
  title: string
  href?: string
  description?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ElementType
  color?: string
  label?: string
  accordion?: boolean
  defaultOpen?: boolean
  collapsible?: boolean
}

export interface INavItemWithChildren extends INavItem {
  items?: INavItemWithChildren[]
}

export type IMainNavItem = INavItemWithChildren
export type ISidebarNavItem = INavItemWithChildren
