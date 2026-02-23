import type { RegistryEntry } from '../registry-schema'

export const registry_dashboards: RegistryEntry[] = [
  // Signup
  {
    categories: ['dashboards', 'dashboard'],
    files: [],
    name: 'dashboard-1',
    registryDependencies: ['button', 'input', 'avatar', 'separator', 'label', 'react-hook-form'],
    root_folder: 'dashboards/dashboard-1',
    type: 'registry:block',
  },
]
