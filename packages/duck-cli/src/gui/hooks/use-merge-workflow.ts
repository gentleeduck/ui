import path from 'node:path'
import { useCallback, useContext, useEffect, useState } from 'react'
import {
  type ComponentDiff,
  diffComponent,
  type InstalledComponent,
  resolveWriteTypePath,
  scanInstalledComponents,
} from '~/services/component.service'
import { resolveInstallPath } from '~/services/install.service'
import { buildComponentMergeState, writeMergeResults } from '~/services/merge.service'
import { readDuckuiConfig, readTsConfig } from '~/services/preflight.service'
import { highlightDiffLines, warmHighlighter } from '~/services/syntax-highlight.service'
import type { Diff } from '~/utils/diff-format'
import { buildMergePreviewLines, type Merge } from '~/utils/merge'
import { resolveProjectCwd } from '~/utils/workspace'
import { InitialArgsContext, TerminalSizeContext } from '../app'
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
  step: Merge.Step
  errorMessage: string

  installed: InstalledComponent[]

  mergeState: Merge.ComponentState | null
  activeFileIndex: number
  activeHunkIndex: number
  scrollOffset: number
  writeResults: Merge.Result[]
  highlightedPreview: Diff.DisplayLine[]

  activeFile: Merge.FileState | null
  activeHunks: Merge.Hunk[]
  activeHunk: Merge.Hunk | null
  totalHunks: number
  allResolved: boolean

  visibleRows: number
  summaryVisibleRows: number

  diffTask: { state: AsyncTaskState<ComponentDiff> }
  writeTask: { state: AsyncTaskState<Merge.Result[]> }

  handleSelect: (name: string) => Promise<void>
  handleWrite: () => Promise<void>
  updateHunkChoice: (choice: Merge.HunkChoice) => void
  updateFileChoice: (choice: 'keep' | 'remove') => void
  findNextUnresolved: () => { fileIdx: number; hunkIdx: number } | null
  findPrevUnresolved: () => { fileIdx: number; hunkIdx: number } | null
  setStep: (step: Merge.Step) => void
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
  mergeData?: Merge.ComponentState | undefined
  onBack: () => void
  onComplete?: ((results: Merge.Result[]) => void) | undefined
}): MergeWorkflowState {
  const { mergeData, onBack, onComplete } = options

  const [step, setStep] = useState<Merge.Step>(mergeData ? 'resolving' : 'loading')
  const [installed, setInstalled] = useState<InstalledComponent[]>([])
  const [mergeState, setMergeState] = useState<Merge.ComponentState | null>(mergeData ?? null)
  const [errorMessage, setErrorMessage] = useState('')
  const [scrollOffset, setScrollOffset] = useState(0)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [activeHunkIndex, setActiveHunkIndex] = useState(0)
  const [writeResults, setWriteResults] = useState<Merge.Result[]>([])
  const [autoSelected, setAutoSelected] = useState(false)
  const [highlightedPreview, setHighlightedPreview] = useState<Diff.DisplayLine[]>([])

  const diffTask = useAsyncTask<ComponentDiff>()
  const writeTask = useAsyncTask<Merge.Result[]>()
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

      const configResult = await readDuckuiConfig(cwd)
      if (!configResult.ok) {
        setErrorMessage(configResult.error)
        setStep('error')
        return
      }

      const projectCwd = resolveProjectCwd(cwd, configResult.data)
      const tsResult = await readTsConfig(projectCwd)
      if (!tsResult.ok) {
        setErrorMessage(tsResult.error)
        setStep('error')
        return
      }

      const pathResult = resolveInstallPath(configResult.data, tsResult.data)
      if (!pathResult.ok) {
        setErrorMessage(pathResult.error)
        setStep('error')
        return
      }

      const writeTypePath = resolveWriteTypePath(configResult.data, path.resolve(projectCwd, pathResult.data))
      setWritePath(writeTypePath)

      const scanResult = await scanInstalledComponents(writeTypePath)
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
      warmHighlighter(file.filePath).catch(() => {})
      break
    }
  }, [step, mergeState])

  // Build highlighted preview when entering the summary step.
  // Shows raw lines immediately, then swaps to syntax-highlighted version.
  useEffect(() => {
    if (step !== 'summary' || !mergeState) return

    const previewFile = mergeState.files.find((f) => f.status === 'modified')
    if (!previewFile) {
      setHighlightedPreview([])
      return
    }

    const rawLines = buildMergePreviewLines(previewFile.localContent, previewFile.hunks)
    setHighlightedPreview(rawLines)

    const fullCode = rawLines.map((l) => l.rawText).join('\n')
    highlightDiffLines(rawLines, fullCode, previewFile.filePath)
      .then((highlighted) => setHighlightedPreview(highlighted))
      .catch(() => {})
  }, [step, mergeState])

  // -- Derived state --

  const activeFile = mergeState?.files[activeFileIndex] ?? null
  const activeHunks = activeFile?.hunks ?? []
  const activeHunk = activeHunks[activeHunkIndex] ?? null
  const totalHunks = activeHunks.length

  // Check if every file and hunk has been resolved
  const allResolved = mergeState
    ? mergeState.files.every((f) => {
        if (f.status === 'deleted') return f.fileChoice !== 'pending'
        if (f.status === 'added') return true
        return f.hunks.every((h) => h.choice !== 'pending')
      })
    : false

  // -- Mutation helpers --

  /** Set the choice for the currently active hunk in a modified file. */
  const updateHunkChoice = useCallback(
    (choice: Merge.HunkChoice) => {
      if (!mergeState || !activeFile || activeFile.status !== 'modified') return

      const newFiles = [...mergeState.files]
      const currentFile = newFiles[activeFileIndex]
      if (!currentFile) return
      const file = { ...currentFile }
      const newHunks = [...file.hunks]
      const currentHunk = newHunks[activeHunkIndex]
      if (!currentHunk) return
      newHunks[activeHunkIndex] = { ...currentHunk, choice }
      file.hunks = newHunks
      file.isResolved = newHunks.every((h) => h.choice !== 'pending')
      newFiles[activeFileIndex] = file

      setMergeState({ ...mergeState, files: newFiles })
    },
    [mergeState, activeFileIndex, activeHunkIndex, activeFile],
  )

  /** Set the keep/remove choice for a deleted file. */
  const updateFileChoice = useCallback(
    (choice: 'keep' | 'remove') => {
      if (!mergeState || !activeFile || activeFile.status !== 'deleted') return

      const newFiles = [...mergeState.files]
      const currentFile = newFiles[activeFileIndex]
      if (!currentFile) return
      const file = { ...currentFile }
      file.fileChoice = choice
      file.isResolved = true
      newFiles[activeFileIndex] = file

      setMergeState({ ...mergeState, files: newFiles })
    },
    [mergeState, activeFileIndex, activeFile],
  )

  /** Find the next unresolved hunk/file, wrapping around to the start. */
  const findNextUnresolved = useCallback((): { fileIdx: number; hunkIdx: number } | null => {
    if (!mergeState) return null

    // Search forward from current position
    for (let fi = activeFileIndex; fi < mergeState.files.length; fi++) {
      const file = mergeState.files[fi]
      if (!file) continue
      if (file.status === 'deleted' && file.fileChoice === 'pending') {
        return { fileIdx: fi, hunkIdx: 0 }
      }
      if (file.status === 'modified') {
        const startHunk = fi === activeFileIndex ? activeHunkIndex + 1 : 0
        for (let hi = startHunk; hi < file.hunks.length; hi++) {
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
      if (file.status === 'deleted' && file.fileChoice === 'pending') {
        return { fileIdx: fi, hunkIdx: 0 }
      }
      if (file.status === 'modified') {
        const endHunk = fi === activeFileIndex ? activeHunkIndex : file.hunks.length
        for (let hi = 0; hi < endHunk; hi++) {
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
  const findPrevUnresolved = useCallback((): { fileIdx: number; hunkIdx: number } | null => {
    if (!mergeState) return null

    for (let fi = activeFileIndex; fi >= 0; fi--) {
      const file = mergeState.files[fi]
      if (!file) continue
      if (file.status === 'modified') {
        const startHunk = fi === activeFileIndex ? activeHunkIndex - 1 : file.hunks.length - 1
        for (let hi = startHunk; hi >= 0; hi--) {
          const hunk = file.hunks[hi]
          if (hunk?.choice === 'pending') {
            return { fileIdx: fi, hunkIdx: hi }
          }
        }
      }
      if (file.status === 'deleted' && file.fileChoice === 'pending' && fi !== activeFileIndex) {
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

        if (!comp.registryEntry) {
          const { getRegistryItem } = await import('~/utils/get-registry')
          const entry = await getRegistryItem(name)
          if (!entry) {
            return { ok: false as const, error: `Component "${name}" not found in registry.` }
          }
          comp.registryEntry = entry
        }

        onProgress('Comparing files...')
        return diffComponent(comp, comp.registryEntry)
      })

      if (result.ok) {
        if (result.data.isIdentical) {
          setErrorMessage(`${name}: identical to registry. Nothing to merge.`)
          setStep('error')
          return
        }

        const state = buildComponentMergeState(result.data, writePath, comp.root_folder)
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
      return writeMergeResults(mergeState, onProgress)
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
    activeFile,
    activeHunks,
    activeHunk,
    totalHunks,
    allResolved,
    visibleRows,
    summaryVisibleRows,
    diffTask,
    writeTask,
    handleSelect,
    handleWrite,
    updateHunkChoice,
    updateFileChoice,
    findNextUnresolved,
    findPrevUnresolved,
    setStep,
    setActiveFileIndex,
    setActiveHunkIndex,
    setScrollOffset,
  }
}
