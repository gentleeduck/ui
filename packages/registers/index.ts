import { registry_auth, registry_calendar, registry_charts, registry_dashboards, registry_sidebar } from './registry-blocks'
import { registry_examples } from './registry-examples'
import { registry_internal } from './registry-internal'
import type { Registry } from './registry-schema'
import { registry_ui } from './registry-ui'

export * from './registry-colors'
export * from './registry-examples'
export * from './registry-internal'
export * from './registry-schema'
export * from './registry-ui'
export * from './styles'

export const registry: Registry = {
  blocks: [...registry_auth, ...registry_calendar, ...registry_dashboards, ...registry_charts, ...registry_sidebar],
  examples: registry_examples,
  uis: registry_ui,
  internal: registry_internal,
}
