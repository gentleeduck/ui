import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { execa } from 'execa'
import fs from 'fs-extra'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { VITE_CONFIG_CONTENT } from './compile-benchmark.constants'
import { CompileFileParams } from './compile-benchmark.types'

function isTsOrTsxFile(filename: string) {
  return /\.(ts|tsx)$/i.test(filename)
}

function isRenderableComponentFile(filename: string) {
  return /\.(tsx|jsx)$/i.test(filename)
}

function formatUnknownError(error: unknown) {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

function formatExecaError(error: unknown) {
  const anyError = error as any

  const shortMessage = typeof anyError?.shortMessage === 'string' ? anyError.shortMessage : ''
  const stderr = typeof anyError?.stderr === 'string' ? anyError.stderr.trim() : ''
  const message = formatUnknownError(error)

  return [shortMessage, stderr, message].filter(Boolean).join('\n')
}

export async function compile_file({ file, spinner, cwd }: CompileFileParams) {
  if (!isTsOrTsxFile(file.name)) {
    return { bundle_size: 0, compile_time_ms: 0 }
  }

  const out_dir = path.join('dist', file.name.replace(/\.(ts|tsx)$/, '.js'))
  const start = performance.now()

  const temp_config_path = path.resolve(cwd, `vite.temp.config.ts`)

  try {
    spinner.text = `Compiling ${file.name}`
    fs.writeFileSync(temp_config_path, VITE_CONFIG_CONTENT({ fileInfo: file }))

    await execa('vite', ['build', '--config', path.resolve(cwd, 'vite.temp.config.ts')], {
      cwd: cwd,
      preferLocal: true,
    })

    const compile_time_ms = performance.now() - start
    const bundle_size = fs.existsSync(`${cwd}/${out_dir}`) ? fs.statSync(`${cwd}/${out_dir}`).size : 12

    spinner.text = `Compiled ${file.name} in ${compile_time_ms.toFixed(2)}ms (${(bundle_size / 1024).toFixed(2)}kb)`
    return {
      bundle_size,
      compile_time_ms,
    }
  } catch (error) {
    spinner.fail(`Failed to compile ${file.name}\n${formatExecaError(error)}`)
    return {
      bundle_size: 0,
      compile_time_ms: performance.now() - start,
      errors: [error],
    }
  } finally {
    if (fs.existsSync(temp_config_path)) {
      fs.unlinkSync(temp_config_path)
    }
  }
}

export async function render_file({ file, spinner, cwd }: CompileFileParams) {
  if (!isRenderableComponentFile(file.name)) {
    return { renderTimeMs: 0 }
  }

  try {
    const built_file_path = path.resolve(cwd, 'dist', file.name.replace(/\.(tsx|jsx)$/, '.js'))
    if (!fs.existsSync(built_file_path)) {
      spinner.warn(`Built file not found for ${file.path}`)
      return { renderTimeMs: 0 }
    }

    const built_file_url = pathToFileURL(built_file_path).href

    const module = await import(built_file_url)
    const Component = module.default

    if (!Component) {
      spinner.warn(`No default export found in ${file.path}`)
      return { renderTimeMs: 0 }
    }

    const start = performance.now()
    const html = renderToString(<Component />)
    const renderTimeMs = performance.now() - start

    spinner.text = `Rendered ${file.name} in ${renderTimeMs}ms`

    return {
      renderedHtml: html,
      renderTimeMs,
    }
  } catch (error) {
    spinner.fail(`Failed to import or render ${file.path}\n${formatUnknownError(error)}`)
    return {
      errors: [error],
      renderTimeMs: 0,
    }
  }
}
