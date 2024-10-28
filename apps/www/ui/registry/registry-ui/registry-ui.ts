import { Registry } from '../registry-schema'

export const registry_ui: Registry = [
  {
    name: 'button',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-slot'],
    files: ['registry-ui-components/button'],
  },
]
