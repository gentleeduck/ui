import type { Contracts, Engine } from '../core'
import type { Store } from '../core/engine/store'

/**
 * React `useUploader` surface types.
 *
 * Houses the public typings consumed by the React hooks so generated
 * `.d.ts` files do not leak internal generic names.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Uploader {
  /**
   * Pick the variant of `Engine.Item` matching a phase.
   *
   * @template Phase Phase literal to filter on.
   * @returns The item variant whose `phase` matches `Phase`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type PickItemsByPhase<Phase extends Engine.Phase> = Extract<
    Engine.Item<Contracts.IntentMap, Contracts.CursorMap<Contracts.IntentMap>, string, Contracts.IResultBase>,
    { phase: Phase }
  >

  /**
   * Object returned by `useUploader`.
   *
   * @template M Intent map.
   * @template C Cursor map.
   * @template P Purpose union.
   * @template R Backend result shape.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IUploader<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase,
  > {
    items: Engine.Item<M, C, P, R>[]
    /**
     * Items grouped by phase. `Partial<Record<Engine.Phase, ...>>` so consumers
     * get autocomplete for the eleven known phases and a missing group reads
     * as `undefined`.
     */
    byPhase: Partial<Record<Engine.Phase, Engine.Item<M, C, P, R>[]>>
    dispatch: (cmd: Engine.Command<P>) => void
    on: <K extends keyof Engine.EventMap<M, C, P, R> & string>(
      type: K,
      cb: (payload: Engine.EventMap<M, C, P, R>[K]) => void,
    ) => () => void
    off: <K extends keyof Engine.EventMap<M, C, P, R> & string>(
      type: K,
      cb: (payload: Engine.EventMap<M, C, P, R>[K]) => void,
    ) => void
    uploading: Engine.Item<M, C, P, R>[]
    paused: Engine.Item<M, C, P, R>[]
    completed: Engine.Item<M, C, P, R>[]
    failed: Engine.Item<M, C, P, R>[]
    ready: Engine.Item<M, C, P, R>[]
  }

  /**
   * Imperative action surface returned by `useUploaderActions`.
   *
   * Declared explicitly so generated `.d.ts` files do not leak internal
   * generic names.
   *
   * @template M Intent map.
   * @template C Cursor map.
   * @template P Purpose union.
   * @template R Backend result shape; defaults to `Contracts.IResultBase`.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type IActions<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase = Contracts.IResultBase,
  > = Pick<Store.IUploadStore<M, C, P, R>, 'dispatch' | 'on'> & {
    store: Store.IUploadStore<M, C, P, R>
  }
}
