import type { Merge } from '~/utils/merge'
import type { VimStdin } from './vim-stdin'

/**
 * Options for launching the GUI.
 * Controls which screen to show and what data to pre-populate.
 */
export type GuiLaunchOptions = {
  initialArgs?: string[]
  screen?: 'diff' | 'merge'
  mergeData?: Merge.ComponentState
  onComplete?: (results: Merge.Result[]) => void
}

/**
 * Internal props for the root App component.
 * Combines GUI launch options with the VimStdin instance
 * needed for keyboard input translation.
 */
export type AppProps = {
  vimStdin: VimStdin
  initialArgs?: string[]
  screen?: 'diff' | 'merge'
  mergeData?: Merge.ComponentState
  onComplete?: (results: Merge.Result[]) => void
}
