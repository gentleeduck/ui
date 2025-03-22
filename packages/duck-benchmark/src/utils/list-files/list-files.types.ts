import { Ora } from 'ora'

export interface ListFilesOptions {
  cwds: string[]
  depth?: number
  filter?: string[]
  spinner: Ora
}
