import fs from 'fs-extra'
import { logger } from '../text-styling'

// Check if the working directory exists
export function checkDirectoryExist(cwd: string): typeof logger | undefined {
  if (!fs.lstatSync(cwd).isDirectory()) {
    return logger.error({
      args: [`The working directory ${cwd} does not exist.`],
    })
  }
}
