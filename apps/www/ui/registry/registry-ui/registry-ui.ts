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
  {
    name: 'badge',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-slot'],
    registryDependencies: ['tooltip'],
    root_folder: 'registry-ui-components/badge',
    files: [],
  },
  {
    name: 'tooltip',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-tooltip'],
    registryDependencies: [],
    root_folder: 'registry-ui-components/tooltip',
    files: [],
  },
  {
    name: 'accordion',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-accordion'],
    registryDependencies: [],
    root_folder: 'registry-ui-components/accordion',
    files: [],
  },
  {
    name: 'toggle',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-toggle'],
    registryDependencies: [],
    root_folder: 'registry-ui-components/toggle',
    files: [],
  },
  {
    name: 'toggle-group',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-toggle-group'],
    registryDependencies: [],
    root_folder: 'registry-ui-components/toggle-group',
    files: [],
  },
]
