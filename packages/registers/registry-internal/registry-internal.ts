import type { RegistryEntry } from '../registry-schema'

export const registryInternal: RegistryEntry[] = [
  {
    files: [],
    name: 'internal-primitives-examples',
    registryDependencies: ['@gentleduck/primitives'],
    root_folder: 'internal-primitives',
    type: 'registry:internal',
  },
]
