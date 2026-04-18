import { registryAuth, registryCalendar, registryCharts, registryDashboards, registrySidebar } from './registry-blocks'
import { registryExamples } from './registry-examples'
import { registryInternal } from './registry-internal'
import type { Registry } from './registry-schema'
import { registryUi } from './registry-ui'

export * from './registry-colors'
export * from './registry-examples'
export * from './registry-internal'
export * from './registry-schema'
export * from './registry-ui'
export * from './styles'

export const registry: Registry = {
  blocks: [...registryAuth, ...registryCalendar, ...registryDashboards, ...registryCharts, ...registrySidebar],
  examples: registryExamples,
  uis: registryUi,
  internal: registryInternal,
}
