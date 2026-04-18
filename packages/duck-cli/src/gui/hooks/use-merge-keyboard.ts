import { type Key, useInput } from 'ink'
import type { MergeWorkflowState } from './use-merge-workflow'

/**
 * Keyboard handler for the merge screen.
 *
 * Routes key presses based on the current workflow step:
 *
 * Resolving step:
 *   h/l or left/right  - switch between files
 *   n/j/down            - next hunk
 *   p/k/up              - previous hunk
 *   N                   - jump to previous unresolved hunk
 *   P                   - jump to next unresolved hunk
 *   1                   - choose local (or keep for deleted files)
 *   2                   - choose registry (or remove for deleted files)
 *   3                   - choose both (modified files only)
 *   enter               - proceed to summary (when all resolved)
 *   esc                 - abort and exit
 *
 * Summary step:
 *   j/k or up/down      - scroll preview
 *   enter               - confirm and write to disk
 *   esc                 - go back to resolving
 *
 * Select step:
 *   esc                 - exit
 *
 * Done/Error step:
 *   esc or enter        - exit
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
    // -- Resolving step --
    if (step === 'resolving') {
      if (key.escape) {
        onBack()
        return
      }

      // File navigation (left/right or h/l)
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

      // Choice input for deleted files
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

      // Choice input for modified files
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

      // Next hunk (n / j / down)
      if (input === 'n' || input === 'j' || key.downArrow) {
        if (activeHunks.length > 0 && activeHunkIndex < activeHunks.length - 1) {
          setActiveHunkIndex((prev: number) => prev + 1)
        } else if (mergeState && activeFileIndex < mergeState.files.length - 1) {
          // Jump to first hunk of next file
          setActiveFileIndex((prev: number) => prev + 1)
          setActiveHunkIndex(0)
          setScrollOffset(0)
        }
        return
      }

      // Previous hunk (p / k / up)
      if (input === 'p' || input === 'k' || key.upArrow) {
        if (activeHunkIndex > 0) {
          setActiveHunkIndex((prev: number) => prev - 1)
        } else if (activeFileIndex > 0) {
          // Jump to last hunk of previous file
          const prevFile = mergeState?.files[activeFileIndex - 1]
          const lastIdx = prevFile?.hunks.length ? prevFile.hunks.length - 1 : 0
          setActiveFileIndex((prev: number) => prev - 1)
          setActiveHunkIndex(lastIdx)
          setScrollOffset(0)
        }
        return
      }

      // Jump to previous unresolved (N)
      if (input === 'N') {
        const prev = findPrevUnresolved()
        if (prev) {
          setActiveFileIndex(prev.fileIdx)
          setActiveHunkIndex(prev.hunkIdx)
          setScrollOffset(0)
        }
        return
      }

      // Jump to next unresolved (P)
      if (input === 'P') {
        const next = findNextUnresolved()
        if (next) {
          setActiveFileIndex(next.fileIdx)
          setActiveHunkIndex(next.hunkIdx)
          setScrollOffset(0)
        }
        return
      }

      // Proceed to summary when all hunks resolved
      if (key.return && allResolved) {
        setScrollOffset(0)
        setStep('summary')
        return
      }

      return
    }

    // -- Summary step --
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

    // -- Select step --
    if (step === 'select') {
      if (key.escape) {
        onBack()
        return
      }
    }

    // -- Done / Error steps --
    if (step === 'error' || step === 'done') {
      if (key.escape || key.return) {
        onBack()
        return
      }
    }
  })
}
