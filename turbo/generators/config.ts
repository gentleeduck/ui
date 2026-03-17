import { execSync } from 'node:child_process'
import type { PlopTypes } from '@turbo/gen'

interface PackageJson {
  name: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
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
        type: 'input',
        name: 'deps',
        message: 'Extra dependencies (space-separated, or leave empty):',
      },
    ],
    actions: [
      // Sanitize name
      (answers) => {
        if ('name' in answers && typeof answers.name === 'string') {
          answers.name = answers.name.replace('@gentleduck/', '').replace('duck-', '')
        }
        return 'Config sanitized'
      },
      // Scaffold files
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
      // Install extra deps if provided
      {
        type: 'modify',
        path: 'packages/duck-{{ name }}/package.json',
        async transform(content, answers) {
          if ('deps' in answers && typeof answers.deps === 'string' && answers.deps.trim()) {
            const pkg = JSON.parse(content) as PackageJson
            for (const dep of answers.deps.split(' ').filter(Boolean)) {
              // Workspace deps
              if (dep.startsWith('@gentleduck/')) {
                if (!pkg.devDependencies) pkg.devDependencies = {}
                pkg.devDependencies[dep] = 'workspace:*'
                continue
              }
              // npm deps — fetch latest version
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
            return JSON.stringify(pkg, null, 2)
          }
          return content
        },
      },
      // Install and format
      async (answers) => {
        if ('name' in answers && typeof answers.name === 'string') {
          execSync('bun install', { stdio: 'inherit' })
          return `Package @gentleduck/${answers.name} created at packages/duck-${answers.name}/`
        }
        return 'Package not created'
      },
    ],
  })
}
