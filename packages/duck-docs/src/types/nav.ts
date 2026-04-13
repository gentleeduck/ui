export interface INavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
  accordion?: boolean
  defaultOpen?: boolean
  collapsible?: boolean
}

export interface INavItemWithChildren extends INavItem {
  items?: INavItemWithChildren[]
}

export interface IMainNavItem extends INavItem {}

export interface ISidebarNavItem extends INavItemWithChildren {}
