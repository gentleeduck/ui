import { Box, Text } from 'ink'
import { memo } from 'react'
import type { Merge } from '~/utils/merge'
import { THEME } from '../app.constants'
import { getRenderableDiffSegments } from './diff-line.libs'

type MergeHunkViewProps = {
  hunk: Merge.Hunk
  isActive: boolean
  numWidth: number
  hunkNumber: number
  totalHunks: number
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

/** Renders a single merge hunk with git-style conflict markers; the unchosen side is dimmed. */
export const MergeHunkView = memo(function MergeHunkView({
  hunk,
  isActive,
  numWidth,
  hunkNumber,
  totalHunks,
}: MergeHunkViewProps) {
  const choiceLabel = CHOICE_LABELS[hunk.choice] ?? '???'
  const choiceColor = CHOICE_COLORS[hunk.choice] ?? THEME.mutedForeground
  const gutter = ''.padStart(numWidth)

  const isLocalDimmed = hunk.choice === 'registry'
  const isRegistryDimmed = hunk.choice === 'local'

  const localLines = hunk.displayLines.filter((dl) => dl.type === 'remove')
  const registryLines = hunk.displayLines.filter((dl) => dl.type === 'add')

  return (
    <Box flexDirection="column">
      {/* Hunk header */}
      <Box>
        <Text color={isActive ? THEME.ring : THEME.mutedForeground} bold={isActive}>
          {isActive ? '>>' : '  '} Hunk {hunkNumber}/{totalHunks} [
          <Text color={choiceColor} bold>
            {choiceLabel}
          </Text>
          ]
        </Text>
      </Box>

      {/* Context before */}
      {hunk.contextBefore.map((ctx, i) => {
        const lineNum = hunk.oldStart - hunk.contextBefore.length + i
        return (
          <Box key={`ctx-before-${lineNum}-${ctx}`}>
            <Text color={THEME.mutedForeground}>
              {'  '}
              {String(lineNum).padStart(numWidth)} {'|'}
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
      {localLines.length > 0 ? (
        localLines.map((dl) => {
          const lineNum = dl.oldLineNum !== null ? String(dl.oldLineNum).padStart(numWidth) : gutter
          const renderableSegments = getRenderableDiffSegments(dl.segments)
          return (
            <Box key={`local-${dl.oldLineNum ?? 'null'}-${dl.rawText}`}>
              <Text dimColor={isLocalDimmed}>
                <Text color={THEME.mutedForeground}>
                  {'  '}
                  {lineNum} {'|'}
                </Text>
                <Text color={THEME.destructive}> - </Text>
                {renderableSegments.map((seg) => (
                  <Text
                    key={seg.key}
                    color={seg.highlight ? 'white' : THEME.destructive}
                    {...(seg.highlight ? { backgroundColor: 'red' as const } : {})}>
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
      {registryLines.length > 0 ? (
        registryLines.map((dl) => {
          const lineNum = dl.newLineNum !== null ? String(dl.newLineNum).padStart(numWidth) : gutter
          const renderableSegments = getRenderableDiffSegments(dl.segments)
          return (
            <Box key={`registry-${dl.newLineNum ?? 'null'}-${dl.rawText}`}>
              <Text dimColor={isRegistryDimmed}>
                <Text color={THEME.mutedForeground}>
                  {'  '}
                  {lineNum} {'|'}
                </Text>
                <Text color={THEME.success}> + </Text>
                {renderableSegments.map((seg) => (
                  <Text
                    key={seg.key}
                    color={seg.highlight ? 'black' : THEME.success}
                    {...(seg.highlight ? { backgroundColor: 'green' as const } : {})}>
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
      {hunk.contextAfter.map((ctx, i) => {
        const lineNum = hunk.oldStart + hunk.oldLines + i
        return (
          <Box key={`ctx-after-${lineNum}-${ctx}`}>
            <Text color={THEME.mutedForeground}>
              {'  '}
              {String(lineNum).padStart(numWidth)} {'|'}
              {'  '}
              {ctx}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
})
