import path from 'node:path'
import { useContext, useEffect, useState } from 'react'
import {
  type ComponentDiff,
  diff_component,
  type InstalledComponent,
  resolve_write_type_path,
  scan_installed_components,
} from '~/services/component.service'
import { resolve_install_path } from '~/services/install.service'
import { read_duckui_config, read_ts_config } from '~/services/preflight.service'
import {
  build_display_lines,
  build_side_by_side_pairs,
  type DiffDisplayLine,
  get_hunk_offsets,
  get_max_line_number,
  type SideBySidePair,
} from '~/utils/diff-format'
import { resolve_project_cwd } from '~/utils/workspace'
import { InitialArgsContext, TerminalSizeContext } from '../app'
import type { ViewMode } from '../screens/diff-screen.types'
import type { AsyncTaskState } from './use-async-task'
import { useAsyncTask } from './use-async-task'

type Step = 'loading' | 'select' | 'diffing' | 'results' | 'error'

// Lines of vertical chrome (border, padding, banner, step-indicator,
// file-tabs, scroll info, status-line, margins) consumed by the
// results step. The remaining terminal rows display diff content.
const RESULTS_CHROME = 14

/**
 * All state and actions needed by the diff screen for rendering.
 */
export type DiffWorkflowState = {
  step: Step
  errorMessage: string

  installed: InstalledComponent[]

  diffResult: ComponentDiff | null
  displayLinesPerFile: DiffDisplayLine[][]
  sideBySidePairsPerFile: SideBySidePair[][]
  hunkOffsetsPerFile: number[][]
  numWidth: number

  scrollOffset: number
  activeFileIndex: number
  viewMode: ViewMode
  columns: number

  visibleRows: number

  diffTask: { state: AsyncTaskState<ComponentDiff> }

  handleSelect: (name: string) => Promise<void>
  setStep: (step: Step) => void
  setScrollOffset: (v: number | ((prev: number) => number)) => void
  setActiveFileIndex: (v: number | ((prev: number) => number)) => void
  setViewMode: (v: ViewMode | ((prev: ViewMode) => ViewMode)) => void
}

/**
 * Hook that encapsulates all state management, side effects, and
 * action handlers for the diff screen workflow.
 *
 * The diff screen follows a multi-step state machine:
 *   loading -> select -> diffing -> results | error
 */
export function useDiffWorkflow(options: { onBack: () => void }): DiffWorkflowState {
  const [step, setStep] = useState<Step>('loading')
  const [installed, setInstalled] = useState<InstalledComponent[]>([])
  const [diffResult, setDiffResult] = useState<ComponentDiff | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const diffTask = useAsyncTask<ComponentDiff>()
  const { rows, columns } = useContext(TerminalSizeContext)
  const initialArgs = useContext(InitialArgsContext)
  const visibleRows = Math.max(3, rows - RESULTS_CHROME)

  const [viewMode, setViewMode] = useState<ViewMode>('unified')
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [displayLinesPerFile, setDisplayLinesPerFile] = useState<DiffDisplayLine[][]>([])
  const [sideBySidePairsPerFile, setSideBySidePairsPerFile] = useState<SideBySidePair[][]>([])
  const [hunkOffsetsPerFile, setHunkOffsetsPerFile] = useState<number[][]>([])
  const [numWidth, setNumWidth] = useState(3)
  const [autoSelected, setAutoSelected] = useState(false)

  // -- Loading: scan installed components --
  useEffect(() => {
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

  // Auto-select component from CLI initial args
  useEffect(() => {
    if (initialArgs.length > 0 && installed.length > 0 && step === 'select' && !autoSelected) {
      const match = installed.find((c) => c.name.toLowerCase() === initialArgs[0].toLowerCase())
      if (match) {
        setAutoSelected(true)
        handleSelect(match.name)
      }
    }
  }, [installed, step, initialArgs, autoSelected])

  /** Diff the selected component against the registry. */
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
        // Show a simple "identical" message as a file-header line
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
        // Build display lines, side-by-side pairs, and hunk offsets per file
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

  return {
    step,
    errorMessage,
    installed,
    diffResult,
    displayLinesPerFile,
    sideBySidePairsPerFile,
    hunkOffsetsPerFile,
    numWidth,
    scrollOffset,
    activeFileIndex,
    viewMode,
    columns,
    visibleRows,
    diffTask,
    handleSelect,
    setStep,
    setScrollOffset,
    setActiveFileIndex,
    setViewMode,
  }
}
