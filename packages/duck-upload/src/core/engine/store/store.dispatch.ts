import type { CursorMap, IntentMap, UploadResultBase } from '../../contracts'
import type { UploadCommand } from '../commands.types'
import { handleAddFiles } from './handlers/add-file'
import { handleCancel } from './handlers/cancel'
import { handlePause } from './handlers/pause'
import type { StoreRuntime } from './store.types'

/**
 * Dispatches a command against the runtime.
 *
 * Some commands are expanded into multiple operations (e.g. startAll/pauseAll/cancelAll).
 * Some commands need imperative side effects (pause/cancel/addFiles) and therefore call
 * handler functions before/after applying reducer transitions.
 *
 * @template M - Intent map type
 * @template C - Cursor map type
 * @template P - Purpose string union type
 */
export function dispatch<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  rt: StoreRuntime<M, C, P, R>,
  cmd: UploadCommand<P>,
) {
  // Bulk operations
  if (cmd.type === 'startAll') {
    const purpose = cmd.purpose
    Array.from(rt.state.items.values())
      .filter((item) => item.phase === 'ready' && (!purpose || item.purpose === purpose))
      .forEach((item) => {
        rt.dispatch({ type: 'start', localId: item.localId })
      })
    return
  }

  if (cmd.type === 'pauseAll') {
    const purpose = cmd.purpose
    Array.from(rt.state.items.values())
      .filter((item) => item.phase === 'uploading' && (!purpose || item.purpose === purpose))
      .forEach((item) => {
        rt.dispatch({ type: 'pause', localId: item.localId })
      })
    return
  }

  if (cmd.type === 'cancelAll') {
    const purpose = cmd.purpose
    Array.from(rt.state.items.values())
      .filter(
        (item) => item.phase !== 'completed' && item.phase !== 'canceled' && (!purpose || item.purpose === purpose),
      )
      .forEach((item) => {
        rt.dispatch({ type: 'cancel', localId: item.localId })
      })
    return
  }

  if (cmd.type === 'addFiles') {
    handleAddFiles(rt, cmd.files, cmd.purpose)
    return
  }

  if (cmd.type === 'pause') {
    handlePause(rt, cmd.localId)
    rt.applyCommand(cmd)
    return
  }

  if (cmd.type === 'cancel') {
    handleCancel(rt, cmd.localId)
    rt.applyCommand(cmd)
    return
  }

  if (cmd.type === 'start') {
    rt.applyCommand(cmd)
    return
  }

  if (cmd.type === 'resume') {
    rt.applyCommand(cmd)
    return
  }

  rt.applyCommand(cmd)
}
