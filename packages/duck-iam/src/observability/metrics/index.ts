import type { EngineTypes } from '../../core/engine/engine.types'

/**
 * Metrics observability types. Type-only namespace - zero bundle cost.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Metrics {
  /**
   * Aggregates the engine's `onMetrics` events in-process.
   *
   * Wire `.record` into `hooks.onMetrics` and read `.snapshot()` on demand (a
   * `/metrics` route, a Prom scrape, an OTel exporter). Holds a rolling sample
   * of recent durations to compute p50 / p95 / p99 without pulling in a
   * histogram library. Sample size defaults to `1000`; beyond that the oldest
   * sample is evicted via a fixed-size ring buffer.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAggregator {
    /**
     * Records a single metrics event. Bind directly to {@link EngineTypes.IHooks.onMetrics}.
     *
     * @param event - Receives the metrics event emitted by the engine after every check.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    record(event: EngineTypes.IMetricsEvent): void
    /**
     * Computes the current rolling snapshot. Callers can poll at any interval.
     *
     * @returns Immutable {@link ISnapshot} summarising the rolling window.
     * @author wildduck2 <https://github.com/wildduck2>
     */
    snapshot(): ISnapshot
    /**
     * Resets counters and clears the rolling sample buffer.
     *
     * @author wildduck2 <https://github.com/wildduck2>
     */
    reset(): void
  }

  /**
   * Immutable snapshot of aggregated metrics over the rolling window.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ISnapshot {
    /** Total events recorded since the last reset. */
    readonly total: number
    /** Number of allow verdicts. */
    readonly allow: number
    /** Number of deny verdicts. */
    readonly deny: number
    /** p50 latency in milliseconds over the rolling window. */
    readonly p50: number
    /** p95 latency in milliseconds over the rolling window. */
    readonly p95: number
    /** p99 latency in milliseconds over the rolling window. */
    readonly p99: number
    /** Maximum latency in the rolling window. */
    readonly max: number
    /** Window size (capped by the configured `sampleSize`). */
    readonly samples: number
  }

  /**
   * Configures {@link createMetricsAggregator}.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IConfig {
    /**
     * Maximum number of duration samples kept in the rolling window. Higher
     * values give more accurate tail percentiles at the cost of memory.
     * Defaults to `1000`.
     */
    sampleSize?: number
  }
}

/**
 * @deprecated Use {@link Metrics.IAggregator}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IMetricsAggregator = Metrics.IAggregator

/**
 * @deprecated Use {@link Metrics.ISnapshot}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IMetricsSnapshot = Metrics.ISnapshot

/**
 * @deprecated Use {@link Metrics.IConfig}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IMetricsAggregatorConfig = Metrics.IConfig

/**
 * Creates an in-process metrics aggregator with a fixed-size ring buffer for
 * latency percentiles and running counters for allow/deny verdicts.
 *
 * Bind `.record` to {@link EngineTypes.IHooks.onMetrics} and read `.snapshot()`
 * on demand.
 *
 * @param config - Optionally overrides the sample size; see {@link Metrics.IConfig}.
 * @returns A new {@link Metrics.IAggregator} instance with zeroed counters.
 * @example
 * ```ts
 * const metrics = createMetricsAggregator({ sampleSize: 2000 })
 * const engine = new Engine({ adapter, hooks: { onMetrics: metrics.record } })
 * app.get('/metrics', (_, res) => res.json(metrics.snapshot()))
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createMetricsAggregator(config: Metrics.IConfig = {}): Metrics.IAggregator {
  const cap = config.sampleSize ?? 1000
  const buf = new Float64Array(cap)
  let head = 0
  let count = 0
  let total = 0
  let allow = 0
  let deny = 0

  return {
    record(event) {
      total++
      if (event.allowed) allow++
      else deny++
      buf[head] = event.durationMs
      head = (head + 1) % cap
      if (count < cap) count++
    },
    snapshot() {
      if (count === 0) {
        return { total, allow, deny, p50: 0, p95: 0, p99: 0, max: 0, samples: 0 }
      }
      // Copy the live region of the ring buffer + sort to compute percentiles.
      // O(n log n) per snapshot; fine at the cap (<= 1000) and avoids a
      // streaming-quantile dependency.
      const sorted = Array.from(buf.subarray(0, count))
      sorted.sort((a, b) => a - b)
      return {
        total,
        allow,
        deny,
        p50: percentile(sorted, 0.5),
        p95: percentile(sorted, 0.95),
        p99: percentile(sorted, 0.99),
        max: sorted[sorted.length - 1] ?? 0,
        samples: count,
      }
    },
    reset() {
      head = 0
      count = 0
      total = 0
      allow = 0
      deny = 0
    },
  }
}

function percentile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0
  const i = Math.max(0, Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1))
  return sorted[i] ?? 0
}
