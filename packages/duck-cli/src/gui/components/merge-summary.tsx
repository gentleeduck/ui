import { Box, Text } from 'ink'
import React, { memo } from 'react'
import type { ComponentMergeState } from '~/utils/merge'
import { THEME } from '../app.constants'

type MergeSummaryProps = {
  merge_state: ComponentMergeState
}

export const MergeSummary = memo(function MergeSummary({ merge_state }: MergeSummaryProps) {
  let total_hunks = 0
  let local_count = 0
  let registry_count = 0
  let both_count = 0

  for (const file of merge_state.files) {
    for (const hunk of file.hunks) {
      total_hunks++
      if (hunk.choice === 'local') local_count++
      else if (hunk.choice === 'registry') registry_count++
      else if (hunk.choice === 'both') both_count++
    }
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={THEME.foreground}>
        Merge Summary: {merge_state.name}
      </Text>

      <Box flexDirection="column">
        {merge_state.files.map((file) => {
          if (file.status === 'added') {
            return (
              <Box key={file.file_path} gap={1}>
                <Text color={THEME.success}>[NEW]</Text>
                <Text>{file.file_path}</Text>
              </Box>
            )
          }

          if (file.status === 'deleted') {
            const tag = file.file_choice === 'remove' ? 'REMOVE' : 'KEEP'
            const color = file.file_choice === 'remove' ? THEME.destructive : THEME.success
            return (
              <Box key={file.file_path} gap={1}>
                <Text color={color}>[{tag}]</Text>
                <Text>{file.file_path}</Text>
              </Box>
            )
          }

          // Modified
          const file_local = file.hunks.filter((h) => h.choice === 'local').length
          const file_registry = file.hunks.filter((h) => h.choice === 'registry').length
          const file_both = file.hunks.filter((h) => h.choice === 'both').length
          const parts: string[] = []
          if (file_local > 0) parts.push(`${file_local} local`)
          if (file_registry > 0) parts.push(`${file_registry} registry`)
          if (file_both > 0) parts.push(`${file_both} both`)

          return (
            <Box key={file.file_path} gap={1}>
              <Text color={THEME.warning}>[MERGE]</Text>
              <Text>{file.file_path}</Text>
              <Text color={THEME.mutedForeground}>
                ({file.hunks.length} hunks -- {parts.join(', ')})
              </Text>
            </Box>
          )
        })}
      </Box>

      <Box gap={2}>
        <Text color={THEME.mutedForeground}>
          Total: {merge_state.files.length} files, {total_hunks} hunks
        </Text>
        {local_count > 0 && <Text color={THEME.destructive}>{local_count} local</Text>}
        {registry_count > 0 && <Text color={THEME.success}>{registry_count} registry</Text>}
        {both_count > 0 && <Text color={THEME.warning}>{both_count} both</Text>}
      </Box>
    </Box>
  )
})
