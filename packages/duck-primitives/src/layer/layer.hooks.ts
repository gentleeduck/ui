import * as React from 'react'

export type DynamicLayer = {
  contentZIndex: number
  order: number
  overlayZIndex: number
}

type UseDynamicLayerOptions = {
  baseZIndex?: number
  contentOffset?: number
  open: boolean
  overlayOffset?: number
  step?: number
}

const DEFAULT_BASE_Z_INDEX = 1000
const DEFAULT_LAYER_STEP = 10
const DEFAULT_OVERLAY_OFFSET = 0
const DEFAULT_CONTENT_OFFSET = 1

let layerCounter = 0
const layerSlots = new Map<symbol, number>()

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' && typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect

function claimLayer(token: symbol): number {
  const existing = layerSlots.get(token)
  if (existing !== undefined) return existing

  layerCounter += 1
  layerSlots.set(token, layerCounter)
  return layerCounter
}

function releaseLayer(token: symbol): void {
  layerSlots.delete(token)
}

export function useDynamicLayer({
  open,
  baseZIndex = DEFAULT_BASE_Z_INDEX,
  step = DEFAULT_LAYER_STEP,
  overlayOffset = DEFAULT_OVERLAY_OFFSET,
  contentOffset = DEFAULT_CONTENT_OFFSET,
}: UseDynamicLayerOptions): DynamicLayer {
  const tokenRef = React.useRef<symbol>(Symbol('duck-layer'))
  const [order, setOrder] = React.useState(0)

  useIsomorphicLayoutEffect(() => {
    const token = tokenRef.current

    if (!open) {
      releaseLayer(token)
      setOrder(0)
      return
    }

    const nextOrder = claimLayer(token)
    setOrder(nextOrder)

    return () => {
      releaseLayer(token)
    }
  }, [open])

  const activeOrder = order > 0 ? order : 1
  const currentBase = baseZIndex + (activeOrder - 1) * step

  return React.useMemo(
    () => ({
      contentZIndex: currentBase + contentOffset,
      order,
      overlayZIndex: currentBase + overlayOffset,
    }),
    [contentOffset, currentBase, order, overlayOffset],
  )
}
