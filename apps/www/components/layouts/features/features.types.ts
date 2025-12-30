import { ReactNode } from 'react'

export type FeatureItem = {
  bgColor: string
  description: string
  external?: boolean
  href?: string
  icon: ReactNode
  textColor: string
  title: string
}
