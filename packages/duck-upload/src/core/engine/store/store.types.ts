import type { UploadConfig, UploadConfigInput, UploadHooks, UploadPlugin } from '../../client'
import type {
  CursorMap,
  FileFingerprint,
  IntentMap,
  RejectReason,
  StrategyRegistry,
  UploadApi,
  UploadError,
  UploadResultBase,
  UploadTransport,
} from '../../contracts'
import type { PersistedSnapshot, PersistenceAdapter } from '../../persistence'
import type { TypedEmitter } from '../../utils/emitter'
import type { UploadCommand } from '../commands.types'
import type { UploadEventMap } from '../event-map.types'
import type { InternalEvent } from '../internal-events.types'
import type { UploadOutcome } from '../outcome.types'
import type { createReducer, UploadState } from '../reducer'

/**
 * Upload store interface used by UI adapters and application code.
 *
 * The store is intentionally minimal:
 * - state is read through {@link UploadStore.getSnapshot}
 * - updates are observed through {@link UploadStore.subscribe} and {@link UploadStore.on}
 * - actions are performed through {@link UploadStore.dispatch}
 *
 * @template M - Intent map type (keyed by strategy id)
 * @template C - Cursor map type (keyed by strategy id)
 * @template P - Purpose string union type
 */
export interface UploadStore<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> {
  /**
   * Returns the current immutable state snapshot.
   * Useful for React loops or debugging.
   */
  getSnapshot(): UploadState<M, C, P, R>
  /**
   * Subscribes to ANY state change.
   * The listener is called after the reducer has run and effects have been scheduled.
   * @param listener - Listener function to call on state change
   */
  subscribe(listener: () => void): () => void
  /**
   * Main entry point for user actions.
   * Converts external commands into internal state transitions and side effects.
   *
   * @param cmd The command to execute (e.g. 'addFiles', 'start', 'pause')
   */
  dispatch(cmd: UploadCommand<P>): void
  /**
   * Subscribes to specific events (like 'file.added', 'upload.progress').
   * Wraps the internal typed emitter.
   */
  on: <K extends keyof UploadEventMap<M, C, P, R> & string>(
    type: K,
    cb: (payload: UploadEventMap<M, C, P, R>[K]) => void,
  ) => () => void

  /**
   * Unsubscribes from specific events (like 'file.added', 'upload.progress').
   * Wraps the internal typed emitter.
   */
  off: <K extends keyof UploadEventMap<M, C, P, R> & string>(
    type: K,
    cb: (payload: UploadEventMap<M, C, P, R>[K]) => void,
  ) => () => void

  /**
   * Waits for the given localIds to reach a terminal state.
   */
  waitFor(localIds: string[]): Promise<Array<UploadOutcome<R>>>
}

/**
 * Options used to construct a store runtime.
 *
 * In practice you provide:
 * - a backend adapter ({@link UploadApi}) that creates intents and finalizes uploads
 * - a transport implementation (XHR, fetch, etc.) used by strategies
 * - a strategy registry describing what upload strategies exist and how to run them
 * - configuration rules for validation, concurrency, retries, and progress throttling
 *
 * Hooks and plugins are optional and let you observe or extend behavior without forking
 * the engine.
 *
 * @template M - Intent map type (keyed by strategy id)
 * @template C - Cursor map type (keyed by strategy id)
 * @template P - Purpose string union type
 */
export interface StoreOptions<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> {
  /** Initial state to hydrate from (e.g. from localStorage) */
  initialState?: UploadState<M, C, P, R>
  /** Static configuration rules (defaults are applied). */
  config?: UploadConfigInput<P>
  /** Persistence adapter and options */
  persistence?: PersistenceOptions<M, C, P, R>
  /** Backend API adapter for creating intents and finalizing uploads */
  api: UploadApi<M, P, R>
  /** Network transport (XHR/Fetch) for the actual file data transfer */
  transport?: UploadTransport
  /** Registry of available upload strategies (multipart, simple, etc.) */
  strategies: StrategyRegistry<M, C, P, R>
  /** Optional plugins to extend functionality (e.g. debugging, metrics) */
  plugins?: Array<UploadPlugin<M, C, P, R>>
  /** Lifecycle hooks for observing internal events */
  hooks?: UploadHooks<M, C, P, R>
  /**
   * Optional custom fingerprinting (e.g. include sha256).
   * Must be synchronous to keep addFiles fast.
   */
  fingerprint?: (file: File) => FileFingerprint
  /**
   * If returns non-null, it rejects the file.
   * Runs after built-in config validation.
   */
  validateFile?: (file: File, purpose: P) => RejectReason | null
  /**
   * Optional custom error normalizer.
   * Convert raw errors (from fetch, XHR, etc.) into your custom UploadError shape.
   */
  errorNormalizer?: (err: unknown) => UploadError
}

/**
 * Persistence options.
 *
 * Used to configure the upload store persistence layer.
 */
export type DeserializeContext<M extends IntentMap, _C extends CursorMap<M>, P extends string> = {
  isPurpose?: (value: string) => value is P
  isIntent?: (value: unknown) => value is M[keyof M]
  hasStrategy: (value: string) => boolean
}

export type PersistenceOptions<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase,
> = {
  /** Persistence key (e.g. localStorage key) */
  key: string
  /** Persistence schema version (not app version) */
  version: number
  /** Debounce delay in milliseconds (default: 200) */
  debounceMs?: number
  /** Persistence adapter */
  adapter: PersistenceAdapter

  /**
   * Optional custom snapshot serializer.
   * Convert the upload state into a JSON-safe snapshot.
   */
  serialize?: (state: UploadState<M, C, P, R>, version: number) => PersistedSnapshot<M, C, P>
  /**
   * Optional custom snapshot deserializer.
   * Convert a JSON-safe snapshot into the upload state.
   */
  deserialize?: (raw: unknown, ctx: DeserializeContext<M, C, P>) => UploadState<M, C, P, R> | null

  /**
   * Runtime guard for purpose strings when using the default deserializer.
   */
  isPurpose?: (value: string) => value is P

  /**
   * Runtime guard for intent objects when using the default deserializer.
   */
  isIntent?: (value: unknown) => value is M[keyof M]
}

/**
 * Internal record describing a currently running upload request.
 *
 * The store keeps one inflight entry per `localId` while the strategy's `start()` is running.
 * The {@link AbortController} is used to pause/cancel, while `mode` tracks which user intent
 * caused the abort so the handler can map it back into a correct state transition.
 */
export type InflightUpload = {
  controller: AbortController
  mode: 'normal' | 'pause' | 'cancel'
  started: boolean
}

/**
 * Internal runtime container shared across dispatch, scheduler, and handlers.
 *
 * @template M - Intent map type
 * @template C - Cursor map type
 * @template P - Purpose string union type
 */
export type StoreRuntime<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = {
  /** Store options */
  opts: StoreOptions<M, C, P, R> & { config: UploadConfig<P>; transport: UploadTransport }
  /** Current state */
  state: UploadState<M, C, P, R>

  /** Listeners for external events */
  listeners: Set<() => void>
  /** Typed event emitter */
  emitter: TypedEmitter<UploadEventMap<M, C, P, R>>
  /** Reducer */
  reduce: ReturnType<typeof createReducer<M, C, P, R>>

  /** In-flight uploads */
  inflightUploads: Map<string, InflightUpload>
  /** In-flight intents */
  inflightIntents: Map<string, AbortController>
  /** In-flight completes */
  inflightCompletes: Map<string, AbortController>

  /** Effect queue */
  effectQueue: Array<() => Promise<void>>
  /** Effect queue processing */
  processingEffects: boolean
  /** Effect queue scheduling */
  scheduling: boolean

  /** Notifies listeners */
  notify: () => void
  /** Schedules work */
  scheduleWork: () => void
  /** Applies an internal event */
  applyInternal: (event: InternalEvent<M, C, P, R>) => void
  /** Applies a command */
  applyCommand: (cmd: UploadCommand<P>) => void
  /** Enqueues an effect */
  enqueueEffect: (effect: () => Promise<void>) => void
  /** Processes effects */
  processEffects: () => Promise<void>
  /** Set by createUploadStore after construction; used by handlers for retries etc. */
  dispatch: (cmd: UploadCommand<P>) => void
}
