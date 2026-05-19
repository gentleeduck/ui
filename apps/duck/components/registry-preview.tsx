'use client'

import { Index } from '~/__ui_registry__'

export function RegistryPreview({ name }: { name: string }) {
  const Component = Index[name]?.component
  if (!Component) return null
  return <Component />
}
