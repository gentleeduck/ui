export const config = {
  description: 'This is the main file of the @gentleduck/ui CLI application written with TypeScript',
  name: '@gentleduck/cli',
  version: '1.0.11',
}

export const REGISTRY_URL = process.env['COMPONENTS_REGISTRY_URL'] ?? 'https://ui.gentleduck.org/r'
