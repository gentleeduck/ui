// import { blocks } from '@/registry/registry-blocks'
// import { charts } from '@/registry/registry-charts'
// import { hooks } from '@/registry/registry-hooks'
// import { lib } from '@/registry/registry-lib'
// import { themes } from '@/registry/registry-themes'
// import { v0 } from '@/registry/registry-v0'
import { registry_ui } from './registry-ui'
import { registry_examples } from './registry-examples'
import type { Registry } from './registry-schema'
export * from './registry-ui'
export * from './registry-examples'
export * from './registry-schema'
export * from './registry-colors'
export * from './styles'

export const registry: Registry = [
  ...registry_ui,
  ...registry_examples,
  // ...blocks,
  // ...charts,
  // ...lib,
  // ...hooks,
  // ...themes,
  //...v0
]
