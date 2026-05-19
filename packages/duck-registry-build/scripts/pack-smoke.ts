import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageDir = path.resolve(scriptDir, '..')

function runCommand(
  command: string,
  args: string[],
  options: {
    cwd?: string
    env?: NodeJS.ProcessEnv
  } = {},
) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      env: {
        ...process.env,
        ...options.env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk)
    })

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk)
    })

    child.on('error', reject)
    child.on('close', (code) => {
      resolve({
        code: code ?? 1,
        stderr,
        stdout,
      })
    })
  })
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(tmpdir(), 'registry-build-pack-smoke-'))
  const consumerDir = path.join(tempRoot, 'consumer')
  const npmCacheDir = path.join(tempRoot, 'npm-cache')
  const tarballDir = path.join(tempRoot, 'tarballs')
  const packageNodeModulesDir = path.join(packageDir, 'node_modules')
  let tarballPath: string | null = null

  try {
    await fs.mkdir(tarballDir, { recursive: true })
    await fs.mkdir(path.join(consumerDir, 'src', 'ui', 'button'), { recursive: true })
    await fs.writeFile(
      path.join(consumerDir, 'src', 'ui', 'button', 'button.tsx'),
      'export const Button = () => null\n',
      'utf8',
    )
    await fs.writeFile(
      path.join(consumerDir, 'package.json'),
      JSON.stringify(
        {
          name: 'registry-build-pack-smoke',
          private: true,
          packageManager: 'bun@1.3.10',
          type: 'module',
        },
        null,
        2,
      ),
      'utf8',
    )
    await fs.writeFile(
      path.join(consumerDir, 'registry-build.config.ts'),
      `import { defineConfig, validateExtension } from '@gentleduck/registry-build'

export default defineConfig({
  extensions: [validateExtension()],
  output: {
    dir: './dist'
  },
  registries: {
    uis: [
      {
        name: 'button',
        root_folder: 'button',
        type: 'registry:ui'
      }
    ]
  },
  sources: {
    'registry:ui': {
      packageName: '@example/ui',
      path: './src/ui',
      referencePath: '/registry-ui/src'
    }
  },
  targetPaths: {
    'registry:ui': 'components/ui'
  }
})
`,
      'utf8',
    )

    const buildResult = await runCommand('bun', ['run', 'build'], { cwd: packageDir })
    assert.equal(buildResult.code, 0, `bun run build failed:\n${buildResult.stderr || buildResult.stdout}`)

    const packResult = await runCommand('npm', ['pack', '--silent', '--pack-destination', tarballDir], {
      cwd: packageDir,
      env: {
        HOME: tempRoot,
        npm_config_cache: npmCacheDir,
      },
    })
    assert.equal(packResult.code, 0, `npm pack failed:\n${packResult.stderr || packResult.stdout}`)

    const tarballFilename = (await fs.readdir(tarballDir)).find((entry) => entry.endsWith('.tgz'))

    assert.ok(
      tarballFilename,
      `npm pack did not return a tarball filename:\n${packResult.stdout}\n${packResult.stderr}`,
    )
    tarballPath = path.join(tarballDir, tarballFilename)

    const extractResult = await runCommand('tar', ['-xzf', tarballPath, '-C', tempRoot], { cwd: tempRoot })
    assert.equal(extractResult.code, 0, `tar extraction failed:\n${extractResult.stderr || extractResult.stdout}`)

    const packageInstallDir = path.join(consumerDir, 'node_modules', '@gentleduck', 'registry-build')
    const extractedPackageDir = path.join(tempRoot, 'package')

    await fs.mkdir(path.dirname(packageInstallDir), { recursive: true })
    await fs.rename(extractedPackageDir, packageInstallDir)

    const installedPackageJson = JSON.parse(
      await fs.readFile(path.join(packageInstallDir, 'package.json'), 'utf8'),
    ) as {
      bin?: Record<string, string>
      dependencies?: Record<string, string>
    }

    for (const dependencyName of Object.keys(installedPackageJson.dependencies ?? {})) {
      const sourcePath = path.join(packageNodeModulesDir, dependencyName)
      const targetPath = path.join(consumerDir, 'node_modules', dependencyName)

      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.symlink(sourcePath, targetPath, 'dir')
    }

    const binTarget = installedPackageJson.bin?.['registry-build']
    assert.ok(binTarget, 'Packed registry-build package is missing its CLI bin entry.')

    const binDir = path.join(consumerDir, 'node_modules', '.bin')
    const cliPath = path.join(binDir, 'registry-build')

    await fs.mkdir(binDir, { recursive: true })
    await fs.symlink(path.join(packageInstallDir, binTarget), cliPath)

    const cliResult = await runCommand(cliPath, ['build'], { cwd: consumerDir })
    assert.equal(cliResult.code, 0, `installed registry-build CLI failed:\n${cliResult.stderr || cliResult.stdout}`)

    const indexJson = JSON.parse(
      await fs.readFile(path.join(consumerDir, 'dist', 'public', 'r', 'index.json'), 'utf8'),
    ) as Array<{
      name: string
      source: string
    }>
    const componentJson = JSON.parse(
      await fs.readFile(path.join(consumerDir, 'dist', 'public', 'r', 'components', 'button.json'), 'utf8'),
    ) as {
      files: Array<{ target: string }>
      source: string
    }

    assert.deepEqual(
      indexJson.map((entry) => entry.name),
      ['button'],
    )
    assert.equal(indexJson[0]?.source, '/registry-ui/src/button')
    assert.equal(componentJson.source, '/registry-ui/src/button')
    assert.equal(componentJson.files[0]?.target, 'components/ui/button.tsx')

    console.log('Packed install smoke test passed.')
  } finally {
    await fs.rm(tempRoot, { force: true, recursive: true })

    if (tarballPath) {
      await fs.rm(tarballPath, { force: true })
    }
  }
}

await main()
