/** @internal */
interface IMeasurable {
  getBoundingClientRect(): DOMRect
}

/**
 * @internal
 * Observes an element's bounding rect using a requestAnimationFrame loop.
 * Batches DOM reads (getBoundingClientRect) before DOM writes (callbacks)
 * to minimize layout thrashing. Returns an unsubscribe function.
 *
 * Multiple callbacks can observe the same element -- the loop only runs
 * while at least one element is being observed.
 */
function observeElementRect(elementToObserve: IMeasurable, callback: CallbackFn) {
  const observedData = observedElements.get(elementToObserve)

  if (observedData === undefined) {
    observedElements.set(elementToObserve, { rect: {} as DOMRect, callbacks: [callback] })

    if (observedElements.size === 1) {
      rafId = requestAnimationFrame(runLoop)
    }
  } else {
    observedData.callbacks.push(callback)
    callback(elementToObserve.getBoundingClientRect())
  }

  return () => {
    const observedData = observedElements.get(elementToObserve)
    if (observedData === undefined) return

    const index = observedData.callbacks.indexOf(callback)
    if (index > -1) {
      observedData.callbacks.splice(index, 1)
    }

    if (observedData.callbacks.length === 0) {
      observedElements.delete(elementToObserve)

      if (observedElements.size === 0) {
        cancelAnimationFrame(rafId)
      }
    }
  }
}

// Module-level state for the shared rAF loop.

type CallbackFn = (rect: DOMRect) => void

interface IObservedData {
  rect: DOMRect
  callbacks: Array<CallbackFn>
}

let rafId: number
const observedElements: Map<IMeasurable, IObservedData> = new Map()

function runLoop() {
  const changedRectsData: Array<IObservedData> = []

  // DOM reads
  observedElements.forEach((data, element) => {
    const newRect = element.getBoundingClientRect()
    if (!rectEquals(data.rect, newRect)) {
      data.rect = newRect
      changedRectsData.push(data)
    }
  })

  // DOM writes (callbacks may trigger layout)
  for (const data of changedRectsData) {
    for (const callback of data.callbacks) {
      callback(data.rect)
    }
  }

  rafId = requestAnimationFrame(runLoop)
}

function rectEquals(rect1: DOMRect, rect2: DOMRect) {
  return (
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.top === rect2.top &&
    rect1.right === rect2.right &&
    rect1.bottom === rect2.bottom &&
    rect1.left === rect2.left
  )
}

export type { IMeasurable }
export { observeElementRect }
