import { Box, render } from 'ink'
import React, { createContext, useCallback, useMemo, useState } from 'react'
import { THEME } from './app.constants'
import type { Screen } from './app.types'
import type { TerminalSize } from './hooks/use-terminal-size'
import { useTerminalSize } from './hooks/use-terminal-size'
import { AddScreen } from './screens/add-screen'
import { HomeScreen } from './screens/home-screen'
import { InitScreen } from './screens/init-screen'
import { ListScreen } from './screens/list-screen'
import { VimStdin } from './vim-stdin'

export const VimContext = createContext<{ setEnabled: (v: boolean) => void }>({
  setEnabled: () => {},
})

export const TerminalSizeContext = createContext<TerminalSize>({
  columns: 80,
  rows: 24,
})

function App({ vimStdin }: { vimStdin: VimStdin }) {
  const [screen, setScreen] = useState<Screen>('home')
  const size = useTerminalSize()

  const vimContext = useMemo(
    () => ({
      setEnabled: (v: boolean) => {
        vimStdin.enabled = v
      },
    }),
    [vimStdin],
  )

  const goHome = useCallback(() => setScreen('home'), [])
  const navigate = useCallback((s: Screen) => setScreen(s), [])

  return (
    <TerminalSizeContext.Provider value={size}>
      <VimContext.Provider value={vimContext}>
        <Box
          width={size.columns}
          height={size.rows}
          borderStyle="round"
          borderColor={THEME.border}
          paddingX={2}
          paddingY={1}
          flexDirection="column"
          overflow="hidden">
          {screen === 'init' ? (
            <InitScreen onBack={goHome} />
          ) : screen === 'add' ? (
            <AddScreen onBack={goHome} />
          ) : screen === 'list' ? (
            <ListScreen onBack={goHome} />
          ) : (
            <HomeScreen onNavigate={navigate} />
          )}
        </Box>
      </VimContext.Provider>
    </TerminalSizeContext.Provider>
  )
}

export function launch_gui() {
  const vimStdin = new VimStdin()
  process.stdin.pipe(vimStdin)
  const instance = render(<App vimStdin={vimStdin} />, { stdin: vimStdin })
  instance.waitUntilExit().then(() => {
    instance.clear()
  })
}
