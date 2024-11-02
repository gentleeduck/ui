import { Registry } from '../registry-schema'

export const registry_ui: Registry = [
  {
    name: 'button',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-slot', '@ahmedayob/duck-shortcut'],
    registryDependencies: ['tooltip', 'command', 'badge'],
    root_folder: 'registry-ui-components/button',
    files: [],
  },
]
