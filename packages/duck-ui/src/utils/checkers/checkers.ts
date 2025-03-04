import { IGNORED_DIRECTORIES, tailwindCssInstallationGuide } from '../get-project-info/get-project-info.constants'
import fs from 'fs-extra'
import path from 'path'
import fg from 'fast-glob'
import { logger } from '../text-styling'

// Check if TailwindCss is installed
export async function checkTailwindCssInstalled(cwd: string) {
  const tailwindcss = fg.globSync('tailwind.config.*', {
    cwd,
    deep: 3,
    ignore: IGNORED_DIRECTORIES,
  })

  if (!tailwindcss.length) return false
  return true
}

// Check if the working directory exists
export function checkDirectoryExist(cwd: string): typeof logger | undefined {
  if (!fs.lstatSync(cwd).isDirectory()) {
    return logger.error({
      args: [`The working directory ${cwd} does not exist.`],
    })
  }
}

// Check if the project is valid
export function checkProjectIsValid(cwd: string): void {
  // Check if the cwd exists && it's a directory
  checkDirectoryExist(cwd)

  // Check TailwindCss is configured
  checkTailwindCssInstalled(cwd)
}
