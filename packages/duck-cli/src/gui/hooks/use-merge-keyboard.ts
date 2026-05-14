import { type Key, useInput } from 'ink'
import type { MergeWorkflowState } from './use-merge-workflow'

/**
 * Resolving keys: 1/2/3 picks local/registry/both (or keep/remove on deleted files), n/p (or j/k)
 * walks hunks, h/l switches files, N/P jumps to next/prev unresolved, enter confirms once
 * `allResolved`. Summary: j/k scrolls preview, enter writes, esc backs out.
 */
export function useMergeKeyboard(workflow: MergeWorkflowState, onBack: () => void): void {
  const {
    step,
    mergeState,
    activeFile,
    activeHunk,
    activeHunks,
    activeFileIndex,
    activeHunkIndex,
    allResolved,
    updateHunkChoice,
    updateFileChoice,
    findNextUnresolved,
    findPrevUnresolved,
    setActiveFileIndex,
    setActiveHunkIndex,
    setScrollOffset,
    setStep,
    handleWrite,
  } = workflow

  useInput((input: string, key: Key) => {
    if (step === 'resolving') {
      if (key.escape) {
        onBack()
        return
      }

      if (key.leftArrow || input === 'h') {
        if (activeFileIndex > 0) {
          setActiveFileIndex((prev: number) => prev - 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }
      if (key.rightArrow || input === 'l') {
        if (mergeState && activeFileIndex < mergeState.files.length - 1) {
          setActiveFileIndex((prev: number) => prev + 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }

      if (activeFile?.status === 'deleted') {
        if (input === '1') {
          updateFileChoice('keep')
          return
        }
        if (input === '2') {
          updateFileChoice('remove')
          return
        }
      }

      if (activeFile?.status === 'modified' && activeHunk) {
        if (input === '1') {
          updateHunkChoice('local')
          return
        }
        if (input === '2') {
          updateHunkChoice('registry')
          return
        }
        if (input === '3') {
          updateHunkChoice('both')
          return
        }
      }

      // n/j/down advances hunks, then spills into the first hunk of the next file when exhausted.
      if (input === 'n' || input === 'j' || key.downArrow) {
        if (activeHunks.length > 0 && activeHunkIndex < activeHunks.length - 1) {
          setActiveHunkIndex((prev: number) => prev + 1)
        } else if (mergeState && activeFileIndex < mergeState.files.length - 1) {
          setActiveFileIndex((prev: number) => prev + 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }

      // Mirror of the forward case: roll back into the last hunk of the previous file.
      if (input === 'p' || input === 'k' || key.upArrow) {
        if (activeHunkIndex > 0) {
          setActiveHunkIndex((prev: number) => prev - 1)
        } else if (activeFileIndex > 0) {
          const prevFile = mergeState?.files[activeFileIndex - 1]
          const lastIdx = prevFile?.hunks.length ? prevFile.hunks.length - 1 : 0
          setActiveFileIndex((prev: number) => prev - 1)
          setActiveHunkIndex(lastIdx)
          setScrollOffset(0)
        }
        return
      }

      if (input === 'N') {
        const prev = findPrevUnresolved()
        if (prev) {
          setActiveFileIndex(prev.fileIdx)
          setActiveHunkIndex(prev.hunkIdx)
          setScrollOffset(0)
        }
        return
      }

      if (input === 'P') {
        const next = findNextUnresolved()
        if (next) {
          setActiveFileIndex(next.fileIdx)
          setActiveHunkIndex(next.hunkIdx)
          setScrollOffset(0)
        }
        return
      }

      if (key.return && allResolved) {
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
        setScrollOffset((prev: number) => Math.max(0, prev - 1))
        return
      }
      if (key.downArrow || input === 'j') {
        setScrollOffset((prev: number) => prev + 1)
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
}
