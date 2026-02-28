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
    '/r/themes/zinc.json': {
      name: 'zinc',
      cssVars: {
        light: { background: '0 0% 100%', foreground: '240 10% 3.9%' },
        dark: { background: '240 10% 3.9%', foreground: '0 0% 98%' },
      },
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
