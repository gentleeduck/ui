import type { Registry } from '../registry-schema'

export const registry_auth: Registry = [
  {
    name: 'signup-1',
    type: 'registry:block',
    registryDependencies: ['button', 'input', 'avatar', 'separator', 'label', 'react-hook-form'],
    files: [],
    root_folder: 'auth/signup-1',
    categories: ['auth', 'signup-1'],
  },
]
