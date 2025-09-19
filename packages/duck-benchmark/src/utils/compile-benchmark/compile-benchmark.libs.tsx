import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { execa } from 'execa'
import fs from 'fs-extra'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { VITE_CONFIG_CONTENT } from './compile-benchmark.constants'
import { CompileFileParams } from './compile-benchmark.types'

export async function compile_file({ file, spinner, cwd }: CompileFileParams) {
  const out_dir = path.join('dist', file.name.replace(/\.(ts|tsx)$/, '.js'))
  const start = performance.now()

  try {
    const temp_config_path = path.resolve(cwd, `vite.temp.config.ts`)

    spinner.text = `Compiling ${file.name}`
    fs.writeFileSync(temp_config_path, VITE_CONFIG_CONTENT({ fileInfo: file }))

    await execa('vite', ['build', '--config', path.resolve(cwd, 'vite.temp.config.ts')], {
      cwd: cwd,
      stdio: 'ignore',
    })

    // Remove the temporary config after build
    fs.unlinkSync(temp_config_path)

    const compile_time_ms = performance.now() - start
    const bundle_size = fs.existsSync(`${cwd}/${out_dir}`) ? fs.statSync(`${cwd}/${out_dir}`).size : 12

    spinner.text = `Compiled ${file.name} in ${compile_time_ms.toFixed(2)}ms (${(bundle_size / 1024).toFixed(2)}kb)`
    return {
      bundle_size,
      compile_time_ms,
    }
  } catch (error) {
    spinner.fail(`Failed to compile ${file.name}`)
    return {
      bundle_size: 0,
      compile_time_ms: performance.now() - start,
      errors: [error || error],
    }
  }
}

export async function render_file({ file, spinner, cwd }: CompileFileParams) {
  try {
    // Dynamically import the component
    const module = await import(`${cwd}/${file.path}`)
    const Component = module.default

    if (!Component) {
      spinner.warn(`No default export found in ${file.path}`)
    }

    // Measure render time
    const start = performance.now()
    const html = renderToString(<Component />)

    spinner.text = `Rendered ${file.name} in ${performance.now() - start}ms`

    return {
      renderedHtml: html,
      renderTimeMs: performance.now() - start,
    }
  } catch (error) {
    spinner.fail(`Failed to import or render ${file.path}: ${error}`)
    return {
      errors: [error || error],
      renderTimeMs: 0,
    }
  }
}
