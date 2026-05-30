import type { RegistryEntry } from '../registry-schema'

export const registryDashboards: RegistryEntry[] = [
  {
    categories: ['dashboards', 'dashboard'],
    dependencies: ['react-hook-form'],
    files: [],
    name: 'dashboard-1',
    registryDependencies: ['button', 'input', 'avatar', 'separator', 'label'],
    root_folder: 'dashboards/dashboard-1',
    type: 'registry:block',
  },
]
