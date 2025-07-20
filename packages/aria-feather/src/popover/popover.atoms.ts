import { atom } from '@gentleduck/state/primitive'

export const popoverOpen = atom(false)
export const popoverRefs = atom<{
  trigger: HTMLElement | HTMLButtonElement | null
  content: HTMLDivElement | null
  wrapper: HTMLDivElement | null
  arrow: HTMLDivElement | null
}>({ trigger: null, content: null, wrapper: null, arrow: null })
