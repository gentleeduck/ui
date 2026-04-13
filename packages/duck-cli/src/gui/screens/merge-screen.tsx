import { Select, Spinner, StatusMessage } from '@inkjs/ui'
import { Box, Text } from 'ink'
import { memo } from 'react'
import type { Merge } from '~/utils/merge'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { DiffLineView } from '../components/diff-line'
import { getDiffLineKey } from '../components/diff-line.libs'
import { FileTabs } from '../components/file-tabs'
import { MergeHunkView } from '../components/merge-hunk-view'
import { MergeSummary } from '../components/merge-summary'
import { StatusLine } from '../components/status-line'
import { StepIndicator } from '../components/step-indicator'
import { useMergeKeyboard } from '../hooks/use-merge-keyboard'
import { useMergeWorkflow } from '../hooks/use-merge-workflow'

type MergeScreenProps = {
  mergeData?: Merge.ComponentState
  onBack: () => void
  onComplete?: (results: Merge.Result[]) => void
}

/**
 * Interactive merge conflict resolution screen.
 *
 * Workflow steps:
 *   loading  - scan installed components
 *   select   - pick which component to merge
 *   diffing  - compare local vs registry
 *   resolving - resolve hunks one by one (1=local, 2=registry, 3=both)
 *   summary  - review merged preview before writing
 *   writing  - write files to disk
 *   done     - show results
 *   error    - show error message
 */
export const MergeScreen = memo(function MergeScreen({ mergeData, onBack, onComplete }: MergeScreenProps) {
  const workflow = useMergeWorkflow({ mergeData, onBack, onComplete })
  useMergeKeyboard(workflow, onBack)

  const {
    step,
    errorMessage,
    installed,
    mergeState,
    activeFileIndex,
    activeHunkIndex,
    activeFile,
    activeHunks,
    totalHunks,
    allResolved,
    scrollOffset,
    summaryVisibleRows,
    writeResults,
    highlightedPreview,
    diffTask,
    writeTask,
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
        <StepIndicator current={1} total={3} label="Select component to merge" />
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
        <StepIndicator current={2} total={3} label="Computing diff" />
        <Box marginTop={1}>
          <Spinner label={diffTask.state.status === 'loading' ? diffTask.state.message : 'Comparing...'} />
        </Box>
      </Box>
    )
  }

  // -- Resolving hunks --
  if (step === 'resolving' && mergeState) {
    const fileNames = mergeState.files.map((f) => {
      if (f.status === 'added') return `${f.filePath} [NEW]`
      if (f.status === 'deleted') {
        const tag = f.fileChoice === 'pending' ? '???' : f.fileChoice === 'keep' ? 'KEEP' : 'REMOVE'
        return `${f.filePath} [${tag}]`
      }
      const resolvedCount = f.hunks.filter((h) => h.choice !== 'pending').length
      return `${f.filePath} [${resolvedCount}/${f.hunks.length}]`
    })

    const pendingCount = mergeState.files.reduce((acc, f) => {
      if (f.status === 'deleted') return acc + (f.fileChoice === 'pending' ? 1 : 0)
      return acc + f.hunks.filter((h) => h.choice === 'pending').length
    }, 0)

    const statusItems = [
      { key: '1', label: activeFile?.status === 'deleted' ? 'keep' : 'local' },
      { key: '2', label: activeFile?.status === 'deleted' ? 'remove' : 'registry' },
    ]

    if (activeFile?.status !== 'deleted') {
      statusItems.push({ key: '3', label: 'both' })
    }

    statusItems.push(
      { key: 'n/j', label: 'next hunk' },
      { key: 'p/k', label: 'prev hunk' },
      { key: 'N', label: 'prev unresolved' },
      { key: 'P', label: 'next unresolved' },
      { key: 'h/l', label: 'switch file' },
    )

    if (allResolved) {
      statusItems.push({ key: 'enter', label: 'confirm' })
    }

    statusItems.push({ key: 'esc', label: 'abort' })

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={2} total={3} label={`Merge: ${mergeState.name} (${pendingCount} unresolved)`} />

        <FileTabs files={fileNames} activeIndex={activeFileIndex} />

        <Box marginTop={1} flexDirection="column">
          {activeFile?.status === 'added' && (
            <Box flexDirection="column">
              <Text color={THEME.success} bold>
                New file from registry (auto-accepted)
              </Text>
              <Text color={THEME.mutedForeground}>{activeFile.filePath}</Text>
            </Box>
          )}

          {activeFile?.status === 'deleted' && (
            <Box flexDirection="column">
              <Text color={THEME.warning} bold>
                File exists locally but not in registry
              </Text>
              <Text color={THEME.mutedForeground}>{activeFile.filePath}</Text>
              <Box marginTop={1}>
                <Text>
                  Choice:{' '}
                  {activeFile.fileChoice === 'pending' ? (
                    <Text color={THEME.mutedForeground}>[???] Press 1 to keep, 2 to remove</Text>
                  ) : activeFile.fileChoice === 'keep' ? (
                    <Text color={THEME.success}>[KEEP]</Text>
                  ) : (
                    <Text color={THEME.destructive}>[REMOVE]</Text>
                  )}
                </Text>
              </Box>
            </Box>
          )}

          {activeFile?.status === 'modified' && activeHunks.length > 0 && (
            <Box flexDirection="column">
              {activeHunks.map((hunk, i) => (
                <Box key={hunk.index} marginBottom={1}>
                  <MergeHunkView
                    hunk={hunk}
                    isActive={i === activeHunkIndex}
                    numWidth={4}
                    hunkNumber={i + 1}
                    totalHunks={totalHunks}
                  />
                </Box>
              ))}
            </Box>
          )}

          {activeFile?.status === 'modified' && activeHunks.length === 0 && (
            <Text color={THEME.mutedForeground}>No changes in this file.</Text>
          )}
        </Box>

        {allResolved && (
          <Box marginTop={1}>
            <Text color={THEME.success} bold>
              All conflicts resolved! Press enter to review and confirm.
            </Text>
          </Box>
        )}

        <StatusLine items={statusItems} />
      </Box>
    )
  }

  // -- Summary / review --
  if (step === 'summary' && mergeState) {
    const previewFile = mergeState.files.find((f) => f.status === 'modified')
    const previewLines = highlightedPreview
    const visiblePreview = previewLines.slice(scrollOffset, scrollOffset + summaryVisibleRows)

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={3} total={3} label="Review merge" />

        <Box marginTop={1}>
          <MergeSummary mergeState={mergeState} />
        </Box>

        {previewLines.length > 0 && (
          <Box marginTop={1} flexDirection="column">
            <Text bold color={THEME.foreground}>
              Preview ({previewFile?.filePath}):
            </Text>
            {visiblePreview.map((line) => (
              <DiffLineView key={getDiffLineKey(line)} line={line} numWidth={4} singleNum />
            ))}
            {previewLines.length > summaryVisibleRows && (
              <Text color={THEME.mutedForeground}>
                Line {scrollOffset + 1}-{Math.min(scrollOffset + summaryVisibleRows, previewLines.length)} of{' '}
                {previewLines.length}
              </Text>
            )}
          </Box>
        )}

        <StatusLine
          items={[
            { key: 'j/k', label: 'scroll preview' },
            { key: 'enter', label: 'confirm write' },
            { key: 'esc', label: 'back to resolve' },
          ]}
        />
      </Box>
    )
  }

  // -- Writing --
  if (step === 'writing') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <Box marginTop={1}>
          <Spinner label={writeTask.state.status === 'loading' ? writeTask.state.message : 'Writing files...'} />
        </Box>
      </Box>
    )
  }

  // -- Done --
  if (step === 'done') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <StatusMessage variant="success">
          Merge complete! {writeResults.filter((r) => r.action === 'write').length} files written
          {writeResults.filter((r) => r.action === 'delete').length > 0 &&
            `, ${writeResults.filter((r) => r.action === 'delete').length} deleted`}
          {writeResults.filter((r) => r.action === 'skip').length > 0 &&
            `, ${writeResults.filter((r) => r.action === 'skip').length} skipped`}
        </StatusMessage>
        <StatusLine items={[{ key: 'esc/enter', label: 'exit' }]} />
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
