import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import { getPackageManager } from '../../get-package-manager'
import { highlighter } from '../../text-styling'
import { TYPESCRIPT_DEPENDENCIES, tsConfigGeneric, tsConfigNextjs } from './preflight-typescript.constants'

/** Throws on failure; the outer `preflightConfigs` → command-action wrapper handles the exit. */
export async function installTypescript(cwd: string, spinner: Ora) {
  spinner.text = `Installing ${highlighter.info('TypeScript')}...`

  const packageManager = await getPackageManager(cwd)

  const { failed: installationStep1 } = await execa(
    packageManager,
    [packageManager === 'npm' ? 'install' : 'add', ...TYPESCRIPT_DEPENDENCIES, '-D'],
    { cwd },
  )
  if (installationStep1) {
    throw new Error('Failed to install TypeScript dependencies')
  }
}

// Add Typescript config
export async function addingTypescriptConfig(cwd: string, spinner: Ora, projectType?: string) {
  spinner.text = `Adding ${highlighter.info('TypeScript')} config...`

  const template = projectType === 'NEXT_JS' ? tsConfigNextjs : tsConfigGeneric
  await fs.writeFile(path.join(cwd, 'tsconfig.json'), template, 'utf-8')
}
