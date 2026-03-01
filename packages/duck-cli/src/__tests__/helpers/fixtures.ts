import path from 'node:path'

export const FIXTURES_DIR = path.resolve(__dirname, '../../../__test__')

export const FIXTURE_PATHS = {
  duckuiConfig: path.join(FIXTURES_DIR, 'duck-ui.config.json'),
  packageJson: path.join(FIXTURES_DIR, 'package.json'),
  tsconfig: path.join(FIXTURES_DIR, 'tsconfig.json'),
}

export function createMockRegistryEntry(overrides: Record<string, any> = {}) {
  return {
    name: 'button',
    type: 'registry:ui' as const,
    root_folder: 'button',
    files: [
      {
        path: 'button/button.tsx',
        target: 'button/button.tsx',
        type: 'registry:ui' as const,
        content: 'export function Button() { return null }',
      },
    ],
    dependencies: ['class-variance-authority'],
    devDependencies: [],
    registryDependencies: [],
    ...overrides,
  }
}

export function createMockDuckUIConfig(overrides: Record<string, any> = {}) {
  return {
    schema: 'https://ui.gentleduck.org/schema.json',
    rsc: true,
    monorepo: false,
    workspace: {
      root: '.',
      project: '.',
    },
    tailwind: {
      baseColor: 'zinc',
      css: './src/styles.css',
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      ui: '~/ui',
      libs: '~/libs',
      hooks: '~/hooks',
      pages: '~/pages',
      layouts: '~/layouts',
    },
    ...overrides,
  }
}

export function createMockRegistryIndex() {
  return [
    createMockRegistryEntry({ name: 'button' }),
    createMockRegistryEntry({ name: 'input', root_folder: 'input' }),
    createMockRegistryEntry({ name: 'card', root_folder: 'card' }),
  ]
}
