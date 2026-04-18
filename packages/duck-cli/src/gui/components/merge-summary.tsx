import { Box, Text } from 'ink'
import { memo } from 'react'
import type { Merge } from '~/utils/merge'
import { THEME } from '../app.constants'

type MergeSummaryProps = {
  mergeState: Merge.ComponentState
}

/** Pre-write summary of all merge decisions with per-file status and aggregate counts. */
export const MergeSummary = memo(function MergeSummary({ mergeState }: MergeSummaryProps) {
  let totalHunks = 0
  let localCount = 0
  let registryCount = 0
  let bothCount = 0

  for (const file of mergeState.files) {
    for (const hunk of file.hunks) {
      totalHunks++
      if (hunk.choice === 'local') localCount++
      else if (hunk.choice === 'registry') registryCount++
      else if (hunk.choice === 'both') bothCount++
    }
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={THEME.foreground}>
        Merge Summary: {mergeState.name}
      </Text>

      <Box flexDirection="column">
        {mergeState.files.map((file) => {
          if (file.status === 'added') {
            return (
              <Box key={file.filePath} gap={1}>
                <Text color={THEME.success}>[NEW]</Text>
                <Text>{file.filePath}</Text>
              </Box>
            )
          }

          if (file.status === 'deleted') {
            const tag = file.fileChoice === 'remove' ? 'REMOVE' : 'KEEP'
            const color = file.fileChoice === 'remove' ? THEME.destructive : THEME.success
            return (
              <Box key={file.filePath} gap={1}>
                <Text color={color}>[{tag}]</Text>
                <Text>{file.filePath}</Text>
              </Box>
            )
          }

          // Modified
          const fileLocal = file.hunks.filter((h) => h.choice === 'local').length
          const fileRegistry = file.hunks.filter((h) => h.choice === 'registry').length
          const fileBoth = file.hunks.filter((h) => h.choice === 'both').length
          const parts: string[] = []
          if (fileLocal > 0) parts.push(`${fileLocal} local`)
          if (fileRegistry > 0) parts.push(`${fileRegistry} registry`)
          if (fileBoth > 0) parts.push(`${fileBoth} both`)

          return (
            <Box key={file.filePath} gap={1}>
              <Text color={THEME.warning}>[MERGE]</Text>
              <Text>{file.filePath}</Text>
              <Text color={THEME.mutedForeground}>
                ({file.hunks.length} hunks -- {parts.join(', ')})
              </Text>
            </Box>
          )
        })}
      </Box>

      <Box gap={2}>
        <Text color={THEME.mutedForeground}>
          Total: {mergeState.files.length} files, {totalHunks} hunks
        </Text>
        {localCount > 0 && <Text color={THEME.destructive}>{localCount} local</Text>}
        {registryCount > 0 && <Text color={THEME.success}>{registryCount} registry</Text>}
        {bothCount > 0 && <Text color={THEME.warning}>{bothCount} both</Text>}
      </Box>
    </Box>
  )
})
