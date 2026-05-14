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
import { readDuckuiConfig, readTsConfig } from '~/services/preflight.service'
import {
  buildDisplayLines,
  buildSideBySidePairs,
  type Diff,
  getHunkOffsets,
  getMaxLineNumber,
} from '~/utils/diff-format'
import { resolveProjectCwd } from '~/utils/workspace'
import { InitialArgsContext, TerminalSizeContext } from '../app'
import type { AsyncTaskState } from './use-async-task'
import { useAsyncTask } from './use-async-task'

type Step = 'loading' | 'select' | 'diffing' | 'results' | 'error'

// Vertical rows reserved by chrome (border, padding, banner, step indicator, file tabs, status line).
// Subtract from terminal rows to get diff viewport height. Update if chrome layout changes.
const RESULTS_CHROME = 14

export type DiffWorkflowState = {
  step: Step
  errorMessage: string

  installed: InstalledComponent[]

  diffResult: ComponentDiff | null
  displayLinesPerFile: Diff.DisplayLine[][]
  sideBySidePairsPerFile: Diff.SideBySidePair[][]
  hunkOffsetsPerFile: number[][]
  numWidth: number

  scrollOffset: number
  activeFileIndex: number
  viewMode: Diff.ViewMode
  columns: number

  visibleRows: number

  diffTask: { state: AsyncTaskState<ComponentDiff> }

  handleSelect: (name: string) => Promise<void>
  setStep: (step: Step) => void
  setScrollOffset: (v: number | ((prev: number) => number)) => void
  setActiveFileIndex: (v: number | ((prev: number) => number)) => void
  setViewMode: (v: Diff.ViewMode | ((prev: Diff.ViewMode) => Diff.ViewMode)) => void
}

/** State machine: loading -> select -> diffing -> results | error. */
export function useDiffWorkflow(_options: { onBack: () => void }): DiffWorkflowState {
  const [step, setStep] = useState<Step>('loading')
  const [installed, setInstalled] = useState<InstalledComponent[]>([])
  const [diffResult, setDiffResult] = useState<ComponentDiff | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const diffTask = useAsyncTask<ComponentDiff>()
  const { rows, columns } = useContext(TerminalSizeContext)
  const initialArgs = useContext(InitialArgsContext)
  const visibleRows = Math.max(3, rows - RESULTS_CHROME)

  const [viewMode, setViewMode] = useState<Diff.ViewMode>('unified')
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [displayLinesPerFile, setDisplayLinesPerFile] = useState<Diff.DisplayLine[][]>([])
  const [sideBySidePairsPerFile, setSideBySidePairsPerFile] = useState<Diff.SideBySidePair[][]>([])
  const [hunkOffsetsPerFile, setHunkOffsetsPerFile] = useState<number[][]>([])
  const [numWidth, setNumWidth] = useState(3)
  const [autoSelected, setAutoSelected] = useState(false)

  useEffect(() => {
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
  }, [])

  const handleSelect = useCallback(
    async (name: string) => {
      setStep('diffing')
      const comp = installed.find((c) => c.name === name)
      if (!comp) {
        setErrorMessage(`Component "${name}" not found.`)
        setStep('error')
        return
      }

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
        setDiffResult(result.data)

        if (result.data.isIdentical) {
          // Synthesize a single file-header line so the results view still has something to render.
          const identicalLine: Diff.DisplayLine = {
            type: 'file-header',
            oldLineNum: null,
            newLineNum: null,
            segments: [{ text: `${name}: identical to registry`, highlight: false }],
            rawText: `${name}: identical to registry`,
          }
          const identicalLines: Diff.DisplayLine[] = [identicalLine]
          setDisplayLinesPerFile([identicalLines])
          setSideBySidePairsPerFile([[{ left: identicalLine, right: identicalLine }]])
          setHunkOffsetsPerFile([[]])
          setNumWidth(3)
        } else {
          const allDisplayLines: Diff.DisplayLine[][] = []
          const allSbsPairs: Diff.SideBySidePair[][] = []
          const allHunkOffsets: number[][] = []
          let maxNum = 0

          for (const fd of result.data.diffs) {
            const lines = buildDisplayLines(fd.filePath, fd.localContent, fd.registryContent)
            const fileMax = getMaxLineNumber(lines)
            if (fileMax > maxNum) maxNum = fileMax

            allDisplayLines.push(lines)
            allSbsPairs.push(buildSideBySidePairs(lines))
            allHunkOffsets.push(getHunkOffsets(lines))
          }

          setDisplayLinesPerFile(allDisplayLines)
          setSideBySidePairsPerFile(allSbsPairs)
          setHunkOffsetsPerFile(allHunkOffsets)
          setNumWidth(Math.max(String(maxNum).length, 3))
        }

        setActiveFileIndex(0)
        setScrollOffset(0)
        setStep('results')
      } else {
        setErrorMessage(result.error)
        setStep('error')
      }
    },
    [diffTask, installed],
  )

  // Auto-pick the component named on the CLI so `duck-ui diff foo` skips the picker.
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
