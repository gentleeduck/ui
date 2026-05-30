import type { RegistryEntry } from '../registry-schema'

// All auth blocks share the same registry deps. `react-hook-form` is an npm
// package (belongs in `dependencies`), not a registry-component name —
// keeping it in `registryDependencies` would let the build/CLI try to
// resolve a non-existent registry entry.
const AUTH_REGISTRY_DEPS = ['button', 'input', 'avatar', 'separator', 'label'] as const
const AUTH_NPM_DEPS = ['react-hook-form'] as const

function auth(name: string, subcat: 'signup' | 'login'): RegistryEntry {
  return {
    categories: ['authentications', subcat],
    dependencies: [...AUTH_NPM_DEPS],
    files: [],
    name,
    registryDependencies: [...AUTH_REGISTRY_DEPS],
    root_folder: `authentications/${name}`,
    type: 'registry:block',
  }
}

export const registryAuth: RegistryEntry[] = [
  // Signup
  auth('signup-1', 'signup'),

  // Login
  auth('login-1', 'login'),
  auth('login-2', 'login'),
  auth('login-3', 'login'),
  auth('login-4', 'login'),
  auth('login-5', 'login'),
]
