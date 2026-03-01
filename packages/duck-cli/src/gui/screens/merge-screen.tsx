import path from 'node:path'
import { Select, Spinner, StatusMessage } from '@inkjs/ui'
import { Box, Text, useInput } from 'ink'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import {
  type ComponentDiff,
  diff_component,
  type InstalledComponent,
  resolve_write_type_path,
  scan_installed_components,
} from '~/services/component.service'
import { resolve_install_path } from '~/services/install.service'
import { build_component_merge_state, write_merge_results } from '~/services/merge.service'
import { read_duckui_config, read_ts_config } from '~/services/preflight.service'
import type { ComponentMergeState, FileMergeState, HunkChoice, MergeResult } from '~/utils/merge'
import { build_merge_preview_lines } from '~/utils/merge'
import { resolve_project_cwd } from '~/utils/workspace'
import { InitialArgsContext, TerminalSizeContext } from '../app'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { DiffLineView } from '../components/diff-line'
import { FileTabs } from '../components/file-tabs'
import { MergeHunkView } from '../components/merge-hunk-view'
import { MergeSummary } from '../components/merge-summary'
import { StatusLine } from '../components/status-line'
import { StepIndicator } from '../components/step-indicator'
import { useAsyncTask } from '../hooks/use-async-task'
import type { MergeStep } from './merge-screen.types'

const RESOLVING_CHROME = 14
const SUMMARY_CHROME = 16

type MergeScreenProps = {
  mergeData?: ComponentMergeState
  onBack: () => void
  onComplete?: (results: MergeResult[]) => void
}

export const MergeScreen = memo(function MergeScreen({ mergeData, onBack, onComplete }: MergeScreenProps) {
  const [step, setStep] = useState<MergeStep>(mergeData ? 'resolving' : 'loading')
  const [installed, setInstalled] = useState<InstalledComponent[]>([])
  const [mergeState, setMergeState] = useState<ComponentMergeState | null>(mergeData ?? null)
  const [errorMessage, setErrorMessage] = useState('')
  const [scrollOffset, setScrollOffset] = useState(0)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [activeHunkIndex, setActiveHunkIndex] = useState(0)
  const [writeResults, setWriteResults] = useState<MergeResult[]>([])
  const [autoSelected, setAutoSelected] = useState(false)

  const diffTask = useAsyncTask<ComponentDiff>()
  const writeTask = useAsyncTask<MergeResult[]>()
  const { rows, columns } = useContext(TerminalSizeContext)
  const initialArgs = useContext(InitialArgsContext)

  const visibleRows = Math.max(3, rows - RESOLVING_CHROME)
  const summaryVisibleRows = Math.max(3, rows - SUMMARY_CHROME)

  // Resolve write path state for merge-from-select flow
  const [writePath, setWritePath] = useState('')
  const [rootFolder, setRootFolder] = useState('')

  // -- Loading step: scan installed components --
  useEffect(() => {
    if (step !== 'loading') return

    const load = async () => {
      const cwd = process.cwd()

      const configResult = await read_duckui_config(cwd)
      if (!configResult.ok) {
        setErrorMessage(configResult.error)
        setStep('error')
        return
      }

      const project_cwd = resolve_project_cwd(cwd, configResult.data)
      const tsResult = await read_ts_config(project_cwd)
      if (!tsResult.ok) {
        setErrorMessage(tsResult.error)
        setStep('error')
        return
      }

      const pathResult = resolve_install_path(configResult.data, tsResult.data)
      if (!pathResult.ok) {
        setErrorMessage(pathResult.error)
        setStep('error')
        return
      }

      const write_type_path = resolve_write_type_path(configResult.data, path.resolve(project_cwd, pathResult.data))
      setWritePath(write_type_path)

      const scanResult = await scan_installed_components(write_type_path)
      if (!scanResult.ok) {
        setErrorMessage(scanResult.error)
        setStep('error')
        return
      }

      if (scanResult.data.length === 0) {
        setErrorMessage('No installed components found.')
        setStep('error')
        return
      }

      setInstalled(scanResult.data)
      setStep('select')
    }

    load()
  }, [step])

  // Auto-select from initial args
  useEffect(() => {
    if (initialArgs.length > 0 && installed.length > 0 && step === 'select' && !autoSelected) {
      const match = installed.find((c) => c.name.toLowerCase() === initialArgs[0].toLowerCase())
      if (match) {
        setAutoSelected(true)
        handleSelect(match.name)
      }
    }
  }, [installed, step, initialArgs, autoSelected])

  // -- Helpers --

  const active_file = mergeState?.files[activeFileIndex] ?? null
  const active_hunks = active_file?.hunks ?? []
  const active_hunk = active_hunks[activeHunkIndex] ?? null
  const total_hunks = active_hunks.length

  const all_resolved = mergeState
    ? mergeState.files.every((f) => {
        if (f.status === 'deleted') return f.file_choice !== 'pending'
        if (f.status === 'added') return true
        return f.hunks.every((h) => h.choice !== 'pending')
      })
    : false

  const update_hunk_choice = useCallback(
    (choice: HunkChoice) => {
      if (!mergeState || !active_file || active_file.status !== 'modified') return

      const new_files = [...mergeState.files]
      const file = { ...new_files[activeFileIndex] }
      const new_hunks = [...file.hunks]
      new_hunks[activeHunkIndex] = { ...new_hunks[activeHunkIndex], choice }
      file.hunks = new_hunks
      file.is_resolved = new_hunks.every((h) => h.choice !== 'pending')
      new_files[activeFileIndex] = file

      setMergeState({ ...mergeState, files: new_files })
    },
    [mergeState, activeFileIndex, activeHunkIndex, active_file],
  )

  const update_file_choice = useCallback(
    (choice: 'keep' | 'remove') => {
      if (!mergeState || !active_file || active_file.status !== 'deleted') return

      const new_files = [...mergeState.files]
      const file = { ...new_files[activeFileIndex] }
      file.file_choice = choice
      file.is_resolved = true
      new_files[activeFileIndex] = file

      setMergeState({ ...mergeState, files: new_files })
    },
    [mergeState, activeFileIndex, active_file],
  )

  const find_next_unresolved = useCallback((): { fileIdx: number; hunkIdx: number } | null => {
    if (!mergeState) return null

    // Search from current position forward
    for (let fi = activeFileIndex; fi < mergeState.files.length; fi++) {
      const file = mergeState.files[fi]
      if (file.status === 'deleted' && file.file_choice === 'pending') {
        return { fileIdx: fi, hunkIdx: 0 }
      }
      if (file.status === 'modified') {
        const start_hunk = fi === activeFileIndex ? activeHunkIndex + 1 : 0
        for (let hi = start_hunk; hi < file.hunks.length; hi++) {
          if (file.hunks[hi].choice === 'pending') {
            return { fileIdx: fi, hunkIdx: hi }
          }
        }
      }
    }

    // Wrap around from beginning
    for (let fi = 0; fi <= activeFileIndex; fi++) {
      const file = mergeState.files[fi]
      if (file.status === 'deleted' && file.file_choice === 'pending') {
        return { fileIdx: fi, hunkIdx: 0 }
      }
      if (file.status === 'modified') {
        const end_hunk = fi === activeFileIndex ? activeHunkIndex : file.hunks.length
        for (let hi = 0; hi < end_hunk; hi++) {
          if (file.hunks[hi].choice === 'pending') {
            return { fileIdx: fi, hunkIdx: hi }
          }
        }
      }
    }

    return null
  }, [mergeState, activeFileIndex, activeHunkIndex])

  const find_prev_unresolved = useCallback((): { fileIdx: number; hunkIdx: number } | null => {
    if (!mergeState) return null

    // Search backwards from current position
    for (let fi = activeFileIndex; fi >= 0; fi--) {
      const file = mergeState.files[fi]
      if (file.status === 'modified') {
        const start_hunk = fi === activeFileIndex ? activeHunkIndex - 1 : file.hunks.length - 1
        for (let hi = start_hunk; hi >= 0; hi--) {
          if (file.hunks[hi].choice === 'pending') {
            return { fileIdx: fi, hunkIdx: hi }
          }
        }
      }
      if (file.status === 'deleted' && file.file_choice === 'pending' && fi !== activeFileIndex) {
        return { fileIdx: fi, hunkIdx: 0 }
      }
    }

    return null
  }, [mergeState, activeFileIndex, activeHunkIndex])

  // -- Select handler --

  const handleSelect = async (name: string) => {
    setStep('diffing')
    const comp = installed.find((c) => c.name === name)
    if (!comp) {
      setErrorMessage(`Component "${name}" not found.`)
      setStep('error')
      return
    }

    setRootFolder(comp.root_folder)

    const result = await diffTask.run(async (onProgress) => {
      onProgress(`Fetching registry version of ${name}...`)

      if (!comp.registry_entry) {
        const { get_registry_item } = await import('~/utils/get-registry')
        const entry = await get_registry_item(name)
        if (!entry) {
          return { ok: false as const, error: `Component "${name}" not found in registry.` }
        }
        comp.registry_entry = entry
      }

      onProgress('Comparing files...')
      return diff_component(comp, comp.registry_entry)
    })

    if (result.ok) {
      if (result.data.is_identical) {
        setErrorMessage(`${name}: identical to registry. Nothing to merge.`)
        setStep('error')
        return
      }

      const state = build_component_merge_state(result.data, writePath, comp.root_folder)
      setMergeState(state)
      setActiveFileIndex(0)
      setActiveHunkIndex(0)
      setScrollOffset(0)
      setStep('resolving')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  // -- Write handler --

  const handleWrite = async () => {
    if (!mergeState) return

    setStep('writing')
    const result = await writeTask.run(async (onProgress) => {
      return write_merge_results(mergeState, onProgress)
    })

    if (result.ok) {
      setWriteResults(result.data)
      if (onComplete) {
        onComplete(result.data)
      }
      setStep('done')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  // -- Keyboard input --

  useInput((input, key) => {
    if (step === 'resolving') {
      if (key.escape) {
        onBack()
        return
      }

      // File navigation
      if (key.leftArrow || input === 'h') {
        if (activeFileIndex > 0) {
          setActiveFileIndex((prev) => prev - 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }
      if (key.rightArrow || input === 'l') {
        if (mergeState && activeFileIndex < mergeState.files.length - 1) {
          setActiveFileIndex((prev) => prev + 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }

      // Hunk choice for deleted files (can re-choose anytime)
      if (active_file?.status === 'deleted') {
        if (input === '1') {
          update_file_choice('keep')
          return
        }
        if (input === '2') {
          update_file_choice('remove')
          return
        }
      }

      // Hunk choice for modified files (can re-choose anytime)
      if (active_file?.status === 'modified' && active_hunk) {
        if (input === '1') {
          update_hunk_choice('local')
          return
        }
        if (input === '2') {
          update_hunk_choice('registry')
          return
        }
        if (input === '3') {
          update_hunk_choice('both')
          return
        }
      }

      // Next hunk (n / j / down)
      if (input === 'n' || input === 'j' || key.downArrow) {
        if (active_hunks.length > 0 && activeHunkIndex < active_hunks.length - 1) {
          setActiveHunkIndex((prev) => prev + 1)
        } else if (mergeState && activeFileIndex < mergeState.files.length - 1) {
          setActiveFileIndex((prev) => prev + 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }

      // Prev hunk (p / k / up)
      if (input === 'p' || input === 'k' || key.upArrow) {
        if (activeHunkIndex > 0) {
          setActiveHunkIndex((prev) => prev - 1)
        } else if (activeFileIndex > 0) {
          const prev_file = mergeState?.files[activeFileIndex - 1]
          const last_idx = prev_file?.hunks.length ? prev_file.hunks.length - 1 : 0
          setActiveFileIndex((prev) => prev - 1)
          setActiveHunkIndex(last_idx)
          setScrollOffset(0)
        }
        return
      }

      // Prev unresolved (N)
      if (input === 'N') {
        const prev = find_prev_unresolved()
        if (prev) {
          setActiveFileIndex(prev.fileIdx)
          setActiveHunkIndex(prev.hunkIdx)
          setScrollOffset(0)
        }
        return
      }

      // Next unresolved (P)
      if (input === 'P') {
        const next = find_next_unresolved()
        if (next) {
          setActiveFileIndex(next.fileIdx)
          setActiveHunkIndex(next.hunkIdx)
          setScrollOffset(0)
        }
        return
      }

      // Proceed to summary when all resolved
      if (key.return && all_resolved) {
        setScrollOffset(0)
        setStep('summary')
        return
      }

      return
    }

    if (step === 'summary') {
      if (key.escape) {
        setStep('resolving')
        setScrollOffset(0)
        return
      }
      if (key.upArrow || input === 'k') {
        setScrollOffset((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.downArrow || input === 'j') {
        setScrollOffset((prev) => prev + 1)
        return
      }
      if (key.return) {
        handleWrite()
        return
      }
      return
    }

    if (step === 'select') {
      if (key.escape) {
        onBack()
        return
      }
    }

    if (step === 'error' || step === 'done') {
      if (key.escape || key.return) {
        onBack()
        return
      }
    }
  })

  // -- Render steps --

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

  if (step === 'resolving' && mergeState) {
    const file_names = mergeState.files.map((f) => {
      if (f.status === 'added') return `${f.file_path} [NEW]`
      if (f.status === 'deleted') {
        const tag = f.file_choice === 'pending' ? '???' : f.file_choice === 'keep' ? 'KEEP' : 'REMOVE'
        return `${f.file_path} [${tag}]`
      }
      const resolved_count = f.hunks.filter((h) => h.choice !== 'pending').length
      return `${f.file_path} [${resolved_count}/${f.hunks.length}]`
    })

    const pending_count = mergeState.files.reduce((acc, f) => {
      if (f.status === 'deleted') return acc + (f.file_choice === 'pending' ? 1 : 0)
      return acc + f.hunks.filter((h) => h.choice === 'pending').length
    }, 0)

    const status_items = [
      { key: '1', label: active_file?.status === 'deleted' ? 'keep' : 'local' },
      { key: '2', label: active_file?.status === 'deleted' ? 'remove' : 'registry' },
    ]

    if (active_file?.status !== 'deleted') {
      status_items.push({ key: '3', label: 'both' })
    }

    status_items.push(
      { key: 'n/j', label: 'next hunk' },
      { key: 'p/k', label: 'prev hunk' },
      { key: 'N', label: 'prev unresolved' },
      { key: 'P', label: 'next unresolved' },
      { key: 'h/l', label: 'switch file' },
    )

    if (all_resolved) {
      status_items.push({ key: 'enter', label: 'confirm' })
    }

    status_items.push({ key: 'esc', label: 'abort' })

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={2} total={3} label={`Merge: ${mergeState.name} (${pending_count} unresolved)`} />

        <FileTabs files={file_names} active_index={activeFileIndex} />

        <Box marginTop={1} flexDirection="column">
          {active_file?.status === 'added' && (
            <Box flexDirection="column">
              <Text color={THEME.success} bold>
                New file from registry (auto-accepted)
              </Text>
              <Text color={THEME.mutedForeground}>{active_file.file_path}</Text>
            </Box>
          )}

          {active_file?.status === 'deleted' && (
            <Box flexDirection="column">
              <Text color={THEME.warning} bold>
                File exists locally but not in registry
              </Text>
              <Text color={THEME.mutedForeground}>{active_file.file_path}</Text>
              <Box marginTop={1}>
                <Text>
                  Choice:{' '}
                  {active_file.file_choice === 'pending' ? (
                    <Text color={THEME.mutedForeground}>[???] Press 1 to keep, 2 to remove</Text>
                  ) : active_file.file_choice === 'keep' ? (
                    <Text color={THEME.success}>[KEEP]</Text>
                  ) : (
                    <Text color={THEME.destructive}>[REMOVE]</Text>
                  )}
                </Text>
              </Box>
            </Box>
          )}

          {active_file?.status === 'modified' && active_hunks.length > 0 && (
            <Box flexDirection="column">
              {active_hunks.map((hunk, i) => (
                <Box key={hunk.index} marginBottom={1}>
                  <MergeHunkView
                    hunk={hunk}
                    is_active={i === activeHunkIndex}
                    num_width={4}
                    hunk_number={i + 1}
                    total_hunks={total_hunks}
                  />
                </Box>
              ))}
            </Box>
          )}

          {active_file?.status === 'modified' && active_hunks.length === 0 && (
            <Text color={THEME.mutedForeground}>No changes in this file.</Text>
          )}
        </Box>

        {all_resolved && (
          <Box marginTop={1}>
            <Text color={THEME.success} bold>
              All conflicts resolved! Press enter to review and confirm.
            </Text>
          </Box>
        )}

        <StatusLine items={status_items} />
      </Box>
    )
  }

  if (step === 'summary' && mergeState) {
    // Build preview lines for the active file
    const preview_file = mergeState.files.find((f) => f.status === 'modified')
    const preview_lines = preview_file ? build_merge_preview_lines(preview_file.local_content, preview_file.hunks) : []
    const visible_preview = preview_lines.slice(scrollOffset, scrollOffset + summaryVisibleRows)

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={3} total={3} label="Review merge" />

        <Box marginTop={1}>
          <MergeSummary merge_state={mergeState} />
        </Box>

        {preview_lines.length > 0 && (
          <Box marginTop={1} flexDirection="column">
            <Text bold color={THEME.foreground}>
              Preview ({preview_file?.file_path}):
            </Text>
            {visible_preview.map((line, i) => (
              <DiffLineView key={scrollOffset + i} line={line} num_width={4} />
            ))}
            {preview_lines.length > summaryVisibleRows && (
              <Text color={THEME.mutedForeground}>
                Line {scrollOffset + 1}-{Math.min(scrollOffset + summaryVisibleRows, preview_lines.length)} of{' '}
                {preview_lines.length}
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

  // Error step
  return (
    <Box flexDirection="column">
      <Banner compact />
      <StatusMessage variant="error">{errorMessage}</StatusMessage>
      <StatusLine items={[{ key: 'esc', label: 'back' }]} />
    </Box>
  )
})
