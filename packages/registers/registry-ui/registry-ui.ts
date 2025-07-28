import type { Registry } from '../registry-schema'

export const registry_ui: Registry = [
  {
    name: 'accordion',
    type: 'registry:ui',
    dependencies: ['@gentleduck/aria-feather', '@gentledduck/anim'],
    registryDependencies: [],
    root_folder: 'accordion',
    files: [],
  },
  {
    name: 'badge',
    type: 'registry:ui',
    dependencies: ['@gentleduck/aria-feather'],
    registryDependencies: [],
    root_folder: 'badge',
    files: [],
  },
  {
    name: 'button',
    type: 'registry:ui',
    dependencies: ['@gentleduck/aria-feather'],
    registryDependencies: [],
    root_folder: 'button',
    files: [],
  },
  {
    name: 'switch',
    type: 'registry:ui',
    dependencies: ['@gentleduck/aria-feather'],
    registryDependencies: [],
    root_folder: 'switch',
    files: [],
  },

  {
    name: 'tabs',
    type: 'registry:ui',
    dependencies: ['@gentleduck/aria-feather '],
    registryDependencies: [],
    root_folder: 'tabs',
    files: [],
  },
  {
    name: 'textarea',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    root_folder: 'textarea',
    files: [],
  },
  {
    name: 'toggle',
    type: 'registry:ui',
    dependencies: ['@gentleduck/variants'],
    registryDependencies: [],
    root_folder: 'toggle',
    files: [],
  },
  {
    name: 'toggle-group',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['toggle'],
    root_folder: 'toggle-group',
    files: [],
  },
]
