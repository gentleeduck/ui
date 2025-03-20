import { performance } from 'node:perf_hooks'
import { FileInfo } from '../list-files'
import path from 'node:path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { VITE_CONFIG_CONTENT } from './compile-benchmark.constants'

export async function compileFile(fileInfo: FileInfo) {
  const outDir = path.join('dist', fileInfo.name.replace(/\.(ts|tsx)$/, '.js'))
  const start = performance.now()

  try {
    const projectDir = process.cwd()
    const tempConfigPath = path.resolve(projectDir, `vite.temp.config.ts`)

    fs.writeFileSync(tempConfigPath, VITE_CONFIG_CONTENT({ fileInfo }))

    await execa(
      'vite',
      ['build', '--config', path.resolve(projectDir, 'vite.temp.config.ts')],
      {
        stdio: 'ignore',
        cwd: projectDir,
      },
    )

    // Remove the temporary config after build
    fs.unlinkSync(tempConfigPath)

    const compileTimeMs = performance.now() - start
    const bundleSize = fs.existsSync(outDir) ? fs.statSync(outDir).size : 0

    return {
      compileTimeMs,
      bundleSize,
    }
  } catch (error) {
    return {
      compileTimeMs: performance.now() - start,
      bundleSize: 0,
      errors: [error || error],
    }
  }
}
