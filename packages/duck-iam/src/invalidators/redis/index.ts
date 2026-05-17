import type { EngineTypes } from '../../core/engine/engine.types'

/**
 * Redis invalidator integration types. Type-only namespace - zero bundle cost.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace RedisInvalidator {
  /**
   * Describes the minimum pub/sub surface needed by the Redis invalidator.
   *
   * Both ioredis and node-redis v4+ implement this shape; call sites stay
   * intentionally narrow to avoid pulling in either as a hard dependency.
   * Pass two clients - Redis requires a separate connection per subscriber.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IPubSubLike {
    /**
     * Publishes the JSON payload on the given channel for every local admin
     * mutation. Synchronous return is fine; the caller does not await.
     *
     * @param channel - Names the channel to publish on.
     * @param message - Serialised JSON payload to broadcast.
     * @returns Whatever the underlying client returns; ignored by the invalidator.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    publish(channel: string, message: string): unknown
    /**
     * Subscribes the handler to incoming messages on the channel. The factory
     * calls this once with the channel name and a raw-message handler.
     *
     * @param channel - Names the channel to subscribe to.
     * @param handler - Receives each raw message string from the channel.
     * @returns Void synchronously or a promise the caller may await on startup.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    subscribe(channel: string, handler: (message: string) => void): void | Promise<void>
    /**
     * Tears down the subscription. Engine calls this on `dispose()`. Optional -
     * passing a no-op stub is fine if your client manages connection lifecycle
     * out of band.
     *
     * @param channel - Names the channel to detach from.
     * @returns Void synchronously or a promise.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    unsubscribe?(channel: string): void | Promise<void>
  }

  /**
   * Configures {@link createRedisInvalidator}.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IConfig {
    /** Redis pub/sub adapter implementing {@link IPubSubLike}. */
    client: IPubSubLike
    /**
     * Channel name. Every engine subscribing to the same channel shares an
     * invalidate broadcast group. Defaults to `'duck-iam:invalidate'`. Use a
     * tenant-prefixed channel in multi-tenant deployments so tenants don't
     * cross-invalidate.
     */
    channel?: string
  }
}

/**
 * @deprecated Use {@link RedisInvalidator.IPubSubLike}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IRedisPubSubLike = RedisInvalidator.IPubSubLike

/**
 * @deprecated Use {@link RedisInvalidator.IConfig}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IRedisInvalidatorConfig = RedisInvalidator.IConfig

const DEFAULT_CHANNEL = 'duck-iam:invalidate'

/**
 * Creates a cross-instance cache-invalidation broadcaster backed by Redis pub/sub.
 *
 * Delivery is at-least-once: every engine's local invalidate methods are
 * idempotent so re-applying the same event is safe. Filters self-published
 * events via an instance UUID embedded in the payload - without this guard
 * every local invalidate would echo back through the subscriber and re-clear
 * caches we just rebuilt.
 *
 * @template TRole - Role identifier union the engine is parameterised over.
 * @param config - Supplies the client and optional channel; see {@link RedisInvalidator.IConfig}.
 * @returns An {@link EngineTypes.IInvalidator} bound to the configured channel.
 * @example
 * ```ts
 * import { createRedisInvalidator } from '@gentleduck/iam/invalidators/redis'
 *
 * const engine = new Engine({
 *   adapter,
 *   invalidator: createRedisInvalidator({ client: redisPubSub }),
 * })
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createRedisInvalidator<TRole extends string = string>(
  config: RedisInvalidator.IConfig,
): EngineTypes.IInvalidator<TRole> {
  const channel = config.channel ?? DEFAULT_CHANNEL
  const instanceId = generateInstanceId()
  const handlers = new Set<(event: EngineTypes.IInvalidateEvent<TRole>) => void>()

  let subscribed = false
  const ensureSubscribed = () => {
    if (subscribed) return
    subscribed = true
    void Promise.resolve(
      config.client.subscribe(channel, (message) => {
        const parsed = safeParse<{ instanceId: string; event: EngineTypes.IInvalidateEvent<TRole> }>(message)
        // Drop messages that originated on this instance - local mutations
        // already cleared local caches; replaying would just double the work
        // and risk an invalidation storm under high write QPS.
        if (!parsed || parsed.instanceId === instanceId) return
        for (const h of handlers) h(parsed.event)
      }),
    )
  }

  return {
    publish(event) {
      const payload = JSON.stringify({ instanceId, event })
      try {
        config.client.publish(channel, payload)
      } catch {
        // Publish failure is non-fatal: local invalidate already applied,
        // remote nodes will pick up the change on TTL. Swallowing matches
        // the same fail-soft contract used by `engine.hooks.onError`.
      }
    },
    subscribe(handler) {
      ensureSubscribed()
      handlers.add(handler)
      return () => {
        handlers.delete(handler)
        if (handlers.size === 0) {
          subscribed = false
          void config.client.unsubscribe?.(channel)
        }
      }
    },
  }
}

function safeParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

function generateInstanceId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID()
  return `iam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
