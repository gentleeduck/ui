import { IGNORED_DIRECTORIES } from '../get-project-info/get-project-info.constants'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { highlighter, logger } from '../text-styling'
import { Ora } from 'ora'

// Check if the working directory exists
export function checkDirectoryExist(cwd: string): typeof logger | undefined {
  if (!fs.lstatSync(cwd).isDirectory()) {
    return logger.error({
      args: [`The working directory ${cwd} does not exist.`],
    })
  }
}

// Check if the project is valid
export function checkProjectIsValid(cwd: string, spinner: Ora): void {
  // Check if the cwd exists && it's a directory
  checkDirectoryExist(cwd)

  // Check TailwindCss is configured
  // checkTailwindCssInstalled(cwd, spinner)
}
