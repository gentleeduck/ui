import { Select, Spinner, StatusMessage } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React, { memo } from 'react'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { DiffLineView } from '../components/diff-line'
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
    const file_names = diffResult?.diffs.map((d) => d.file_path) ?? []
    // 7 accounts for the " | " separator (3) + border chrome (2+2)
    const half_width = Math.floor((columns - 7) / 2)

    const status_items = [
      { key: 'j/k', label: 'scroll' },
      { key: 'n/p', label: 'next/prev hunk' },
      { key: 'tab', label: viewMode === 'unified' ? 'split view' : 'unified view' },
    ]

    if (file_names.length > 1) {
      status_items.push({ key: 'h/l', label: 'switch file' })
    }

    status_items.push({ key: 'esc', label: 'back to list' })

    if (viewMode === 'unified') {
      const current_lines = displayLinesPerFile[activeFileIndex] ?? []
      const visible = current_lines.slice(scrollOffset, scrollOffset + visibleRows)

      return (
        <Box flexDirection="column">
          <Banner compact />
          <StepIndicator current={2} total={2} label={`Diff: ${diffResult?.name ?? ''} [${viewMode}]`} />

          <FileTabs files={file_names} active_index={activeFileIndex} />

          <Box marginTop={1} flexDirection="column">
            {visible.map((line, i) => (
              <DiffLineView key={scrollOffset + i} line={line} num_width={numWidth} />
            ))}
          </Box>

          {current_lines.length > visibleRows ? (
            <Text color={THEME.mutedForeground}>
              Line {scrollOffset + 1}-{Math.min(scrollOffset + visibleRows, current_lines.length)} of{' '}
              {current_lines.length}
            </Text>
          ) : null}

          <StatusLine items={status_items} />
        </Box>
      )
    }

    // Side-by-side view
    const current_pairs = sideBySidePairsPerFile[activeFileIndex] ?? []
    const visible_pairs = current_pairs.slice(scrollOffset, scrollOffset + visibleRows)

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={2} total={2} label={`Diff: ${diffResult?.name ?? ''} [${viewMode}]`} />

        <FileTabs files={file_names} active_index={activeFileIndex} />

        <Box marginTop={1} flexDirection="column" gap={0}>
          <Box>
            <Box width={half_width}>
              <Text bold color={THEME.mutedForeground}>
                LOCAL
              </Text>
            </Box>
            <Text color={THEME.border}> | </Text>
            <Box width={half_width}>
              <Text bold color={THEME.mutedForeground}>
                REGISTRY
              </Text>
            </Box>
          </Box>
          {visible_pairs.map((pair, i) => (
            <SideBySideLine key={scrollOffset + i} pair={pair} num_width={numWidth} half_width={half_width} />
          ))}
        </Box>

        {current_pairs.length > visibleRows ? (
          <Text color={THEME.mutedForeground}>
            Line {scrollOffset + 1}-{Math.min(scrollOffset + visibleRows, current_pairs.length)} of{' '}
            {current_pairs.length}
          </Text>
        ) : null}

        <StatusLine items={status_items} />
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
