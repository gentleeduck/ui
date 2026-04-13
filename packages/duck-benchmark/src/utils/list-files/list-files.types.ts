import { Ora } from 'ora'

export interface IListFilesOptions {
  cwds: string[]
  depth?: number
  filter?: string[]
  spinner: Ora
}
