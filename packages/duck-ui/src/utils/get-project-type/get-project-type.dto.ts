import { z } from 'zod'
import { enumToArray } from '../transformers'
import { ProjectTypeEnum } from './get-project-type.constants'

export const project_types = enumToArray(ProjectTypeEnum)

export const project_types_schema = z.enum([...(project_types as [string, ...string[]])])

export type ProjectType = ProjectTypeEnum
