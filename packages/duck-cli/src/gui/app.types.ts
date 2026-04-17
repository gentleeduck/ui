import type { Merge } from '~/utils/merge'
import type { VimStdin } from './vim-stdin'

/**
 * Options for launching the GUI.
 * Controls which screen to show and what data to pre-populate.
 */
export type GuiLaunchOptions = {
  initialArgs?: string[] | undefined
  screen?: 'diff' | 'merge' | undefined
  mergeData?: Merge.ComponentState | undefined
  onComplete?: ((results: Merge.Result[]) => void) | undefined
}

/**
 * Internal props for the root App component.
 * Combines GUI launch options with the VimStdin instance
 * needed for keyboard input translation.
 */
export type AppProps = {
  vimStdin: VimStdin
  initialArgs?: string[] | undefined
  screen?: 'diff' | 'merge' | undefined
  mergeData?: Merge.ComponentState | undefined
  onComplete?: ((results: Merge.Result[]) => void) | undefined
}
