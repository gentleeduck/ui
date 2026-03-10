import { registry } from '@gentleduck/registers'
import { defineConfig } from '../../define-config'

export const monorepoRegistryPreset = defineConfig({
  registries: {
    blocks: registry.blocks,
    examples: registry.examples,
    internal: registry.internal,
    uis: registry.uis,
  },
  registrySource: 'inline',
})

export default monorepoRegistryPreset
