import { Select, Spinner, StatusMessage } from '@inkjs/ui'
import { Box, Text, useInput } from 'ink'
import React, { memo, useContext, useEffect, useState } from 'react'
import {
  build_display_lines,
  build_side_by_side_pairs,
  get_hunk_offsets,
  get_max_line_number,
} from '~/utils/diff-format'
import { InitialArgsContext, TerminalSizeContext } from '../app'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { DiffLineView } from '../components/diff-line'
import { FileTabs } from '../components/file-tabs'
import { SideBySideLine } from '../components/side-by-side-line'
import { StatusLine } from '../components/status-line'
import { StepIndicator } from '../components/step-indicator'
import { useAsyncTask } from '../hooks/use-async-task'
import {
  type ComponentDiff,
  diff_component,
  type InstalledComponent,
  resolve_write_type_path,
  scan_installed_components,
} from '~/services/component.service'
import { resolve_install_path } from '~/services/install.service'
import { read_duckui_config, read_ts_config } from '~/services/preflight.service'
import type { DiffDisplayLine, SideBySidePair, ViewMode } from './diff-screen.types'

type Step = 'loading' | 'select' | 'diffing' | 'results' | 'error'

const RESULTS_CHROME = 14

export const DiffScreen = memo(function DiffScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('loading')
  const [installed, setInstalled] = useState<InstalledComponent[]>([])
  const [diffResult, setDiffResult] = useState<ComponentDiff | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const diffTask = useAsyncTask<ComponentDiff>()
  const { rows, columns } = useContext(TerminalSizeContext)
  const initialArgs = useContext(InitialArgsContext)
  const visibleRows = Math.max(3, rows - RESULTS_CHROME)

  // Enhanced diff state
  const [viewMode, setViewMode] = useState<ViewMode>('unified')
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [displayLinesPerFile, setDisplayLinesPerFile] = useState<DiffDisplayLine[][]>([])
  const [sideBySidePairsPerFile, setSideBySidePairsPerFile] = useState<SideBySidePair[][]>([])
  const [hunkOffsetsPerFile, setHunkOffsetsPerFile] = useState<number[][]>([])
  const [numWidth, setNumWidth] = useState(3)
  const [autoSelected, setAutoSelected] = useState(false)

  useEffect(() => {
    const load = async () => {
      const cwd = process.cwd()

      const configResult = await read_duckui_config(cwd)
      if (!configResult.ok) {
        setErrorMessage(configResult.error)
        setStep('error')
        return
      }

      const tsResult = await read_ts_config(cwd)
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

      const write_type_path = resolve_write_type_path(configResult.data, pathResult.data)
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
  }, [])

  // Auto-select component from --gui initial args
  useEffect(() => {
    if (initialArgs.length > 0 && installed.length > 0 && step === 'select' && !autoSelected) {
      const match = installed.find((c) => c.name.toLowerCase() === initialArgs[0].toLowerCase())
      if (match) {
        setAutoSelected(true)
        handleSelect(match.name)
      }
    }
  }, [installed, step, initialArgs, autoSelected])

  useInput((input, key) => {
    if (step === 'results') {
      if (key.escape) {
        setScrollOffset(0)
        setActiveFileIndex(0)
        setStep('select')
        return
      }

      // Scroll
      if (key.upArrow || input === 'k') {
        setScrollOffset((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.downArrow || input === 'j') {
        const total_lines =
          viewMode === 'unified'
            ? (displayLinesPerFile[activeFileIndex]?.length ?? 0)
            : (sideBySidePairsPerFile[activeFileIndex]?.length ?? 0)
        setScrollOffset((prev) => Math.min(Math.max(0, total_lines - visibleRows), prev + 1))
        return
      }

      // Toggle view mode
      if (key.tab) {
        setViewMode((prev) => (prev === 'unified' ? 'side-by-side' : 'unified'))
        setScrollOffset(0)
        return
      }

      // Hunk navigation
      if (input === 'n') {
        const offsets = hunkOffsetsPerFile[activeFileIndex] ?? []
        const next = offsets.find((o) => o > scrollOffset)
        if (next !== undefined) {
          setScrollOffset(next)
        }
        return
      }
      if (input === 'p') {
        const offsets = hunkOffsetsPerFile[activeFileIndex] ?? []
        const candidates = offsets.filter((o) => o < scrollOffset)
        if (candidates.length > 0) {
          setScrollOffset(candidates[candidates.length - 1])
        }
        return
      }

      // File tab navigation
      if (key.leftArrow || input === 'h') {
        if (activeFileIndex > 0) {
          setActiveFileIndex((prev) => prev - 1)
          setScrollOffset(0)
        }
        return
      }
      if (key.rightArrow || input === 'l') {
        const max_index = (diffResult?.diffs.length ?? 1) - 1
        if (activeFileIndex < max_index) {
          setActiveFileIndex((prev) => prev + 1)
          setScrollOffset(0)
        }
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

    if (step === 'error') {
      if (key.escape) {
        onBack()
        return
      }
    }
  })

  const handleSelect = async (name: string) => {
    setStep('diffing')
    const comp = installed.find((c) => c.name === name)
    if (!comp) {
      setErrorMessage(`Component "${name}" not found.`)
      setStep('error')
      return
    }

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
      setDiffResult(result.data)

      if (result.data.is_identical) {
        const identical_lines: DiffDisplayLine[] = [
          {
            type: 'file-header',
            old_line_num: null,
            new_line_num: null,
            segments: [{ text: `${name}: identical to registry`, highlight: false }],
            raw_text: `${name}: identical to registry`,
          },
        ]
        setDisplayLinesPerFile([identical_lines])
        setSideBySidePairsPerFile([[{ left: identical_lines[0], right: identical_lines[0] }]])
        setHunkOffsetsPerFile([[]])
        setNumWidth(3)
      } else {
        const all_display_lines: DiffDisplayLine[][] = []
        const all_sbs_pairs: SideBySidePair[][] = []
        const all_hunk_offsets: number[][] = []
        let max_num = 0

        for (const fd of result.data.diffs) {
          const lines = build_display_lines(fd.file_path, fd.local_content, fd.registry_content)
          const file_max = get_max_line_number(lines)
          if (file_max > max_num) max_num = file_max

          all_display_lines.push(lines)
          all_sbs_pairs.push(build_side_by_side_pairs(lines))
          all_hunk_offsets.push(get_hunk_offsets(lines))
        }

        setDisplayLinesPerFile(all_display_lines)
        setSideBySidePairsPerFile(all_sbs_pairs)
        setHunkOffsetsPerFile(all_hunk_offsets)
        setNumWidth(Math.max(String(max_num).length, 3))
      }

      setActiveFileIndex(0)
      setScrollOffset(0)
      setStep('results')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

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

  if (step === 'results') {
    const file_names = diffResult?.diffs.map((d) => d.file_path) ?? []
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

  return (
    <Box flexDirection="column">
      <Banner compact />
      <StatusMessage variant="error">{errorMessage}</StatusMessage>
      <StatusLine items={[{ key: 'esc', label: 'back' }]} />
    </Box>
  )
})
