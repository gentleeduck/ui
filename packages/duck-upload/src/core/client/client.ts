import { Defaults } from '../utils/constants'
import type { Client } from './client.types'

/**
 * Apply defaults to a partial {@link Client.IUploadConfig}.
 *
 * @param input Partial config from the caller. Nested groups
 *   (e.g. `effectQueueCompaction`) accept their own partial shape.
 * @returns Fully populated config with each numeric field clamped to a sane
 *   minimum.
 * @template P Purpose string union.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function resolveUploadConfig<P extends string>(input?: Client.UploadConfigInput<P>): Client.IUploadConfig<P> {
  return {
    maxConcurrentUploads: Math.max(1, input?.maxConcurrentUploads ?? Defaults.MAX_CONCURRENT_UPLOADS),
    autoStart: input?.autoStart,
    progressThrottleMs: Math.max(0, input?.progressThrottleMs ?? Defaults.PROGRESS_THROTTLE_MS),
    validation: input?.validation ?? {},
    maxAttempts: Math.max(1, input?.maxAttempts ?? Defaults.MAX_ATTEMPTS),
    retryPolicy: input?.retryPolicy,
    maxItems: input?.maxItems === null ? null : Math.max(1, input?.maxItems ?? Defaults.MAX_ITEMS),
    completedItemTTL: input?.completedItemTTL,
    effectConcurrency: Math.max(1, input?.effectConcurrency ?? Defaults.EFFECT_CONCURRENCY),
    effectTimeoutMs: Math.max(0, input?.effectTimeoutMs ?? Defaults.EFFECT_TIMEOUT_MS),
    errorContextInMessage: input?.errorContextInMessage ?? false,
    keepRawCause: input?.keepRawCause ?? false,
    effectQueueCompaction: {
      minHead: Math.max(1, input?.effectQueueCompaction?.minHead ?? 64),
      ratioDenom: Math.max(2, input?.effectQueueCompaction?.ratioDenom ?? 2),
      maxQueueLength:
        input?.effectQueueCompaction?.maxQueueLength === null
          ? null
          : Math.max(1, input?.effectQueueCompaction?.maxQueueLength ?? 10_000),
    },
    checksumMaxSize:
      input?.checksumMaxSize === undefined
        ? null
        : input.checksumMaxSize === null
          ? null
          : Math.max(0, input.checksumMaxSize),
    checksumChunkBytes:
      input?.checksumChunkBytes === undefined
        ? null
        : input.checksumChunkBytes === null
          ? null
          : Math.max(1, input.checksumChunkBytes),
    strictRebindType: input?.strictRebindType ?? false,
  }
}
