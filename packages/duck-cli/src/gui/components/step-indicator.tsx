import { Box, Text } from 'ink'
import { memo } from 'react'
import { THEME } from '../app.constants'

/** Step progress indicator showing [current/total] with a descriptive label. */
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
