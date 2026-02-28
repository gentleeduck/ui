import { Box, Text } from 'ink'
import React, { memo } from 'react'
import { THEME } from '../app.constants'

export const StepIndicator = memo(function StepIndicator({
  current,
  total,
  label,
}: {
  current: number
  total: number
  label: string
}) {
  return (
    <Box gap={1}>
      <Text color={THEME.foreground} bold>
        [{current}/{total}]
      </Text>
      <Text color={THEME.foreground}>{label}</Text>
    </Box>
  )
})
