import { Registry } from '../registry-schema'

export const registry_ui: Registry = [
  {
    name: 'button',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['slot'],
    root_folder: 'button',
    files: [],
  },
  {
    name: 'badge',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['slot'],
    root_folder: 'badge',
    files: [],
  },
  {
    name: 'tooltip',
    type: 'registry:ui',
    dependencies: [''],
    registryDependencies: ['slot'],
    root_folder: 'tooltip',
    files: [],
  },
  {
    name: 'command',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    root_folder: 'command',
    files: [],
  },
  {
    name: 'toggle',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-toggle'],
    registryDependencies: [],
    root_folder: 'toggle',
    files: [],
  },
  {
    name: 'accordion',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-accordion'],
    registryDependencies: [],
    root_folder: 'accordion',
    files: [],
  },
  {
    name: 'tabs',
    type: 'registry:ui',
    dependencies: ['@radix-ui/react-tabs'],
    registryDependencies: [],
    root_folder: 'tabs',
    files: [],
  },
  {
    name: 'table',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [
      'combobox',
      'input',
      'pagination',
      'scroll-area',
      'dropdown',
      'command',
      'button',
      'checkbox',
      'badge',
      'context-menu',
      'tooltip',
    ],
    root_folder: 'table',
    files: [],
  },
  {
    name: 'upload',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['alert-dialog', 'input', 'context-menu', 'scroll-area', 'button'],
    root_folder: 'upload',
    files: [],
  },
  {
    name: 'alert-dialog',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    root_folder: 'alert-dialog',
    files: [],
  },
  {
    name: 'drawer',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    root_folder: 'drawer',
    files: [],
  },
]
