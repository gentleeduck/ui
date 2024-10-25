import { detectors, ProjectTypeEnum } from './get-project-type.constants'
import { ProjectType } from './get-project-type.types'

export async function get_project_type(cwd: string): Promise<ProjectType> {
  for (const detector of detectors) {
    const isDetected = await detector.detect(cwd)
    if (isDetected) {
      return detector.type
    }
  }
  return 'UNKNOWN'
}
