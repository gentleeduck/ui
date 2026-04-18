import { Box, render, useApp } from 'ink'
import { createContext, useCallback, useMemo } from 'react'
import type { Merge } from '~/utils/merge'
import { THEME } from './app.constants'
import type { AppProps, GuiLaunchOptions } from './app.types'
import type { ITerminalSize } from './hooks/use-terminal-size'
import { useTerminalSize } from './hooks/use-terminal-size'
import { DiffScreen } from './screens/diff-screen'
import { MergeScreen } from './screens/merge-screen'
import { VimStdin } from './vim-stdin'

export type { GuiLaunchOptions } from './app.types'

export const VimContext = createContext<{ setEnabled: (v: boolean) => void }>({
  setEnabled: () => {},
})

export const TerminalSizeContext = createContext<ITerminalSize>({
  columns: 80,
  rows: 24,
})

export const InitialArgsContext = createContext<string[]>([])

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
    (results: Merge.Result[]) => {
      if (onComplete) {
        onComplete(results)
      }
    },
    [onComplete],
  )

  const activeScreen = screen ?? 'diff'

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
            {activeScreen === 'merge' ? (
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

function enterAltScreen() {
  process.stdout.write('\x1b[?1049h')
}

function leaveAltScreen() {
  process.stdout.write('\x1b[?1049l')
}

export function launchGui(options?: GuiLaunchOptions) {
  enterAltScreen()
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
    { stdin: vimStdin.asInkStdin() },
  )
  instance.waitUntilExit().then(() => {
    instance.clear()
    leaveAltScreen()
    process.exit(0)
  })
}

/**
 * Launch merge GUI and wait for it to complete.
 * Returns Merge.Result[] if the user confirmed, or null if aborted.
 * Used by CLI commands (add/update) to integrate merge into headless flows.
 */
export function launchMergeGuiAndWait(mergeData: Merge.ComponentState): Promise<Merge.Result[] | null> {
  return new Promise((resolve) => {
    let resolved = false

    enterAltScreen()
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
      { stdin: vimStdin.asInkStdin() },
    )

    instance.waitUntilExit().then(() => {
      instance.clear()
      leaveAltScreen()
      vimStdin.unpipe()
      if (!resolved) {
        resolve(null)
      }
    })
  })
}
