import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { execa } from 'execa'
import fs from 'fs-extra'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { VITE_CONFIG_CONTENT } from './compile-benchmark.constants'
import type { CompileFileParams } from './compile-benchmark.types'

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
  const execaError = error as { shortMessage?: unknown; stderr?: unknown }

  const shortMessage = typeof execaError?.shortMessage === 'string' ? execaError.shortMessage : ''
  const stderr = typeof execaError?.stderr === 'string' ? execaError.stderr.trim() : ''
  const message = formatUnknownError(error)

  return [shortMessage, stderr, message].filter(Boolean).join('\n')
}

export async function compileFile({ file, spinner, cwd }: CompileFileParams) {
  if (!isTsOrTsxFile(file.name)) {
    return { bundleSize: 0, compileTimeMs: 0 }
  }

  const outDir = path.join('dist', file.name.replace(/\.(ts|tsx)$/, '.js'))
  const start = performance.now()

  const tempConfigPath = path.resolve(cwd, `vite.temp.config.ts`)

  try {
    spinner.text = `Compiling ${file.name}`
    fs.writeFileSync(tempConfigPath, VITE_CONFIG_CONTENT({ fileInfo: file }))

    await execa('vite', ['build', '--config', path.resolve(cwd, 'vite.temp.config.ts')], {
      cwd: cwd,
      preferLocal: true,
    })

    const compileTimeMs = performance.now() - start
    const bundleSize = fs.existsSync(`${cwd}/${outDir}`) ? fs.statSync(`${cwd}/${outDir}`).size : 12

    spinner.text = `Compiled ${file.name} in ${compileTimeMs.toFixed(2)}ms (${(bundleSize / 1024).toFixed(2)}kb)`
    return {
      bundleSize,
      compileTimeMs,
    }
  } catch (error) {
    spinner.fail(`Failed to compile ${file.name}\n${formatExecaError(error)}`)
    return {
      bundleSize: 0,
      compileTimeMs: performance.now() - start,
      errors: [error],
    }
  } finally {
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath)
    }
  }
}

export async function renderFile({ file, spinner, cwd }: CompileFileParams) {
  if (!isRenderableComponentFile(file.name)) {
    return { renderTimeMs: 0 }
  }

  try {
    const builtFilePath = path.resolve(cwd, 'dist', file.name.replace(/\.(tsx|jsx)$/, '.js'))
    if (!fs.existsSync(builtFilePath)) {
      spinner.warn(`Built file not found for ${file.path}`)
      return { renderTimeMs: 0 }
    }

    const builtFileUrl = pathToFileURL(builtFilePath).href

    const module = await import(builtFileUrl)
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
