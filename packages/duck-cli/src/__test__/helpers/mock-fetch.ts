import { vi } from 'vitest'
import { createMockRegistryEntry, createMockRegistryIndex } from './fixtures'

export function createMockFetch(overrides: Record<string, any> = {}) {
  const responses: Record<string, any> = {
    '/r/index.json': createMockRegistryIndex(),
    '/r/components/button.json': createMockRegistryEntry({ name: 'button' }),
    '/r/components/input.json': createMockRegistryEntry({ name: 'input', root_folder: 'input' }),
    '/r/components/card.json': createMockRegistryEntry({
      name: 'card',
      root_folder: 'card',
      registryDependencies: ['button'],
    }),
    '/r/components/alert.json': createMockRegistryEntry({
      name: 'alert',
      root_folder: 'alert',
      dependencies: ['@gentleduck/libs', '@gentleduck/variants'],
      registryDependencies: ['button'],
      files: [
        {
          path: 'alert/alert.tsx',
          target: 'alert/alert.tsx',
          type: 'registry:ui' as const,
          content: 'export function Alert() { return null }',
        },
      ],
    }),
    '/r/components/dialog.json': createMockRegistryEntry({
      name: 'dialog',
      root_folder: 'dialog',
      dependencies: ['@gentleduck/libs'],
      registryDependencies: ['button', 'input'],
      files: [
        {
          path: 'dialog/dialog.tsx',
          target: 'dialog/dialog.tsx',
          type: 'registry:ui' as const,
          content: 'export function Dialog() { return null }',
        },
      ],
    }),
    '/r/themes/index.json': [
      { name: 'zinc', label: 'Zinc' },
      { name: 'rose', label: 'Rose' },
      { name: 'blue', label: 'Blue' },
    ],
    '/r/themes/zinc.json': {
      name: 'zinc',
      label: 'Zinc',
      light: { background: 'oklch(1 0 0)', foreground: 'oklch(0.141 0.005 285.823)' },
      dark: { background: 'oklch(0.145 0 0)', foreground: 'oklch(0.985 0 0)' },
      radius: '0.5rem',
    },
    '/r/themes/rose.json': {
      name: 'rose',
      label: 'Rose',
      light: { primary: 'oklch(0.645 0.246 16.439)' },
      dark: { primary: 'oklch(0.645 0.246 16.439)' },
    },
    ...overrides,
  }

  return vi.fn((url: string) => {
    const urlObj = new URL(url)
    // Normalize double slashes (e.g. /r//components/button.json -> /r/components/button.json)
    const pathname = urlObj.pathname.replace(/\/+/g, '/')
    const data = responses[pathname]

    if (!data) {
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Not found' }),
        text: () => Promise.resolve('Not found'),
      })
    }

    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  })
}
