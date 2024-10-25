import fg from 'fast-glob'
import { Detector } from './get-project-type.types'
import { IGNORED_DIRECTORIES } from '../get-project-info'

// Detect NextJs
export const detectNextJs: Detector = {
  type: 'NEXT_JS',
  detect: async (cwd: string) => {
    const files = await fg.glob('**/*', {
      cwd,
      deep: 3,
      ignore: IGNORED_DIRECTORIES
    })

    const is_nextjs = files.find((file) => file.includes('next.config'))

    if (is_nextjs) return true
    return false
  }
}
