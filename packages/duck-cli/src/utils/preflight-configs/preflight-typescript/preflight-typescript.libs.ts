import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import { getPackageManager } from '../../get-package-manager'
import { highlighter } from '../../text-styling'
import { tsConfigGeneric, tsConfigNextjs, typescriptDependencies } from './preflight-typescript.constants'

export async function installTypescript(cwd: string, spinner: Ora) {
  try {
    spinner.text = `Installing ${highlighter.info('TypeScript')}...`

    spinner.text = `Get ${highlighter.info('package manager')}...`
    const packageManager = await getPackageManager(cwd)

    spinner.text = `Installing ${highlighter.info('TypeScript')}...`
    const { failed: installationStep1 } = await execa(
      packageManager,
      [packageManager === 'npm' ? 'install' : 'add', ...typescriptDependencies, '-D'],
      {
        cwd: cwd,
      },
    )
    if (!installationStep1) return

    spinner.fail('Failed to install TypeScript dependencies')
    process.exit(1)
  } catch (error) {
    spinner.fail(`${highlighter.error(error instanceof Error ? error.message : String(error))}`)
    process.exit(1)
  }
}

// Add Typescript config
export async function addingTypescriptConfig(cwd: string, spinner: Ora, projectType?: string) {
  spinner.text = `Adding ${highlighter.info('TypeScript')} config...`

  const template = projectType === 'NEXT_JS' ? tsConfigNextjs : tsConfigGeneric
  await fs.writeFile(path.join(cwd, 'tsconfig.json'), template, 'utf-8')
}
