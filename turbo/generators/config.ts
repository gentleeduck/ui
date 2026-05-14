import { execSync } from 'node:child_process'
import type { PlopTypes } from '@turbo/gen'

interface PackageJson {
  name: string
  description: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('package', {
    description: 'Create a new @gentleduck/* package in packages/',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name (without @gentleduck/ prefix, e.g. "calendar"):',
        validate: (input: string) => {
          if (!input) return 'Name is required'
          if (!/^[a-z][a-z0-9-]*$/.test(input)) return 'Use lowercase letters, numbers, and hyphens only'
          return true
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package description:',
        default: (answers: { name: string }) => `${answers.name} package for Duck UI.`,
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          { name: 'Vitest (unit testing with jsdom)', value: 'vitest', checked: true },
          { name: 'Zod (schema validation)', value: 'zod', checked: false },
          { name: 'React (peer dependency)', value: 'react', checked: true },
          { name: '@gentleduck/libs (cn, utilities)', value: 'libs', checked: false },
          { name: '@gentleduck/variants (cva)', value: 'variants', checked: false },
          { name: '@gentleduck/hooks (React hooks)', value: 'hooks', checked: false },
          { name: '@gentleduck/primitives (headless components)', value: 'primitives', checked: false },
        ],
      },
      {
        type: 'input',
        name: 'deps',
        message: 'Extra npm dependencies (space-separated, or leave empty):',
      },
    ],
    actions: (answers) => {
      if (!answers) return []

      const name = (answers.name as string).replace('@gentleduck/', '').replace('duck-', '')
      answers.name = name

      const features = (answers.features as string[]) || []
      const hasVitest = features.includes('vitest')
      const hasZod = features.includes('zod')
      const hasReact = features.includes('react')
      const hasLibs = features.includes('libs')
      const hasVariants = features.includes('variants')
      const hasHooks = features.includes('hooks')
      const hasPrimitives = features.includes('primitives')

      const actions: PlopTypes.ActionType[] = [
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/package.json',
          templateFile: 'templates/package.json.hbs',
        },
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/tsconfig.json',
          templateFile: 'templates/tsconfig.json.hbs',
        },
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/tsdown.config.ts',
          templateFile: 'templates/tsdown.config.ts.hbs',
        },
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/src/index.ts',
          template: "export const {{ name }} = '{{ name }}'\n",
        },
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/LICENSE',
          templateFile: 'templates/LICENSE.hbs',
        },
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/SECURITY.md',
          templateFile: 'templates/SECURITY.md.hbs',
        },
        {
          type: 'add',
          path: 'packages/duck-{{ name }}/README.md',
          templateFile: 'templates/README.md.hbs',
        },
      ]

      if (hasVitest) {
        actions.push(
          {
            type: 'add',
            path: 'packages/duck-{{ name }}/vitest.config.ts',
            templateFile: 'templates/vitest.config.ts.hbs',
          },
          {
            type: 'add',
            path: 'packages/duck-{{ name }}/src/__test__/{{ name }}.test.ts',
            template: [
              "import { describe, expect, it } from 'vitest'",
              "import { {{ name }} } from '../index'",
              '',
              "describe('{{ name }}', () => {",
              "  it('should be defined', () => {",
              '    expect({{ name }}).toBeDefined()',
              '  })',
              '})',
              '',
            ].join('\n'),
          },
        )
      }

      actions.push({
        type: 'modify',
        path: 'packages/duck-{{ name }}/package.json',
        async transform(content) {
          const pkg = JSON.parse(content) as PackageJson

          if (hasVitest) {
            pkg.scripts.test = 'vitest run'
            pkg.scripts.dev = 'vitest'
          }

          if (hasVitest) {
            pkg.devDependencies.vitest = '^4.0.18'
            pkg.devDependencies['@testing-library/jest-dom'] = '^6.8.0'
            pkg.devDependencies.jsdom = '^29.0.0'
          }
          if (hasZod) {
            pkg.devDependencies.zod = '4.3.6'
          }

          if (!hasReact) {
            delete pkg.peerDependencies.react
            delete pkg.peerDependencies['react-dom']
          }

          if (hasLibs) pkg.devDependencies['@gentleduck/libs'] = 'workspace:*'
          if (hasVariants) pkg.devDependencies['@gentleduck/variants'] = 'workspace:*'
          if (hasHooks) pkg.devDependencies['@gentleduck/hooks'] = 'workspace:*'
          if (hasPrimitives) pkg.devDependencies['@gentleduck/primitives'] = 'workspace:*'

          const extraDeps = (answers?.deps as string) || ''
          if (extraDeps.trim()) {
            for (const dep of extraDeps.split(' ').filter(Boolean)) {
              if (dep.startsWith('@gentleduck/')) {
                pkg.devDependencies[dep] = 'workspace:*'
                continue
              }
              try {
                const version = await fetch(`https://registry.npmjs.org/-/package/${dep}/dist-tags`)
                  .then((res) => res.json())
                  .then((json) => json.latest)
                if (!pkg.dependencies) pkg.dependencies = {}
                pkg.dependencies[dep] = `^${version}`
              } catch {
                if (!pkg.dependencies) pkg.dependencies = {}
                pkg.dependencies[dep] = '*'
              }
            }
          }

          if (pkg.devDependencies) {
            pkg.devDependencies = Object.fromEntries(
              Object.entries(pkg.devDependencies).sort(([a], [b]) => a.localeCompare(b)),
            )
          }

          return JSON.stringify(pkg, null, 2)
        },
      })

      actions.push(async () => {
        execSync('bun install', { stdio: 'inherit' })
        const selected = features.length > 0 ? ` with ${features.join(', ')}` : ''
        return `Package @gentleduck/${name} created at packages/duck-${name}/${selected}`
      })

      return actions
    },
  })
}
