import { Box, Text } from 'ink'
import React, { memo } from 'react'
import type { MergeHunk } from '~/utils/merge'
import { THEME } from '../app.constants'

type MergeHunkViewProps = {
  hunk: MergeHunk
  is_active: boolean
  num_width: number
  hunk_number: number
  total_hunks: number
}

const CHOICE_LABELS: Record<string, string> = {
  local: 'LOCAL',
  registry: 'REGISTRY',
  both: 'BOTH',
  pending: '???',
}

const CHOICE_COLORS: Record<string, string> = {
  local: THEME.destructive,
  registry: THEME.success,
  both: THEME.warning,
  pending: THEME.mutedForeground,
}

/**
 * Renders a single merge hunk with git-style conflict markers.
 * Shows context lines, local (removed) lines, and registry (added) lines.
 * The active hunk is highlighted with >>. The unchosen side is dimmed.
 */
export const MergeHunkView = memo(function MergeHunkView({
  hunk,
  is_active,
  num_width,
  hunk_number,
  total_hunks,
}: MergeHunkViewProps) {
  const choice_label = CHOICE_LABELS[hunk.choice] ?? '???'
  const choice_color = CHOICE_COLORS[hunk.choice] ?? THEME.mutedForeground
  const gutter = ''.padStart(num_width)

  const is_local_dimmed = hunk.choice === 'registry'
  const is_registry_dimmed = hunk.choice === 'local'

  const local_lines = hunk.display_lines.filter((dl) => dl.type === 'remove')
  const registry_lines = hunk.display_lines.filter((dl) => dl.type === 'add')

  return (
    <Box flexDirection="column">
      {/* Hunk header */}
      <Box>
        <Text color={is_active ? THEME.ring : THEME.mutedForeground} bold={is_active}>
          {is_active ? '>>' : '  '} Hunk {hunk_number}/{total_hunks} [
          <Text color={choice_color} bold>
            {choice_label}
          </Text>
          ]
        </Text>
      </Box>

      {/* Context before */}
      {hunk.context_before.map((ctx, i) => {
        const line_num = hunk.old_start - hunk.context_before.length + i
        return (
          <Box key={`ctx-before-${i}`}>
            <Text color={THEME.mutedForeground}>
              {'  '}
              {String(line_num).padStart(num_width)} {'|'}
              {'  '}
              {ctx}
            </Text>
          </Box>
        )
      })}

      {/* <<<<<<< LOCAL marker */}
      <Box>
        <Text color={THEME.ring} bold>
          {'  '}
          {gutter} {'|'} {'<'.repeat(7)} LOCAL
        </Text>
      </Box>

      {/* Local (removed) lines */}
      {local_lines.length > 0 ? (
        local_lines.map((dl, i) => {
          const line_num = dl.old_line_num !== null ? String(dl.old_line_num).padStart(num_width) : gutter
          return (
            <Box key={`local-${i}`}>
              <Text dimColor={is_local_dimmed}>
                <Text color={THEME.mutedForeground}>
                  {'  '}
                  {line_num} {'|'}
                </Text>
                <Text color={THEME.destructive}> - </Text>
                {dl.segments.map((seg, j) => (
                  <Text
                    key={j}
                    color={seg.highlight ? 'white' : THEME.destructive}
                    backgroundColor={seg.highlight ? 'red' : undefined}>
                    {seg.text}
                  </Text>
                ))}
              </Text>
            </Box>
          )
        })
      ) : (
        <Box>
          <Text color={THEME.mutedForeground} dimColor>
            {'  '}
            {gutter} {'|'}
            {'   '}
            (no local content)
          </Text>
        </Box>
      )}

      {/* ======= separator */}
      <Box>
        <Text color={THEME.ring} bold>
          {'  '}
          {gutter} {'|'} {'='.repeat(7)}
        </Text>
      </Box>

      {/* Registry (added) lines */}
      {registry_lines.length > 0 ? (
        registry_lines.map((dl, i) => {
          const line_num = dl.new_line_num !== null ? String(dl.new_line_num).padStart(num_width) : gutter
          return (
            <Box key={`registry-${i}`}>
              <Text dimColor={is_registry_dimmed}>
                <Text color={THEME.mutedForeground}>
                  {'  '}
                  {line_num} {'|'}
                </Text>
                <Text color={THEME.success}> + </Text>
                {dl.segments.map((seg, j) => (
                  <Text
                    key={j}
                    color={seg.highlight ? 'black' : THEME.success}
                    backgroundColor={seg.highlight ? 'green' : undefined}>
                    {seg.text}
                  </Text>
                ))}
              </Text>
            </Box>
          )
        })
      ) : (
        <Box>
          <Text color={THEME.mutedForeground} dimColor>
            {'  '}
            {gutter} {'|'}
            {'   '}
            (removed in registry)
          </Text>
        </Box>
      )}

      {/* >>>>>>> REGISTRY marker */}
      <Box>
        <Text color={THEME.ring} bold>
          {'  '}
          {gutter} {'|'} {'>'.repeat(7)} REGISTRY
        </Text>
      </Box>

      {/* Context after */}
      {hunk.context_after.map((ctx, i) => {
        const line_num = hunk.old_start + hunk.old_lines + i
        return (
          <Box key={`ctx-after-${i}`}>
            <Text color={THEME.mutedForeground}>
              {'  '}
              {String(line_num).padStart(num_width)} {'|'}
              {'  '}
              {ctx}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
})
