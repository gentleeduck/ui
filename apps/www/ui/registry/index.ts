// import { blocks } from '@/registry/registry-blocks'
// import { charts } from '@/registry/registry-charts'
// import { hooks } from '@/registry/registry-hooks'
// import { lib } from '@/registry/registry-lib'
// import { themes } from '@/registry/registry-themes'
// import { v0 } from '@/registry/registry-v0'
import { Registry } from '@/registry/registry-schema'
import { registry_ui } from './registry-ui'
import { registry_examples } from './registry-examples'
export * from './registry-schema'
export * from './registry-colors'

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
