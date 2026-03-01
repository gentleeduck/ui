import { Box, render, useApp } from 'ink'
import React, { createContext, useCallback, useMemo } from 'react'
import type { ComponentMergeState, MergeResult } from '~/utils/merge'
import { THEME } from './app.constants'
import type { TerminalSize } from './hooks/use-terminal-size'
import { useTerminalSize } from './hooks/use-terminal-size'
import { DiffScreen } from './screens/diff-screen'
import { MergeScreen } from './screens/merge-screen'
import { VimStdin } from './vim-stdin'

export type GuiLaunchOptions = {
  initialArgs?: string[]
  screen?: 'diff' | 'merge'
  mergeData?: ComponentMergeState
  onComplete?: (results: MergeResult[]) => void
}

export const VimContext = createContext<{ setEnabled: (v: boolean) => void }>({
  setEnabled: () => {},
})

export const TerminalSizeContext = createContext<TerminalSize>({
  columns: 80,
  rows: 24,
})

export const InitialArgsContext = createContext<string[]>([])

type AppProps = {
  vimStdin: VimStdin
  initialArgs?: string[]
  screen?: 'diff' | 'merge'
  mergeData?: ComponentMergeState
  onComplete?: (results: MergeResult[]) => void
}

function App({ vimStdin, initialArgs, screen, mergeData, onComplete }: AppProps) {
  const size = useTerminalSize()
  const { exit } = useApp()

  const vimContext = useMemo(
    () => ({
      setEnabled: (v: boolean) => {
        vimStdin.enabled = v
      },
    }),
    [vimStdin],
  )

  const handleBack = useCallback(() => {
    exit()
  }, [exit])

  const handleMergeComplete = useCallback(
    (results: MergeResult[]) => {
      if (onComplete) {
        onComplete(results)
      }
    },
    [onComplete],
  )

  const active_screen = screen ?? 'diff'

  return (
    <TerminalSizeContext.Provider value={size}>
      <VimContext.Provider value={vimContext}>
        <InitialArgsContext.Provider value={initialArgs ?? []}>
          <Box
            width={size.columns}
            height={size.rows}
            borderStyle="round"
            borderColor={THEME.border}
            paddingX={2}
            paddingY={1}
            flexDirection="column"
            overflow="hidden">
            {active_screen === 'merge' ? (
              <MergeScreen mergeData={mergeData} onBack={handleBack} onComplete={handleMergeComplete} />
            ) : (
              <DiffScreen onBack={handleBack} />
            )}
          </Box>
        </InitialArgsContext.Provider>
      </VimContext.Provider>
    </TerminalSizeContext.Provider>
  )
}

export function launch_gui(options?: GuiLaunchOptions) {
  const vimStdin = new VimStdin()
  process.stdin.pipe(vimStdin)
  const instance = render(
    <App
      vimStdin={vimStdin}
      initialArgs={options?.initialArgs}
      screen={options?.screen}
      mergeData={options?.mergeData}
      onComplete={options?.onComplete}
    />,
    { stdin: vimStdin },
  )
  instance.waitUntilExit().then(() => {
    instance.clear()
  })
}

/**
 * Launch merge GUI and wait for it to complete.
 * Returns MergeResult[] if the user confirmed, or null if aborted.
 * Used by CLI commands (add/update) to integrate merge into headless flows.
 */
export function launch_merge_gui_and_wait(mergeData: ComponentMergeState): Promise<MergeResult[] | null> {
  return new Promise((resolve) => {
    let resolved = false

    const vimStdin = new VimStdin()
    process.stdin.pipe(vimStdin)

    const instance = render(
      <App
        vimStdin={vimStdin}
        screen="merge"
        mergeData={mergeData}
        onComplete={(results) => {
          resolved = true
          resolve(results)
        }}
      />,
      { stdin: vimStdin },
    )

    instance.waitUntilExit().then(() => {
      instance.clear()
      vimStdin.unpipe()
      if (!resolved) {
        resolve(null)
      }
    })
  })
}
