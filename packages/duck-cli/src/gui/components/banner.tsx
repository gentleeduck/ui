import { Box, Text } from 'ink'
import React, { memo, useContext, useMemo } from 'react'
import { TerminalSizeContext } from '../app'
import { generateBanner, SUBTITLE, THEME } from '../app.constants'

export const Banner = memo(function Banner({ compact }: { compact?: boolean }) {
  const { columns } = useContext(TerminalSizeContext)
  // Subtract root box chrome: border (2) + paddingX (4) = 6
  const innerWidth = Math.max(20, columns - 6)

  const banner = useMemo(() => {
    if (compact) return null
    return generateBanner(innerWidth)
  }, [compact, innerWidth])

  if (compact) {
    return (
      <Box flexDirection="column">
        <Text bold color={THEME.foreground}>
          gduck
        </Text>
        <Text color={THEME.mutedForeground}>{SUBTITLE}</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Text bold color={THEME.foreground}>
        {banner}
      </Text>
      <Text color={THEME.mutedForeground}>{SUBTITLE}</Text>
    </Box>
  )
})
