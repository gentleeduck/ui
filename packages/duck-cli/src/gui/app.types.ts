import type { Merge } from '~/utils/merge'
import type { VimStdin } from './vim-stdin'

export type GuiLaunchOptions = {
  initialArgs?: string[] | undefined
  screen?: 'diff' | 'merge' | undefined
  mergeData?: Merge.ComponentState | undefined
  onComplete?: ((results: Merge.Result[]) => void) | undefined
}

export type AppProps = {
  vimStdin: VimStdin
  initialArgs?: string[] | undefined
  screen?: 'diff' | 'merge' | undefined
  mergeData?: Merge.ComponentState | undefined
  onComplete?: ((results: Merge.Result[]) => void) | undefined
}
