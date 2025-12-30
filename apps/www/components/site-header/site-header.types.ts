import { ComponentType } from 'react'

export type MenuItem = {
  description: string
  external?: boolean
  href: string
  title: string
}

export type MenuCard = {
  className?: string
  description: string
  external?: boolean
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  title: string
}
