import { Select, Spinner, StatusMessage } from '@inkjs/ui'
import { Box, Text } from 'ink'
import { memo } from 'react'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { DiffLineView } from '../components/diff-line'
import { getDiffLineKey, getSideBySidePairKey } from '../components/diff-line.libs'
import { FileTabs } from '../components/file-tabs'
import { SideBySideLine } from '../components/side-by-side-line'
import { StatusLine } from '../components/status-line'
import { StepIndicator } from '../components/step-indicator'
import { useDiffKeyboard } from '../hooks/use-diff-keyboard'
import { useDiffWorkflow } from '../hooks/use-diff-workflow'

/**
 * Interactive diff viewer screen.
 *
 * Shows the difference between locally installed components
 * and their registry versions. Supports unified and side-by-side views.
 *
 * Workflow steps:
 *   loading  - scan installed components
 *   select   - pick which component to diff
 *   diffing  - compare local vs registry
 *   results  - display diff with scrolling and navigation
 *   error    - show error message
 */
export const DiffScreen = memo(function DiffScreen({ onBack }: { onBack: () => void }) {
  const workflow = useDiffWorkflow({ onBack })
  useDiffKeyboard(workflow, onBack)

  const {
    step,
    errorMessage,
    installed,
    diffResult,
    displayLinesPerFile,
    sideBySidePairsPerFile,
    scrollOffset,
    activeFileIndex,
    viewMode,
    columns,
    visibleRows,
    numWidth,
    diffTask,
    handleSelect,
  } = workflow

  // -- Loading --
  if (step === 'loading') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <Box marginTop={1}>
          <Spinner label="Scanning installed components..." />
        </Box>
      </Box>
    )
  }

  // -- Select component --
  if (step === 'select') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={1} total={2} label="Select component to diff" />
        <Box marginTop={1} flexDirection="column">
          <Text>Select a component:</Text>
          <Select options={installed.map((c) => ({ label: c.name, value: c.name }))} onChange={handleSelect} />
        </Box>
        <StatusLine
          items={[
            { key: 'j/k', label: 'navigate' },
            { key: 'enter', label: 'select' },
            { key: 'esc', label: 'back' },
          ]}
        />
      </Box>
    )
  }

  // -- Diffing (spinner) --
  if (step === 'diffing') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={2} total={2} label="Comparing" />
        <Box marginTop={1}>
          <Spinner label={diffTask.state.status === 'loading' ? diffTask.state.message : 'Comparing...'} />
        </Box>
      </Box>
    )
  }

  // -- Results --
  if (step === 'results') {
    const fileNames = diffResult?.diffs.map((d) => d.filePath) ?? []
    // 7 accounts for the " | " separator (3) + border chrome (2+2)
    const halfWidth = Math.floor((columns - 7) / 2)

    const statusItems = [
      { key: 'j/k', label: 'scroll' },
      { key: 'n/p', label: 'next/prev hunk' },
      { key: 'tab', label: viewMode === 'unified' ? 'split view' : 'unified view' },
    ]

    if (fileNames.length > 1) {
      statusItems.push({ key: 'h/l', label: 'switch file' })
    }

    statusItems.push({ key: 'esc', label: 'back to list' })

    if (viewMode === 'unified') {
      const currentLines = displayLinesPerFile[activeFileIndex] ?? []
      const visible = currentLines.slice(scrollOffset, scrollOffset + visibleRows)

      return (
        <Box flexDirection="column">
          <Banner compact />
          <StepIndicator current={2} total={2} label={`Diff: ${diffResult?.name ?? ''} [${viewMode}]`} />

          <FileTabs files={fileNames} activeIndex={activeFileIndex} />

          <Box marginTop={1} flexDirection="column">
            {visible.map((line) => (
              <DiffLineView key={getDiffLineKey(line)} line={line} numWidth={numWidth} />
            ))}
          </Box>

          {currentLines.length > visibleRows ? (
            <Text color={THEME.mutedForeground}>
              Line {scrollOffset + 1}-{Math.min(scrollOffset + visibleRows, currentLines.length)} of{' '}
              {currentLines.length}
            </Text>
          ) : null}

          <StatusLine items={statusItems} />
        </Box>
      )
    }

    // Side-by-side view
    const currentPairs = sideBySidePairsPerFile[activeFileIndex] ?? []
    const visiblePairs = currentPairs.slice(scrollOffset, scrollOffset + visibleRows)

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={2} total={2} label={`Diff: ${diffResult?.name ?? ''} [${viewMode}]`} />

        <FileTabs files={fileNames} activeIndex={activeFileIndex} />

        <Box marginTop={1} flexDirection="column" gap={0}>
          <Box>
            <Box width={halfWidth}>
              <Text bold color={THEME.mutedForeground}>
                LOCAL
              </Text>
            </Box>
            <Text color={THEME.border}> | </Text>
            <Box width={halfWidth}>
              <Text bold color={THEME.mutedForeground}>
                REGISTRY
              </Text>
            </Box>
          </Box>
          {visiblePairs.map((pair) => (
            <SideBySideLine key={getSideBySidePairKey(pair)} pair={pair} numWidth={numWidth} halfWidth={halfWidth} />
          ))}
        </Box>

        {currentPairs.length > visibleRows ? (
          <Text color={THEME.mutedForeground}>
            Line {scrollOffset + 1}-{Math.min(scrollOffset + visibleRows, currentPairs.length)} of {currentPairs.length}
          </Text>
        ) : null}

        <StatusLine items={statusItems} />
      </Box>
    )
  }

  // -- Error --
  return (
    <Box flexDirection="column">
      <Banner compact />
      <StatusMessage variant="error">{errorMessage}</StatusMessage>
      <StatusLine items={[{ key: 'esc', label: 'back' }]} />
    </Box>
  )
})
