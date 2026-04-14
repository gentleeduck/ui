import { Box, Text } from 'ink'
import { memo } from 'react'
import type { Diff } from '~/utils/diff-format'
import { THEME } from '../app.constants'
import { getConflictMarkerColor } from './conflict-markers'
import { getRenderableDiffSegments } from './diff-line.libs'

type DiffLineProps = {
  line: Diff.DisplayLine
  numWidth: number
  singleNum?: boolean
}

/**
 * Renders a single unified diff line with syntax highlighting and word-level highlights.
 * Supports dual-gutter (old+new line numbers) and single-gutter modes.
 */
export const DiffLineView = memo(function DiffLineView({ line, numWidth, singleNum }: DiffLineProps) {
  const markerColor = getConflictMarkerColor(line.rawText)
  if (markerColor) {
    return (
      <Box>
        <Text bold color={markerColor}>
          {line.rawText}
        </Text>
      </Box>
    )
  }

  if (line.type === 'file-header') {
    return (
      <Box>
        <Text bold color={THEME.foreground}>
          {line.rawText}
        </Text>
      </Box>
    )
  }

  if (line.type === 'hunk-header') {
    return (
      <Box>
        <Text color={THEME.ring}>{line.rawText}</Text>
      </Box>
    )
  }

  const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '

  const baseColor =
    line.type === 'add' ? THEME.success : line.type === 'remove' ? THEME.destructive : THEME.mutedForeground
  const renderableSegments = getRenderableDiffSegments(line.segments)

  if (singleNum) {
    const num = line.newLineNum ?? line.oldLineNum
    const numStr = num !== null ? String(num).padStart(numWidth) : ' '.repeat(numWidth)

    return (
      <Box>
        <Text color={THEME.mutedForeground}>{numStr} </Text>
        <Text color={baseColor}>{prefix} </Text>
        {renderableSegments.map((seg) => {
          if (seg.highlight) {
            return (
              <Text
                key={seg.key}
                color={line.type === 'remove' ? 'white' : 'black'}
                backgroundColor={line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined}>
                {seg.text}
              </Text>
            )
          }

          return (
            <Text key={seg.key} color={seg.color ?? baseColor}>
              {seg.text}
            </Text>
          )
        })}
      </Box>
    )
  }

  const oldNum = line.oldLineNum !== null ? String(line.oldLineNum).padStart(numWidth) : ' '.repeat(numWidth)
  const newNum = line.newLineNum !== null ? String(line.newLineNum).padStart(numWidth) : ' '.repeat(numWidth)

  return (
    <Box>
      <Text color={THEME.mutedForeground}>
        {oldNum} {newNum}{' '}
      </Text>
      <Text color={baseColor}>{prefix} </Text>
      {renderableSegments.map((seg) => {
        if (seg.highlight) {
          return (
            <Text
              key={seg.key}
              color={line.type === 'remove' ? 'white' : 'black'}
              backgroundColor={line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined}>
              {seg.text}
            </Text>
          )
        }

        return (
          <Text key={seg.key} color={seg.color ?? baseColor}>
            {seg.text}
          </Text>
        )
      })}
    </Box>
  )
})
