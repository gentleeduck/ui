import { Select } from '@inkjs/ui'
import { Box, Text, useApp, useInput } from 'ink'
import React from 'react'
import { MENU_ITEMS, THEME } from '../app.constants'
import type { Screen } from '../app.types'
import { Banner } from '../components/banner'
import { StatusLine } from '../components/status-line'

export function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { exit } = useApp()

  useInput((input) => {
    if (input === 'q') exit()
  })

  return (
    <Box flexDirection="column">
      <Banner />
      <Box marginTop={1} />
      <Select
        options={MENU_ITEMS}
        onChange={(value) => {
          if (value === 'exit') {
            exit()
          } else {
            onNavigate(value as Screen)
          }
        }}
      />
      <StatusLine
        items={[
          { key: 'j/k', label: 'navigate' },
          { key: 'enter', label: 'select' },
          { key: 'q', label: 'quit' },
        ]}
      />
    </Box>
  )
}
