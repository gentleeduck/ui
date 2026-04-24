import type { CursorMap, IntentMap, UploadResultBase } from '../../../contracts'
import type { UploadState } from '../../reducer'
import type { StoreOptions } from '../store.types'

export function cleanupOldItems<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
>(opts: StoreOptions<M, C, P, R>, state: UploadState<M, C, P, R>): UploadState<M, C, P, R> | null {
  const maxItems = opts.config?.maxItems
  const completedTTL = opts.config?.completedItemTTL
  const now = Date.now()

  // Collect items to remove
  const toRemove: string[] = []
  const items = Array.from(state.items.entries())

  // Remove items that exceed TTL
  if (completedTTL !== undefined) {
    for (const [localId, item] of items) {
      if (
        (item.phase === 'completed' || item.phase === 'canceled') &&
        'completedAt' in item &&
        typeof item.completedAt === 'number' &&
        now - item.completedAt > completedTTL
      ) {
        toRemove.push(localId)
      } else if (
        item.phase === 'canceled' &&
        'canceledAt' in item &&
        typeof item.canceledAt === 'number' &&
        now - item.canceledAt > completedTTL
      ) {
        toRemove.push(localId)
      }
    }
  }

  // If still over limit, remove oldest completed/canceled items
  const remainingItems = items.filter(([id]) => !toRemove.includes(id))
  if (maxItems !== undefined && remainingItems.length > maxItems) {
    const completedOrCanceled = remainingItems
      .filter(([, item]) => item.phase === 'completed' || item.phase === 'canceled')
      .sort(([, a], [, b]) => {
        const aTime = 'completedAt' in a ? a.completedAt : 'canceledAt' in a ? a.canceledAt : 0
        const bTime = 'completedAt' in b ? b.completedAt : 'canceledAt' in b ? b.canceledAt : 0
        return aTime - bTime
      })

    const excess = remainingItems.length - maxItems
    for (let i = 0; i < excess && i < completedOrCanceled.length; i++) {
      toRemove.push(completedOrCanceled[i][0])
    }
  }

  // Remove items
  if (toRemove.length === 0) return null

  const nextItems = new Map(state.items)
  for (const localId of toRemove) {
    nextItems.delete(localId)
  }

  return { ...state, items: nextItems }
}
