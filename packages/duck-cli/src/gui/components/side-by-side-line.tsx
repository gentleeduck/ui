import { Box, Text } from 'ink'
import { memo } from 'react'
import type { Diff } from '~/utils/diff-format'
import { THEME } from '../app.constants'
import { getConflictMarkerColor } from './conflict-markers'
import { getRenderableDiffSegments } from './diff-line.libs'

type SideBySideLineProps = {
  pair: Diff.SideBySidePair
  numWidth: number
  halfWidth: number
}

function renderSide(line: Diff.DisplayLine | null, numWidth: number, side: 'left' | 'right') {
  if (!line) {
    return null
  }

  const markerColor = getConflictMarkerColor(line.rawText)
  if (markerColor) {
    return (
      <Text bold color={markerColor}>
        {line.rawText}
      </Text>
    )
  }

  if (line.type === 'file-header') {
    return (
      <Text bold color={THEME.foreground}>
        {line.rawText}
      </Text>
    )
  }

  if (line.type === 'hunk-header') {
    return <Text color={THEME.ring}>{line.rawText}</Text>
  }

  const lineNum = side === 'left' ? line.oldLineNum : line.newLineNum
  const numStr = lineNum !== null ? String(lineNum).padStart(numWidth) : ' '.repeat(numWidth)

  const baseColor =
    line.type === 'add' ? THEME.success : line.type === 'remove' ? THEME.destructive : THEME.mutedForeground
  const renderableSegments = getRenderableDiffSegments(line.segments)

  return (
    <>
      <Text color={THEME.mutedForeground}>{numStr} </Text>
      {renderableSegments.map((seg) => (
        <Text
          key={seg.key}
          color={seg.highlight ? (line.type === 'remove' ? 'white' : 'black') : baseColor}
          backgroundColor={
            seg.highlight ? (line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined) : undefined
          }>
          {seg.text}
        </Text>
      ))}
    </>
  )
}

/** Renders a side-by-side diff pair with line number gutter on each side. */
export const SideBySideLine = memo(function SideBySideLine({ pair, numWidth, halfWidth }: SideBySideLineProps) {
  return (
    <Box>
      <Box width={halfWidth}>{renderSide(pair.left, numWidth, 'left')}</Box>
      <Text color={THEME.border}> | </Text>
      <Box width={halfWidth}>{renderSide(pair.right, numWidth, 'right')}</Box>
    </Box>
  )
})
