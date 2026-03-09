import path from 'node:path'
import { useCallback, useContext, useEffect, useState } from 'react'
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
import { highlight_diff_lines, warm_highlighter } from '~/services/syntax-highlight.service'
import type { DiffDisplayLine } from '~/utils/diff-format'
import type { ComponentMergeState, FileMergeState, HunkChoice, MergeHunk, MergeResult } from '~/utils/merge'
import { build_merge_preview_lines } from '~/utils/merge'
import { resolve_project_cwd } from '~/utils/workspace'
import { InitialArgsContext, TerminalSizeContext } from '../app'
import type { MergeStep } from '../screens/merge-screen.types'
import type { AsyncTaskState } from './use-async-task'
import { useAsyncTask } from './use-async-task'

// Lines of vertical chrome (border, padding, banner, step-indicator,
// file-tabs, status-line, margins) consumed by the resolving step.
// The remaining terminal rows display scrollable hunk content.
const RESOLVING_CHROME = 14

// Same purpose as RESOLVING_CHROME but for the summary step, which has
// slightly more fixed elements (summary box + preview header).
const SUMMARY_CHROME = 16

/**
 * All state and actions needed by the merge screen for rendering.
 */
export type MergeWorkflowState = {
  step: MergeStep
  errorMessage: string

  installed: InstalledComponent[]

  mergeState: ComponentMergeState | null
  activeFileIndex: number
  activeHunkIndex: number
  scrollOffset: number
  writeResults: MergeResult[]
  highlightedPreview: DiffDisplayLine[]

  active_file: FileMergeState | null
  active_hunks: MergeHunk[]
  active_hunk: MergeHunk | null
  total_hunks: number
  all_resolved: boolean

  visibleRows: number
  summaryVisibleRows: number

  diffTask: { state: AsyncTaskState<ComponentDiff> }
  writeTask: { state: AsyncTaskState<MergeResult[]> }

  handleSelect: (name: string) => Promise<void>
  handleWrite: () => Promise<void>
  update_hunk_choice: (choice: HunkChoice) => void
  update_file_choice: (choice: 'keep' | 'remove') => void
  find_next_unresolved: () => { fileIdx: number; hunkIdx: number } | null
  find_prev_unresolved: () => { fileIdx: number; hunkIdx: number } | null
  setStep: (step: MergeStep) => void
  setActiveFileIndex: (v: number | ((prev: number) => number)) => void
  setActiveHunkIndex: (v: number | ((prev: number) => number)) => void
  setScrollOffset: (v: number | ((prev: number) => number)) => void
}

/**
 * Hook that encapsulates all state management, side effects, and
 * action handlers for the merge screen workflow.
 *
 * The merge screen follows a multi-step state machine:
 *   loading -> select -> diffing -> resolving -> summary -> writing -> done | error
 *
 * When mergeData is provided (embedded mode), it skips loading/select
 * and starts directly at 'resolving'.
 */
export function useMergeWorkflow(options: {
  mergeData?: ComponentMergeState
  onBack: () => void
  onComplete?: (results: MergeResult[]) => void
}): MergeWorkflowState {
  const { mergeData, onBack, onComplete } = options

  const [step, setStep] = useState<MergeStep>(mergeData ? 'resolving' : 'loading')
  const [installed, setInstalled] = useState<InstalledComponent[]>([])
  const [mergeState, setMergeState] = useState<ComponentMergeState | null>(mergeData ?? null)
  const [errorMessage, setErrorMessage] = useState('')
  const [scrollOffset, setScrollOffset] = useState(0)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [activeHunkIndex, setActiveHunkIndex] = useState(0)
  const [writeResults, setWriteResults] = useState<MergeResult[]>([])
  const [autoSelected, setAutoSelected] = useState(false)
  const [highlightedPreview, setHighlightedPreview] = useState<DiffDisplayLine[]>([])

  const diffTask = useAsyncTask<ComponentDiff>()
  const writeTask = useAsyncTask<MergeResult[]>()
  const { rows } = useContext(TerminalSizeContext)
  const initialArgs = useContext(InitialArgsContext)

  const visibleRows = Math.max(3, rows - RESOLVING_CHROME)
  const summaryVisibleRows = Math.max(3, rows - SUMMARY_CHROME)

  // Resolve write path state for merge-from-select flow
  const [writePath, setWritePath] = useState('')
  const [_rootFolder, setRootFolder] = useState('')

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

  // Auto-select from CLI initial args (e.g. `duck-cli merge button`)
  // Pre-warm syntax highlighter while user resolves hunks,
  // so the summary step renders highlighted code instantly.
  useEffect(() => {
    if (step !== 'resolving' || !mergeState) return
    for (const file of mergeState.files) {
      warm_highlighter(file.file_path).catch(() => {})
      break
    }
  }, [step, mergeState])

  // Build highlighted preview when entering the summary step.
  // Shows raw lines immediately, then swaps to syntax-highlighted version.
  useEffect(() => {
    if (step !== 'summary' || !mergeState) return

    const preview_file = mergeState.files.find((f) => f.status === 'modified')
    if (!preview_file) {
      setHighlightedPreview([])
      return
    }

    const raw_lines = build_merge_preview_lines(preview_file.local_content, preview_file.hunks)
    setHighlightedPreview(raw_lines)

    const full_code = raw_lines.map((l) => l.raw_text).join('\n')
    highlight_diff_lines(raw_lines, full_code, preview_file.file_path)
      .then((highlighted) => setHighlightedPreview(highlighted))
      .catch(() => {})
  }, [step, mergeState])

  // -- Derived state --

  const active_file = mergeState?.files[activeFileIndex] ?? null
  const active_hunks = active_file?.hunks ?? []
  const active_hunk = active_hunks[activeHunkIndex] ?? null
  const total_hunks = active_hunks.length

  // Check if every file and hunk has been resolved
  const all_resolved = mergeState
    ? mergeState.files.every((f) => {
        if (f.status === 'deleted') return f.file_choice !== 'pending'
        if (f.status === 'added') return true
        return f.hunks.every((h) => h.choice !== 'pending')
      })
    : false

  // -- Mutation helpers --

  /** Set the choice for the currently active hunk in a modified file. */
  const update_hunk_choice = useCallback(
    (choice: HunkChoice) => {
      if (!mergeState || !active_file || active_file.status !== 'modified') return

      const new_files = [...mergeState.files]
      const currentFile = new_files[activeFileIndex]
      if (!currentFile) return
      const file = { ...currentFile }
      const new_hunks = [...file.hunks]
      const currentHunk = new_hunks[activeHunkIndex]
      if (!currentHunk) return
      new_hunks[activeHunkIndex] = { ...currentHunk, choice }
      file.hunks = new_hunks
      file.is_resolved = new_hunks.every((h) => h.choice !== 'pending')
      new_files[activeFileIndex] = file

      setMergeState({ ...mergeState, files: new_files })
    },
    [mergeState, activeFileIndex, activeHunkIndex, active_file],
  )

  /** Set the keep/remove choice for a deleted file. */
  const update_file_choice = useCallback(
    (choice: 'keep' | 'remove') => {
      if (!mergeState || !active_file || active_file.status !== 'deleted') return

      const new_files = [...mergeState.files]
      const currentFile = new_files[activeFileIndex]
      if (!currentFile) return
      const file = { ...currentFile }
      file.file_choice = choice
      file.is_resolved = true
      new_files[activeFileIndex] = file

      setMergeState({ ...mergeState, files: new_files })
    },
    [mergeState, activeFileIndex, active_file],
  )

  /** Find the next unresolved hunk/file, wrapping around to the start. */
  const find_next_unresolved = useCallback((): { fileIdx: number; hunkIdx: number } | null => {
    if (!mergeState) return null

    // Search forward from current position
    for (let fi = activeFileIndex; fi < mergeState.files.length; fi++) {
      const file = mergeState.files[fi]
      if (!file) continue
      if (file.status === 'deleted' && file.file_choice === 'pending') {
        return { fileIdx: fi, hunkIdx: 0 }
      }
      if (file.status === 'modified') {
        const start_hunk = fi === activeFileIndex ? activeHunkIndex + 1 : 0
        for (let hi = start_hunk; hi < file.hunks.length; hi++) {
          const hunk = file.hunks[hi]
          if (hunk?.choice === 'pending') {
            return { fileIdx: fi, hunkIdx: hi }
          }
        }
      }
    }

    // Wrap around from the beginning
    for (let fi = 0; fi <= activeFileIndex; fi++) {
      const file = mergeState.files[fi]
      if (!file) continue
      if (file.status === 'deleted' && file.file_choice === 'pending') {
        return { fileIdx: fi, hunkIdx: 0 }
      }
      if (file.status === 'modified') {
        const end_hunk = fi === activeFileIndex ? activeHunkIndex : file.hunks.length
        for (let hi = 0; hi < end_hunk; hi++) {
          const hunk = file.hunks[hi]
          if (hunk?.choice === 'pending') {
            return { fileIdx: fi, hunkIdx: hi }
          }
        }
      }
    }

    return null
  }, [mergeState, activeFileIndex, activeHunkIndex])

  /** Find the previous unresolved hunk/file, searching backwards. */
  const find_prev_unresolved = useCallback((): { fileIdx: number; hunkIdx: number } | null => {
    if (!mergeState) return null

    for (let fi = activeFileIndex; fi >= 0; fi--) {
      const file = mergeState.files[fi]
      if (!file) continue
      if (file.status === 'modified') {
        const start_hunk = fi === activeFileIndex ? activeHunkIndex - 1 : file.hunks.length - 1
        for (let hi = start_hunk; hi >= 0; hi--) {
          const hunk = file.hunks[hi]
          if (hunk?.choice === 'pending') {
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

  // -- Async action handlers --

  /** Diff the selected component and build merge state. */
  const handleSelect = useCallback(
    async (name: string) => {
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
    },
    [diffTask, installed, writePath],
  )

  // Auto-select from CLI initial args (e.g. `duck-cli merge button`)
  useEffect(() => {
    const initialArg = initialArgs[0]
    if (initialArg && installed.length > 0 && step === 'select' && !autoSelected) {
      const match = installed.find((c) => c.name.toLowerCase() === initialArg.toLowerCase())
      if (match) {
        setAutoSelected(true)
        void handleSelect(match.name)
      }
    }
  }, [autoSelected, handleSelect, initialArgs, installed, step])

  /** Write resolved merge results to disk. */
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
        onBack()
        return
      }
      setStep('done')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  return {
    step,
    errorMessage,
    installed,
    mergeState,
    activeFileIndex,
    activeHunkIndex,
    scrollOffset,
    writeResults,
    highlightedPreview,
    active_file,
    active_hunks,
    active_hunk,
    total_hunks,
    all_resolved,
    visibleRows,
    summaryVisibleRows,
    diffTask,
    writeTask,
    handleSelect,
    handleWrite,
    update_hunk_choice,
    update_file_choice,
    find_next_unresolved,
    find_prev_unresolved,
    setStep,
    setActiveFileIndex,
    setActiveHunkIndex,
    setScrollOffset,
  }
}
