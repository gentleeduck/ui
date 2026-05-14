import { type Key, useInput } from 'ink'
import type { DiffWorkflowState } from './use-diff-workflow'

/**
 * Diff-screen key map (results step): j/k or arrows scroll, n/p jump between hunk headers, h/l
 * switch files, tab toggles unified vs side-by-side, esc returns to select. Other steps: esc exits.
 */
export function useDiffKeyboard(workflow: DiffWorkflowState, onBack: () => void): void {
  const {
    step,
    viewMode,
    displayLinesPerFile,
    sideBySidePairsPerFile,
    hunkOffsetsPerFile,
    activeFileIndex,
    diffResult,
    visibleRows,
    setScrollOffset,
    setActiveFileIndex,
    setViewMode,
    setStep,
  } = workflow

  useInput((input: string, key: Key) => {
    if (step === 'results') {
      if (key.escape) {
        setScrollOffset(0)
        setActiveFileIndex(0)
        setStep('select')
        return
      }

      if (key.upArrow || input === 'k') {
        setScrollOffset((prev: number) => Math.max(0, prev - 1))
        return
      }

      if (key.downArrow || input === 'j') {
        const totalLines =
          viewMode === 'unified'
            ? (displayLinesPerFile[activeFileIndex]?.length ?? 0)
            : (sideBySidePairsPerFile[activeFileIndex]?.length ?? 0)
        setScrollOffset((prev: number) => Math.min(Math.max(0, totalLines - visibleRows), prev + 1))
        return
      }

      if (key.tab) {
        setViewMode((prev: string) => (prev === 'unified' ? 'side-by-side' : 'unified'))
        setScrollOffset(0)
        return
      }

      if (input === 'n') {
        const offsets = hunkOffsetsPerFile[activeFileIndex] ?? []
        const next = offsets.find((o: number) => o > workflow.scrollOffset)
        if (next !== undefined) {
          setScrollOffset(next)
        }
        return
      }

      if (input === 'p') {
        const offsets = hunkOffsetsPerFile[activeFileIndex] ?? []
        const candidates = offsets.filter((o: number) => o < workflow.scrollOffset)
        const previous = candidates.at(-1)
        if (previous !== undefined) {
          setScrollOffset(previous)
        }
        return
      }

      if (key.leftArrow || input === 'h') {
        if (activeFileIndex > 0) {
          setActiveFileIndex((prev: number) => prev - 1)
          setScrollOffset(0)
        }
        return
      }

      if (key.rightArrow || input === 'l') {
        const maxIndex = (diffResult?.diffs.length ?? 1) - 1
        if (activeFileIndex < maxIndex) {
          setActiveFileIndex((prev: number) => prev + 1)
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
}
