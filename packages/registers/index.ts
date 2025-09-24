import { registry_auth, registry_charts, registry_dashboards } from './registry-blocks'
import { registry_examples } from './registry-examples'
import type { Registry } from './registry-schema'
import { registry_ui } from './registry-ui'

export * from './registry-colors'
export * from './registry-examples'
export * from './registry-schema'
export * from './registry-ui'
export * from './styles'

export const registry: Registry = {
  blocks: [...registry_auth, ...registry_dashboards, ...registry_charts],
  examples: [...registry_examples],
  uis: [...registry_ui],
}
