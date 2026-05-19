import type { Contracts } from '../contracts'
import type { Engine } from '../engine/engine.types'
import type { Reducer } from '../engine/reducer'
import type { Store } from '../engine/store'
import type { PersistenceError } from '../persistence/persistence.types'

/**
 * Client-facing configuration, hooks, plugins, and retry policy types.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Client {
  // -------------------- Retry --------------------

  /** Output of the retry policy. `delayMs` is a backoff before re-attempt. */
  export type RetryDecision = { retryable: false } | { retryable: true; delayMs: number }

  // -------------------- Config --------------------

  /** Effect-queue compaction tuning knobs. */
  export interface IEffectQueueCompaction {
    /** Absolute head-count floor before compaction. Default 64. */
    minHead: number
    /** Triggers compaction when `head * denom > length`. Default 2. */
    ratioDenom: number
    /**
     * Hard upper bound on queue length. New effects past this cap are
     * dropped + logged. Defends against a pathological dispatch storm that
     * grows the queue faster than compaction drains. `null` disables.
     * Default `10_000`.
     */
    maxQueueLength: number | null
  }

  /** Global upload engine configuration. */
  export interface IUploadConfig<P extends string> {
    /** Maximum concurrent in-flight uploads. Default `3`. */
    maxConcurrentUploads: number
    /** Auto-start `ready` items. */
    autoStart?: readonly P[] | ((purpose: P) => boolean)
    /** Throttle for `upload.progress` events in ms. Default `100`. */
    progressThrottleMs: number
    /** Per-purpose validation rules. */
    validation: Partial<Record<P, Contracts.IValidationRules>>
    /** Maximum attempts per phase before a failure is final. Default `3`. */
    maxAttempts: number
    /** Override the default retry policy. */
    retryPolicy?: (ctx: {
      phase: 'intent' | 'upload' | 'complete'
      attempt: number
      error: Contracts.Error
    }) => RetryDecision
    /** Cap on items kept in state. Set to `null` for no cap. Default `100`. */
    maxItems: number | null
    /** Auto-remove `completed`/`canceled` items after this many ms. */
    completedItemTTL?: number
    /** Concurrency cap for side-effects. Default `8`. */
    effectConcurrency: number
    /** Per-effect watchdog timeout in ms. `0` disables. Default `60000`. */
    effectTimeoutMs: number
    /** Include file context in persisted error messages. Default `false` (PII). */
    errorContextInMessage: boolean
    /** Keep raw thrown value as `error.cause`. Default `false` (PII). */
    keepRawCause: boolean
    /** Effect-queue compaction tuning. */
    effectQueueCompaction: IEffectQueueCompaction
    /**
     * Skip `crypto.subtle.digest` (and the dedupe lookup that depends on it)
     * for files larger than this byte threshold. The browser has no streaming
     * SHA-256, so digesting a 10GB file allocates 10GB of heap; the cap lets
     * the consumer trade dedupe coverage for memory. Default `null` (no cap).
     */
    checksumMaxSize: number | null
    /**
     * Hash only the first N bytes of each file. Yields a fast approximate
     * fingerprint at the cost of strict uniqueness: files that share the
     * leading window collide. Combine with `size + lastModified + chunk
     * checksum` on the backend to form a unique dedupe key. Default
     * `null` (full-file hash, exact match).
     *
     * @remarks Set to a small value (e.g. `1024 * 64`) for fast
     * checksums on very large files where exact dedupe is not
     * required.
     */
    checksumChunkBytes: number | null
    /**
     * When `true`, `rebind` requires the rebound `File.type` to match the
     * paused item's fingerprint type. Default `false` because browsers
     * disagree on MIME detection (Safari often omits MIME types Chrome
     * attaches). Enable when both sessions are guaranteed to run in the
     * same browser/runtime.
     */
    strictRebindType: boolean
  }

  /**
   * Partial form accepted by `createUploadStore`. Nested config groups
   * (e.g. `effectQueueCompaction`) accept their own partial shape so
   * callers can override one knob without restating the rest.
   */
  export type UploadConfigInput<P extends string> = Partial<Omit<IUploadConfig<P>, 'effectQueueCompaction'>> & {
    effectQueueCompaction?: Partial<IEffectQueueCompaction>
  }

  // -------------------- Hooks --------------------

  /** Optional observability hooks. Diagnostics / analytics / devtools / Sentry. */
  export interface IUploadHooks<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase = Contracts.IResultBase,
  > {
    /** Fires after every internal event applied by the reducer. */
    onInternalEvent?: (event: Engine.InternalEvent<M, C, P, R>, state: Reducer.IState<M, C, P, R>) => void
    /** Fires when a persistence adapter operation fails. */
    onPersistenceError?: (error: PersistenceError) => void
    /** Fires on listener / plugin / emitter / batch throws. */
    onListenerError?: (
      error: unknown,
      context: { kind: 'subscriber' | 'plugin-setup' | 'emitter' | 'batch'; name?: string },
    ) => void
    /**
     * Fires when the effect queue rejects a new effect because it is at
     * `effectQueueCompaction.maxQueueLength`. Production telemetry hook so
     * dropped effects are not silently swallowed. Passes the current queue
     * length (`queueLength`), active in-flight effect count (`active`), the
     * hard cap (`cap`), and the optional `localId` of the upload that
     * triggered the enqueue (when the caller threaded it through).
     */
    onEffectDropped?: (context: { queueLength: number; active: number; cap: number; localId?: string }) => void
    /**
     * Fires when `scheduleWork`'s re-entrant pass loop hits the soft cap
     * (default 100). Production telemetry hook so a runaway feedback
     * loop is visible even when dev-mode `console.error` is gated out.
     */
    onScheduleStarved?: (context: { passes: number }) => void
    /**
     * Fires when `flushPersistence`'s trailing-flush loop hits the soft
     * cap. A pathological feedback loop (e.g. `onPersistenceError`
     * dispatching state changes that schedule another flush) would
     * otherwise spin forever. Defaults to 100 trailing iterations.
     */
    onPersistenceLoopStarved?: (context: { passes: number }) => void
  }

  // -------------------- Plugin --------------------

  /** Store plugin. Subscribed once at construction with a narrow store view. */
  export interface IUploadPlugin<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase = Contracts.IResultBase,
  > {
    /** Plugin name (used in debugging output + `onListenerError` context). */
    name: string
    /**
     * Called once at construction. May return a `Promise` to delay
     * `store.ready` until the plugin finishes initializing (e.g. fetching
     * remote feature flags). Sync throws and async rejections are both
     * routed through `onListenerError`.
     *
     * Wider surface than R23: plugins now also see `flush` / `cleanup` /
     * `purge` / `has` / `waitFor` / `subscribe` so a plugin can await
     * durability, do bulk operations, or subscribe via the public
     * mechanism instead of holding raw `rt` references.
     */
    setup: (
      ctx: Pick<
        Store.IUploadStore<M, C, P, R>,
        'on' | 'off' | 'dispatch' | 'getSnapshot' | 'subscribe' | 'waitFor' | 'flush' | 'cleanup' | 'purge' | 'has'
      >,
    ) => void | Promise<void>
    /**
     * Called once during `store.destroy()` so the plugin can release its
     * own resources (timers, external subscriptions, network handles).
     * May return a `Promise` -- `destroy()` awaits all plugin disposes
     * before resolving. Sync throws and async rejections route through
     * `onListenerError` and never reject `destroy()`.
     */
    dispose?: () => void | Promise<void>
  }
}
