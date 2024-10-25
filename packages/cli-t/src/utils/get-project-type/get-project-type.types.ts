import { ProjectTypeEnum } from './get-project-type.constants'

export interface Detector {
  type: keyof typeof ProjectTypeEnum
  detect: (cwd: string) => Promise<boolean>
}

export type ProjectType = keyof typeof ProjectTypeEnum
