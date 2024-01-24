import { detectNextJs } from './get-project-type.lib'

export enum ProjectTypeEnum {
  NEXT_JS = 'Next.js',
  VITE = 'Vite',
  CREATE_REACT_APP = 'Create React App',
  UNKNOWN = 'Unknown',
}

// Gather all detectors in a single array
export const detectors = [detectNextJs]
