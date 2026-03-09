import { Box, Text } from 'ink'
import { memo } from 'react'
import { THEME } from '../app.constants'

/** Bottom status bar showing keyboard shortcuts as [key] label pairs. */
export const StatusLine = memo(function StatusLine({ items }: { items: { key: string; label: string }[] }) {
  return (
    <Box marginTop={1} gap={2}>
      {items.map((item) => (
        <Box key={item.key} gap={1}>
          <Text bold color={THEME.ring}>
            [{item.key}]
          </Text>
          <Text color={THEME.mutedForeground}>{item.label}</Text>
        </Box>
      ))}
    </Box>
  )
})
