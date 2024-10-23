import {
  IGNORED_DIRECTORIES,
  tailwindCssInstallationGuide
} from '../get-project-info/get-project-info.constants'
import { logger } from '../logger'
import fs from 'fs-extra'
import path from 'path'
import fg from 'fast-glob'

// Check if TypeScript is installed
export async function checkTypeScriptInstalled(cwd: string) {
  return fs.pathExists(path.resolve(cwd, 'tsconfig.json'))
}

// Check if TailwindCss is installed
export async function checkTailwindCssInstalled(cwd: string) {
  const tailwindcss = fg.globSync('tailwind.config.*', {
    cwd,
    deep: 3,
    ignore: IGNORED_DIRECTORIES
  })

  if (!tailwindcss.length) {
    logger.error(`TailwindCss is not configured in this directory.`).break()
    logger.info(...Object.values(tailwindCssInstallationGuide)).break()
  }

  return true
}

// Check if the working directory exists
export function checkDirectoryExist(cwd: string): typeof logger | undefined {
  if (!fs.lstatSync(cwd).isDirectory()) {
    return logger.error(`The working directory ${cwd} does not exist.`)
  }
}

// Check if the project is valid
export function checkProjectIsValid(cwd: string): void {
  // Check if the cwd exists && it's a directory
  checkDirectoryExist(cwd)

  // Check TailwindCss is configured
  checkTailwindCssInstalled(cwd)
}
