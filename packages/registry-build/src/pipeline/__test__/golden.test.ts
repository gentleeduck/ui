import fs from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, test } from 'bun:test'
import { build } from '../..'

const fixtureDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../__fixtures__/golden/basic')
const packageSourceUrl = new URL('../../index.ts', import.meta.url).href
const tempDirs: string[] = []

async function createTempDir() {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'registry-build-golden-'))
  tempDirs.push(tempDir)
  return tempDir
}

async function collectFiles(rootDir: string, currentDir = rootDir): Promise<string[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)
    const relativePath = path.relative(rootDir, fullPath)

    if (relativePath === '.registry-build' || relativePath.startsWith('.registry-build/')) {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootDir, fullPath)))
      continue
    }

    files.push(relativePath)
  }

  return files.sort()
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { force: true, recursive: true })))
})

describe('registry build golden outputs', () => {
  test('build output matches the checked-in golden fixture tree', async () => {
    const tempDir = await createTempDir()
    const actualOutputDir = path.join(tempDir, 'dist')
    const expectedOutputDir = path.join(fixtureDir, 'expected')

    await fs.cp(path.join(fixtureDir, 'sources'), path.join(tempDir, 'sources'), { recursive: true })
    await fs.writeFile(
      path.join(tempDir, 'registry-build.config.ts'),
      `import { colorsExtension, componentIndexExtension, validateExtension } from ${JSON.stringify(packageSourceUrl)}

export default {
  output: {
    dir: './dist'
  },
  pipeline: {
    components: true,
    index: true
  },
  extensions: [
    validateExtension(),
    componentIndexExtension({
      packageMappings: {
        'registry:example': '@example/examples'
      }
    }),
    colorsExtension({
      colors: {
        data: {
          black: '#000',
          zinc: {
            hsl: 'hsl(1,2%,3%)',
            rgb: 'rgb(1,2,3)'
          }
        }
      },
      cssTemplates: {
        baseLayerRules: '@layer base { body { color: var(--foreground); } }',
        baseStyles: '@tailwind base;\\n'
      },
      themes: {
        cssVarKeys: ['background', 'foreground'],
        data: {
          demo: {
            dark: {
              background: 'black',
              foreground: 'white'
            },
            label: 'Demo',
            light: {
              background: 'white',
              foreground: 'black'
            },
            radius: '1rem'
          }
        },
        names: ['demo']
      }
    })
  ],
  registries: {
    uis: [
      {
        files: [],
        name: 'button',
        root_folder: 'button',
        type: 'registry:ui'
      }
    ],
    examples: [
      {
        files: [],
        name: 'button-examples',
        root_folder: 'button',
        type: 'registry:example'
      }
    ]
  },
  importMappings: {
    contentRewrites: [
      {
        pattern: '@old/pkg',
        replacement: '@new/pkg'
      }
    ]
  },
  sources: {
    'registry:example': {
      indexStrategy: 'file',
      packageName: '@example/examples',
      path: './sources/examples',
      referencePath: '/registry-examples/src'
    },
    'registry:ui': {
      packageName: '@example/ui',
      path: './sources/ui',
      referencePath: '/registry-ui/src'
    }
  },
  stripVariables: ['iframeHeight', 'description'],
  targetPaths: {
    'registry:example': 'components',
    'registry:ui': 'components/ui'
  }
}
`,
      'utf8',
    )

    const result = await build({ cwd: tempDir, silent: true })
    const actualFiles = await collectFiles(actualOutputDir)
    const expectedFiles = await collectFiles(expectedOutputDir)

    expect(result.outputs.map((output) => output.name)).toEqual(['index', 'components', 'componentIndex', 'colors'])
    expect(actualFiles).toEqual(expectedFiles)

    for (const relativePath of expectedFiles) {
      const actualContent = await fs.readFile(path.join(actualOutputDir, relativePath), 'utf8')
      const expectedContent = await fs.readFile(path.join(expectedOutputDir, relativePath), 'utf8')

      if (relativePath.endsWith('.json')) {
        expect(JSON.parse(actualContent)).toEqual(JSON.parse(expectedContent))
        continue
      }

      expect(actualContent.trimEnd()).toBe(expectedContent.trimEnd())
    }
  })
})
