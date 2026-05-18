import { atom } from 'jotai'

export const sidebarOpenAtom = atom(true)
export const activeDocIdAtom = atom<string | null>(null)
export const activeWorkspaceSlugAtom = atom<string | null>(null)
export const documentTitleAtom = atom<string | null>(null)
