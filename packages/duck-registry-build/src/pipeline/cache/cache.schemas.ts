import { z } from 'zod'

/**
 * Per-phase cache payload schemas.
 *
 * The cache envelope is validated by `cacheManifestSchema` in `cache.ts`; this
 * file pins the shape of each known phase's payload. A tampered
 * `build-cache.json` whose envelope passes the outer schema can still inject
 * arbitrary data into individual phases — and those payloads flow into
 * `removeStaleFiles` (`fs.ts`) which calls `fs.rm` on each listed path. The
 * per-phase schemas here cap array sizes and enforce primitive types so the
 * cache can never carry an unbounded delete list or non-string entries; the
 * actual path-containment check happens at the fs sink with `assertPathWithinBases`.
 */

// Cap how many output paths a single phase can ever cache. Real registries are
// far below this; the cap exists to bound the blast radius of a tampered cache.
const MAX_PHASE_OUTPUT_FILES = 10_000

const phaseOutputFilesSchema = z.array(z.string()).max(MAX_PHASE_OUTPUT_FILES)

const componentsCacheEntrySchema = z.object({
  outputFile: z.string(),
  signature: z.string(),
  staticSignature: z.string(),
})

export const componentsPhaseCacheSchema = z.object({
  entries: z.record(z.string(), componentsCacheEntrySchema),
  outputFiles: phaseOutputFilesSchema,
})

export const colorsPhaseCacheSchema = z.object({
  outputFiles: phaseOutputFilesSchema,
  signature: z.string(),
})

const indexBuildCacheEntrySchema = z.object({
  // Indexed entries are large + heterogeneous; the index phase rebuilds the
  // shape itself so we deliberately keep this loose. The dangerous payload for
  // the cache-tampering threat model is the `outputFiles` arrays on the other
  // phases, not the indexed entries themselves.
  indexedEntries: z.array(z.record(z.string(), z.unknown())),
  signature: z.string(),
  staticSignature: z.string(),
})

export const indexBuildPhaseCacheSchema = z.object({
  entries: z.record(z.string(), indexBuildCacheEntrySchema),
})

/**
 * Known phase payloads. `.partial()` so older cache files missing a phase
 * still validate; `.passthrough()` preserves payloads for extension-defined
 * phase names. Known phase keys are still strictly validated against their
 * per-phase schema — the dangerous `outputFiles` arrays in `components` /
 * `colors` cannot be smuggled in via the passthrough path because those keys
 * collide with the strict per-phase schemas. Extension payloads are unknown
 * by design and gated by per-extension cache-state schemas at the call site.
 */
export const phasesCacheSchema = z
  .object({
    colors: colorsPhaseCacheSchema,
    components: componentsPhaseCacheSchema,
    index: indexBuildPhaseCacheSchema,
  })
  .partial()
  .passthrough()
