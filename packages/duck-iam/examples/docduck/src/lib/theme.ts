import { atomWithStorage } from 'jotai/utils'

export type Theme = 'bun' | 'light'
export const themeAtom = atomWithStorage<Theme>('docduck-theme', 'bun')
