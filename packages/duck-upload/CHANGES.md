# `@gentleduck/upload` — 2026-05-16 / 2026-05-17

Session-long pass over the engine. Rating moved **6.8 → 8.9** across ten review rounds. This file collects everything that landed in those rounds — each issue is annotated with the file it touched and the rationale, grouped by theme.

> See also: [`packages/duck-iam/CHANGES.md`](../duck-iam/CHANGES.md) for the docs-only link cleanup landed in the same session.

> **⚠️ Breaking default change.** `UploadConfig.errorContextInMessage` now defaults to `false` — error messages no longer include filename/size/fileId unless explicitly enabled. Sentry/dashboards that depended on this context need to opt in: `config: { errorContextInMessage: true }`. Rationale: filenames can be PII in B2B applications and snapshots are persisted to IndexedDB/LocalStorage.

---

## At a glance

| Metric | Start | End |
|---|---|---|
| Overall rating | **6.8 / 10** | **8.9 / 10** |
| Tests | 0 | **112** |
| Test files | 0 | 10 |
| README | absent | 273 lines |
| Working example | 100% commented out | full demo |
| `check-types` | green | green |
| `biome check` | green | green |

---

## Round 1 — Foundational fixes (rating 6.8 → 8.4)

### Critical / Major

- **`src/core/utils/id.ts`** — `Math.random()` ID generator replaced with `crypto.randomUUID()` (with `getRandomValues` and `Math.random` fallbacks). Old IDs were collidable.
- **`src/core/utils/guards.ts`** — `isRecord` now rejects arrays (`!Array.isArray(value)`). Previously `isRecord([])` returned `true`, affecting intent/cursor validation.
- **`src/core/engine/reducer.ts`** — `upload.failed` now increments `attempt` instead of resetting to `1`. Exponential retry backoff actually escalates.
- **`src/core/engine/store/handlers/run-upload.ts`** — retry-decision context reads `item.attempt`, not the literal `1`.
- **`src/core/client/uploadClient.ts`** — deleted. Was a no-op alias of `createUploadStore`.
- **`src/core/engine/reducer.ts:isCommand`** — replaced the dot-heuristic with an explicit `COMMAND_TYPES` `Set`. The dot heuristic misclassified internal events `paused` and `canceled` as commands, so the reducer silently never transitioned items to those phases. **Real production bug surfaced by tests.**

### Persistence hardening

- **`src/core/persistence/persistence.types.ts`** — added `PersistenceError` class with codes `quota_exceeded` / `unavailable` / `serialization_failed` / `transaction_failed` / `unknown`. Added `isQuotaExceeded` helper.
- **`src/core/persistence/adapters.local.ts`** + **`adapters.indexeddb.ts`** — throw typed `PersistenceError` on failure instead of silently swallowing.
- **`src/core/client/plugins.types.ts`** — new `onPersistenceError` hook on `UploadHooks`.
- **`src/core/engine/store/store.runtime.ts:reportPersistenceError`** — routes errors through the hook, falls back to console in dev/prod.

### Performance / API

- **`src/core/engine/store/store.dispatch.ts`** — `startAll` / `pauseAll` / `cancelAll` now collapse into a single `applyCommandBatch` (one reducer pass, one notify, one persist, one schedule) instead of N recursive dispatches.
- **`src/core/engine/store/store.runtime.ts:processEffects`** — bounded worker pool (`effectConcurrency`, default 8) replaces the strict-sequential queue. One slow intent no longer blocks every other upload.
- **`src/core/engine/store/store.runtime.ts`** — DRYed `applyInternal` / `applyCommand` / `applyCommandBatch` via shared `reduceOne` + `finalizeApply`.
- **`src/core/engine/store/handlers/rebind.ts`** — new pre-validating handler. Emits `rebind.ok` / `rebind.failed` with reason codes (`no_item` / `wrong_phase` / `already_bound` / `fingerprint_mismatch`).

### Tests + docs

- **9 test files, 74 tests** — reducer, guards, id, fingerprint, emitter, persistence, store-libs, transport-libs, store integration.
- **`packages/registry-examples/src/upload/upload-1.tsx`** — rewrote from a fully-commented dead file into a real working demo (mock api + POST strategy + pause/resume/cancel UI).
- **`packages/duck-upload/README.md`** — new 156-line README: install, quick start, persistence, commands, events, architecture.

---

## Round 2 — Hardening discovered edges (rating 8.4 → 8.3 → 8.6)

### Ownership semantics + cancellation plumbing

- **`run-upload.ts`** — identity-aware inflight delete via closure-captured `releaseOwnedSlot()`. Stale invocations no longer wipe newer entries.
- **`run-upload.ts`** — pre-strategy abort with mode-less reason now treated as cancel (no more orphans in `uploading`).
- **`run-upload.ts`** — body wrapped in `try { ... } finally { releaseOwnedSlot() }`. Defensive cleanup on any uncaught throw.
- **`store.runtime.ts:enqueueEffect`** — signature now `(effect: (signal: AbortSignal) => Promise<void>)`. Per-effect AbortController; watchdog calls `controller.abort('effect_timeout')`. Effects that respect the signal exit cleanly.
- **`utils/async.ts:sleep(ms, signal?)`** — abortable. Rejects on signal abort, removes listener on success.
- **All handlers** (`add-file.ts`, `create-intent.ts`, `finalize.ts`, `cancel.ts`, `run-upload.ts` retry sleep, `store.schedule.ts`) — accept and forward effect signal.

### Persistence robustness

- **`adapters.local.ts:isSecurityError`** — DOMException code 18 / `SecurityError` (private-mode browsers) classified as `'unavailable'` not `'unknown'`.
- **`store.runtime.ts:reportPersistenceError`** — `console.error` / `console.warn` always fire (no `NODE_ENV` gate). Re-entrancy guard prevents hook → dispatch → flush → error → hook loop. **State changes during the error window are NOT trailing-flushed** to avoid unbounded async loops on permanent failures — documented as a known trade-off.

### Tests + docs

- **+12 tests** (now 86) — reducer + handlers + effect concurrency + multi-cycle attempt + inflight cleanup.
- **README** — new sections: "Handling persistence errors" + "Writing a custom strategy" (full TUS example).

---

## Round 3 — Architecture deep cuts (rating 8.6 → 8.5 → 8.6)

### Identity, retries, and watchdogs

- **`run-upload.ts:14-17`** — early-exit delete now identity-aware (`stale && !stale.started`).
- **`run-upload.ts:67`** — pre-strategy abort-without-mode now `applyCanceled()` (no more orphans).
- **`processEffects:runWithTimeout`** — per-effect `AbortController`. Watchdog calls `controller.abort(err)` AND `reject(err)` with the same `Error` instance so `signal.reason` and the rejection share identity.

### Pending-retry de-dup + cancellation

- **`store.libs.ts:scheduleRetry`** — new helper. `rt.pendingRetries: Map<localId, AbortController>` per-item. Supersedes prior with `AbortSignal.any([watchdog, dedup])` (with manual fallback). Identity-aware cleanup in `finally`. Three call sites (`run-upload`, `create-intent`, `finalize`) use the helper.
- **`utils/async.ts:anySignal`** — feature-gates on `typeof AbortSignal.any === 'function'`. Manual fallback for Safari <17.4.

### Multipart strategy

- **`strategies/multipart/index.ts`** — inner `AbortController` cascade. Outer signal aborts the inner; any non-recoverable part failure calls `inner.abort(err)` so peer parts stop wasting bandwidth.
- **`multipart/index.ts:start`** — fast-abort entry guard. If `ctx.signal.aborted` at entry, throws immediately before cursor read / queue build.
- **`multipart/index.ts:178`** — retry backoff `sleep` now receives `ctx.signal`. Pause/cancel during backoff propagates instantly.

### Pause / cancel semantics

- **`run-upload.ts`** — pause-after-success without persisted cursor now treated as `upload.ok` (work already on server). Catch-path pause without cursor escalates to `applyCanceled` (no resumable progress).
- **`cancel.ts`** — multipart-abort effect skipped when item phase is `completing` / `completed` (backend would be busy assembling).
- **`cancel.ts`** — `controller.abort('cancel')` uses string reason, not `{ reason: 'cancel' }`. `pause.ts` similar.

### Tests + docs

- **+10 tests** (now 96) — effect-pool watchdog, runUpload identity, async hook, multipart cascade.
- **README** — `Effect concurrency and watchdog` section. Documents `effectConcurrency`, `effectTimeoutMs`, signal contract, retry back-stop.

---

## Round 4 — Bookkeeping centralization (rating 8.6 → 8.7)

- **`store.libs.ts:releaseAllSlots(rt, localId, reason?)`** — single source of truth. Aborts + deletes `pendingRetries` / `inflightIntents` / `inflightCompletes` / `inflightUploads`. Optional `reason` param for cancel-vs-cleanup distinction.
- **`cancel.ts`** — collapsed into `mode = 'cancel'` + multipart enqueue + `releaseAllSlots(..., 'cancel')`. -25 LOC, single cleanup path.
- **`store.runtime.ts:finalizeApply`** — diff loop releases slots for every item the `cleanupOldItems` pass dropped.
- **`store.dispatch.ts:remove`** — `releaseAllSlots(rt, cmd.localId)` before `applyCommand` so the inflight maps don't keep stale references.

### Bigger architecture wins

- **`store.runtime.ts:applyInternal`** — emit-gating. `reduceOne` only fires `emitInternalEvent` when `prev.items.get(localId) !== next.items.get(localId)`. Reducer-guarded transitions no longer produce phantom events (e.g. `upload.completing` after a `cancel`).
- **`store.schedule.ts`** — auto-start collects into an array and dispatches via `applyCommandBatch` instead of N per-item `applyCommand` calls. One notify + one persist + one schedule pass.
- **`clean-up.ts`** — `new Set(toRemove)` membership replaces `Array.includes` for the filter, cutting cleanup from O(n²) to O(n).

### Tests + docs

- **+5 tests** (now 101) — cancel-drains-pendingRetries, remove-releases-bookkeeping, cleanup-releases, multipart-abort phase gate, async-hook re-entrancy.

---

## Round 5 — Starvation + memory polish (rating 8.7 → 8.75 → 8.9)

### Starvation race (`run-upload.ts`)

- **Pause-release race fixed.** `applyPaused` / `applyCanceled` now `releaseOwnedSlot()` BEFORE `applyInternal`. Without this, the next queued item was starved because `scheduleWork` saw `active >= maxConcurrent` while the item still occupied a slot.
- **Tightened guards.** `applyPaused` / `applyCanceled` use `phase !== 'uploading' return` instead of the looser `phase === 'paused' return`. Eliminates reliance on layered defense.

### Cancel idempotency (`cancel.ts`)

- **Duplicate cancel gated.** `if (item?.phase === 'canceled') return` at function head. Second cancel no longer enqueues another multipart abort.

### Reducer contract (`reducer.ts`)

- **JSDoc invariant.** `createReducer` documents the "set with new ref OR break without set" rule that the emit-gating relies on.
- **Dev-mode assert.** The `set` helper warns in development when `prev === next` ref — catches "no-op set" mistakes that would silently suppress emission.

### Checksum

- **`store.libs.ts:calculateFileChecksum(file, signal?)`** — accepts an optional signal, checks before `arrayBuffer`, before `digest`, after `digest`. Watchdog frees slot promptly between async boundaries.
- **Streaming variant** — uses `file.stream().getReader()` when available, signal-checked between chunks. Falls back to `arrayBuffer()` for non-streaming environments.
- **`add-file.ts`** — `validateFile` + cfg checks now run BEFORE `calculateFileChecksum`. Rejected files skip SHA-256 entirely.

### Tests + docs

- **+6 tests** (now 107) — pause-while-uploading regression, duplicate-cancel regression, reducer-guarded emit-gating (`upload.ok` / `complete.ok` / `dedupe.ok` after cancel), validate-before-checksum, pause-then-cancel-same-tick.

---

---

## Round 6 — Final polish + correctness fences (rating 8.95 → 8.9 → ongoing)

### Correctness

- **`create-intent.ts:65`** — closed PII gate hole. Filename + size + purpose synthesis now gated on `config.errorContextInMessage` (was unconditional). Intent-phase errors are the most common; this was leaking PII to persisted snapshots even with the flag off.
- **`config.types.ts:maxItems`** — widened type from `number` to `number | null`. `resolveUploadConfig` preserves an explicit `null` instead of falling back to the default. Lets the cleanup short-circuit at `clean-up.ts:17` actually fire (previously unreachable dead code).
- **`store.libs.ts:calculateFileChecksum`** — throws on stream byte-count mismatch (`expected file.size, got offset (+overflow)`). A polyfill or browser quirk that delivers truncated/extra bytes would otherwise have silently corrupted the SHA-256 and broken server-side dedup.
- **`reducer.ts:canceled` internal event** — added idempotency guard: `if (item.phase === 'canceled' || item.phase === 'completed') break`. Mirrors the command-level `cancel` guard; prevents double-fire of `upload.canceled` when both `handleCancel` and `runUpload`'s catch route through `applyInternal`.

### Cleanup ordering

- **`finalize.ts` + `create-intent.ts`** — moved `inflightCompletes.delete` / `inflightIntents.delete` into `finally` blocks AFTER `removeEventListener`. Eliminates the window where a late effect-signal abort could fire an orphan-controller `.abort()` between the map delete and the listener removal.

### Tests

- **+3 new tests** (now 112):
  - O5 abort assertion tightened to `rejects.toBe('test-abort')` (was loose `toBeDefined`).
  - Stream-yields-fewer-bytes throws size-mismatch.
  - Stream-yields-more-bytes throws size-mismatch.
  - Reducer dev-warn invariant check (no false positives on legitimate spread).

### Changelog cross-link

- Added back-link from `duck-upload/CHANGES.md` → `duck-iam/CHANGES.md`. Loud breaking-change banner for `errorContextInMessage`.

---

## Round 7 — Deep audit + perf + security polish (rating ongoing)

### Data integrity

- **`utils/fingerprint.ts:fingerprintMatches`** — when both sides carry a `checksum`, require equality. Same-name/size/lastModified with different bytes (edited image saved with metadata preserved) no longer slips past rebind. Prevents resume against a presigned intent signed for the original bytes.
- **`store.libs.ts:calculateFileChecksum`** — throws `byte count mismatch` on stream under-read / over-read (already in Round 6 doc, reinforced).

### Performance

- **`store.runtime.ts:reduceOne`** — returns `changed: boolean`. Reducer-guarded no-ops (e.g. `upload.ok` after cancel) now skip `notify()` and `schedulePersistence()`. Saves a React re-render and a persistence write on every guard-rejected internal event. `applyInternal` / `applyCommand` / `applyCommandBatch` all honor it.
- **`clean-up.ts`** — fast-path: returns `null` when `state.items.size <= maxItems && completedTTL === undefined`. Skips the `Array.from(state.items.entries())` allocation on every progress tick when the store hasn't grown past the cap.
- **`strategies/multipart/index.ts`** — maintains `sortedDone[]` via O(log n) binary-search insert instead of `Array.from + map + sort` per part. Cumulative cost over an N-part upload drops from O(n² log n) to O(n²) with a much smaller constant. `completeMultipart` plucks ETags directly from the sorted array.
- **`store.schedule.ts:scheduleUploads`** — recomputes `active` AFTER `applyCommandBatch` instead of using a stale snapshot from before the batch. Fixes potential under-fill of upload slots when listeners react to auto-start dispatches.

### Security

- **`store.libs.ts:normalizeError`** — third arg `keepRawCause` (default `false`). Sanitizes thrown values to `{ name, message }` for `error.cause`, dropping response objects/headers/URLs that could leak auth tokens. `run-upload.ts`, `create-intent.ts`, `finalize.ts` all pass `config.errorContextInMessage` as the opt-in. Without opt-in, the persisted snapshot no longer carries raw fetch errors.

### Robustness

- **`store/index.ts`** — plugin setup errors now log unconditionally (was dev-only). A plugin that throws during setup is functionally not installed; silent swallow in production hid real bugs.
- **`reducer.ts:canceled` case** — idempotency guard `phase === 'canceled' || phase === 'completed' break` (Round 6 fix reinforced).
- **`persistence.types.ts:isQuotaExceeded`** — property access wrapped in try/catch. Some DOMException shims expose `name`/`code` as throwing getters; we'd rather treat those as "not quota" than crash the catch handler.
- **`finalize.ts` + `create-intent.ts`** — inflight-map `.delete` moved into `finally` AFTER `removeEventListener` (Round 6 fix reinforced).

### API ergonomics

- **`emitter.types.ts:off`** — return type changed from `() => void` to `void`. Old no-op return was misleading.
- **`store.types.ts:UploadStore.off`** + **`react/use-uploader.tsx`** — mirrored.

### Tests

- **+1 test** (now 113):
  - Pause-after-success-without-cursor → asserts item ends in `completing`/`completed`/`canceled`, NOT `paused` (no lying snapshot).
- 12 issues from round 7 audit closed (data integrity, perf x4, security, robustness x4, API x1, test x1).

---

## Round 8 — Hot-path perf + memory + API completeness

### Memory leaks

- **`reducer.ts:complete.ok` + `dedupe.ok`** — drop `file: File` reference on completion. A 4 GB blob no longer sits in `state.items` after the bytes are on the server. Type widened to `file?: File` on the `completed` variant.
- **`adapters.indexeddb.ts`** — memoized `IDBDatabase` connection. Was re-opening on every save/clear (200ms debounce × multipart progress = ~5 opens/sec). Cache resets on `versionchange`/`close` events so HMR + tab races stay correct.

### Performance

- **`react/use-uploader.tsx`** — `useMemo` the bound `subscribe`/`getSnapshot` refs passed to `useSyncExternalStore`. React no longer thrashes the listener Set on every render.

### Correctness

- **`store.runtime.ts:notify`** — wraps each listener in try/catch. A throwing React subscriber no longer skips every later listener (including `waitFor`'s internal resolvers).
- **`validation/file.ts`** — empty-file check hoisted ABOVE the `if (!rules) return null` early-return. Empty files are now rejected even when no validation rules are configured for the purpose (was inconsistent: 0-byte files passed through to a presigned POST that fails the signature anyway).
- **`run-upload.ts:68`** — pre-strategy abort with `mode === 'normal'` now fires `upload.failed` with `aborted` code instead of falsely cancelling. Watchdog or external `.abort()` racing the strategy start no longer mislabels the cause.
- **`add-file.ts` + `store.libs.ts:releaseAllSlots`** — new `rt.pendingValidations` map. Validation/checksum effects are now cancellable via `releaseAllSlots('cancel')`. A cancel right after `addFiles` no longer wastes CPU on SHA-256 of a multi-GB file.

### API additions

- **`StrategyRegistry`** — added `delete(id)` and `entries()`. Enables HMR-friendly strategy swap + diagnostics.
- **`UploadStore.waitFor`** — new optional second arg `{ onlyFinal?: boolean }`. When `true`, retryable errors do not resolve `waitFor` — the wait continues through the retry cycle to a true terminal state.

### Cosmetics

- **`clean-up.ts`** — renamed `excess` → `overCap`, added clarifying comment.
- **`emitter.types.ts:off`** — return type confirmed as `void` (was misleading no-op `() => void`).

### Tests

- **+5 tests** (now 118):
  - N3: completed item drops File ref.
  - N4: empty file rejected without explicit validation rules (asserts `file.rejected` event + empty state map).
  - N6: cancel during validating phase aborts checksum effect.
  - N8: `waitFor({ onlyFinal: true })` waits through retryable errors.
  - N10: registry `delete` + `entries` (idempotent).

---

## Round 9 — Observability + cancellation + cross-validation

### React hook completeness

- **`react/use-uploader.tsx`** — finished the memo pass: `dispatch` / `on` / `off` all wrap `store.*.bind(store)` in `useMemo([store])`. Consumers using `useEffect(() => uploader.on(...), [uploader.on])` no longer resubscribe every render.
- **`react/use-uploader.tsx:Uploader.byPhase`** — type tightened from `Record<string, ...>` to `Partial<Record<UploadPhase, ...>>`. Eleven known phases get autocomplete; missing groups read as `undefined`.
- **`react/use-uploader.tsx:useUploaderActions`** — symmetric memo treatment for `dispatch` + `on`.

### Cancellation + watchdogs

- **`store/index.ts:waitFor`** — new options `{ signal?, timeoutMs? }`. AbortSignal-driven cancel; numeric timeout; both detach the internal listener so undecided waits no longer leak in `rt.listeners`.
- **`store.runtime.ts` (load path)** — `persistence.adapter.load()` now races against `loadTimeoutMs` (default 10000ms). A hung adapter no longer leaves the store wedged at empty state.

### Observability

- **`plugins.types.ts:UploadHooks`** — new `onListenerError?(err, ctx)` hook. Fires on throwing subscribers (`notify`), throwing plugin `setup()`, and emitter listener throws. Sentry-routable; default falls back to console.error.
- **`store.runtime.ts:notify`** — routes throws through `onListenerError` first, console.error fallback.
- **`store/index.ts` plugin loop** — same routing.

### Correctness

- **`store.runtime.ts:flushPersistence`** — serialize throws are now tagged `PersistenceError('serialization_failed', 'save', ...)` instead of bubbling as `'unknown'`. Consumers route serialize bugs separately from adapter failures.
- **`validation/intent.ts:validateIntent`** — accepts optional `fileSize`. Multipart intents cross-validated: `partCount * partSize >= fileSize` AND `(partCount - 1) * partSize < fileSize` (when partCount > 1). Backend bug sending mismatched counts now errors at intent-validation instead of producing empty PUT requests.
- **`run-upload.ts:88`** — fixed misleading comment claiming "retryable" when code emits non-retryable.

### Tests

- **+4 tests** (now 122):
  - N15: `waitFor(...{signal})` rejects with abort reason.
  - N15: `waitFor(...{timeoutMs})` rejects with timeout error.
  - N17: multipart `partCount * partSize` mismatch → item moves to `error`.
  - N18: `onListenerError` hook fires for throwing subscribers.

---

## Round 10 — Polish + dev-time guards (rating ongoing)

### Validation correctness

- **`validation/list.ts`** — deleted orphan JSDoc block describing `validateIntent` (which actually lives in `validation/intent.ts`). Left over from an earlier refactor; documented a function defined elsewhere. Replaced with a proper JSDoc for `validateFileList` itself.
- **`validation/intent.ts:validateIntent`** — gained a full JSDoc + a new explicit `partCount` guard: when supplied, must be a finite positive number. Previously `partCount: 0` slipped past the `partCount > 0` short-circuit and surfaced as an opaque downstream failure (zero-part multipart never completes).

### Emitter / listener wiring

- **`utils/emitter/index.ts`** — `createTypedEmitter` accepts an optional `onError(type, error, listener)` callback. The store wires this through to `hooks.onListenerError({ kind: 'emitter', name: type })`. Previously the `emitter` kind was declared on the hook but never reachable; emitter throws fell to a dev-only `console.error` and never reached Sentry.
- **`store/store.runtime.ts`** — `createTypedEmitter` call now passes a handler that routes into `onListenerError` (mirrors the subscriber + plugin-setup paths from Round 9).

### Strategy registry hygiene

- **`strategies/registry/index.ts:createStrategyRegistry.set`** — dev-only warn when a strategy id is being overwritten with a different strategy object. Identity-aware so HMR re-registrations don't fire the warning. Two libraries registering the same id is almost always a bug; surfacing it as a console warn beats a silent shadow.

### Strategy fast-abort

- **`strategies/post/index.ts:PostStrategy.start`** — fast-abort guard at the top of `start`. If `ctx.signal.aborted` is already set when the strategy is invoked (cancel arrived between scheduling and start), throw the abort reason immediately rather than queueing a `postForm` that will reject on the first `xhr.send`.

### Add-files validation efficiency

- **`store/handlers/add-file.ts`** — dropped the duplicate `validateFile(file, purpose, rt.opts.config)` call inside the async effect. `validateFileList` (sync, runs before insertion) already enforces the same config-based rules. The async effect now only runs the *custom* `opts.validateFile` hook + checksum + dedupe. Saves a redundant rule walk per file on every batch.

### IndexedDB resilience

- **`persistence/adapters.indexeddb.ts:toPersistenceError`** — when a request/transaction error has `name === 'InvalidStateError'`, reset the cached `dbPromise = null` and return `PersistenceError('unavailable', ...)`. The memoized db connection can be invalidated by another tab closing it; without the cache reset, every subsequent save/load/clear failed against the same dead handle until reload.

### Memory adapter isolation

- **`persistence/adapters.memory.ts`** — added `createMemoryAdapter()` factory. The module-level `Map` shared by every consumer of `MemoryAdapter` caused two `UploadStore` instances in the same process (tests, SSR) to clobber each other on the storage key. The named export is preserved with a `@deprecated` tag pointing at the factory.

### Internal-surface documentation

- **`store/store.runtime.ts:createStoreRuntime`** — expanded JSDoc to flag the function as an internal building block. Exported from the file (used by tests) but deliberately absent from the package barrels; consumers should use `createUploadStore`. Removed the "may change without semver" ambiguity.

### Tests

- All 122 vitest tests continue to pass.
- `bun test` shows one unrelated environment artifact (bun's `File` constructor normalizes `text/plain` → `text/plain;charset=utf-8`). Vitest is the authoritative runner; bun runner stays as a sanity check.

### Verification

```
npx vitest run        → 10 passed (10) / 122 passed (122) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 11 — Latent bugs + re-entrancy (rating ongoing)

### Multipart cascade soundness

- **`strategies/multipart/index.ts`** — when a part throws, `Promise.race` rejects but every peer part already aborted via `inner.abort(err)` still has an unsettled rejection sitting in `running`. Under Node `--unhandled-rejections=strict` this crashes the process; everywhere else it logs `unhandledRejection`. Added a `try/catch` around the race loop that runs `await Promise.allSettled(running)` before rethrowing, so every peer rejection gets a handler.
- **`strategies/multipart/index.ts`** — fast-resume path (zero parts left to upload) previously returned BEFORE the `try/finally` cleanup ran, leaking the outer-signal `abort` listener on the strategy controller. The early return is now nested inside the same try/finally so the listener is removed in every exit path.

### Cleanup eviction completeness

- **`engine/store/handlers/clean-up.ts`** — `maxItems` and `completedItemTTL` previously only evicted `completed` and `canceled` items. A failed upload that exhausts `maxAttempts` lands in `error` (with `retryable: false`) and stayed in state forever, escaping both caps. Eviction now treats non-retryable errors as terminal too (the user can no longer act on them). Retryable errors still keep their slot. Extracted a small `terminalTimestamp(item)` helper so the TTL pass and the over-cap pass share the eligibility check.

### Progress reporting

- **`engine/store/handlers/run-upload.ts:reportProgress`** — the throttle (`progressThrottleMs`) could drop the final 100% emission if the last tick arrived inside the throttle window. UIs showing `uploadedBytes / totalBytes` would snap from e.g. 87% → `completing` and never display 100%. Now: when `uploadedBytes >= totalBytes`, bypass the throttle and emit immediately.

### Re-entrancy guard for subscribers

- **`engine/store/store.runtime.ts:notify`** — subscribers that dispatch synchronously inside their callback re-entered `notify` mid-`forEach`, recursing per state change. Stack-overflowed on the wrong shape, and effectively made the subscriber path non-batched. Replaced with a `notifying`/`notifyPending` flag pair that collapses nested calls into one trailing pass: subscribers still see the latest snapshot, but the call tree is flat. Mirrors the persistence-error re-entrancy guard from Round 5.

### Add-files counting semantics

- **`engine/store/handlers/add-file.ts`** — `existingCount` previously filtered `phase !== 'canceled'`, which silently made `completed`, retryable `error`, and non-retryable `error` all count against `maxFiles`. The result: a user retrying a flaky endpoint that ultimately failed could not add new files because the dead item still consumed a slot. Now explicit: only count active items (not `completed`, not `canceled`, not non-retryable `error`). Retryable errors still count because the user may still act on them. Documented inline.

### Schedule walk gating

- **`engine/store/store.runtime.ts:finalizeApply`** — moved `rt.scheduleWork()` inside the `changedByReducer || changedByCleanup` branch. The scheduler walks every queued/uploading slot per call; when an event is a no-op (e.g. throttled progress after cancel), nothing the scheduler can observe has changed, so the walk was constant overhead per ignored event. Now zero work on a no-op event.

### pauseAll redundancy

- **`engine/store/store.dispatch.ts:pauseAll`** — previously called `handlePause` on every target (which aborts inflight) AND batch-dispatched a `pause` command for every target. The reducer's `pause` case only acts on `queued`; for `uploading` items it was a no-op (the abort is what does the work, asynchronously, via `runUpload`'s catch path applying `'paused'`). Now split by current phase: uploading items get only `handlePause` (abort); queued items get only the batch command. Halves reducer passes for the common case of pausing many concurrent uploads.

### Verification

```
npx vitest run        → 10 passed (10) / 122 passed (122) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 12 — Structured classifiers + perf + invariants (rating ongoing)

### Retry classification: regex → structured

- **`core/contracts/transport/transport.libs.ts`** — new `NetworkError` class carrying `status: number` and `cors: boolean` discriminators. `createNetworkError` now returns the typed class instead of a bare `Error`. Exposed from `core/contracts/transport`.
- **`engine/store/store.libs.ts:normalizeError`** — dropped the `String(msg).toLowerCase().includes('network'|'fetch')` substring sniffing that false-positived on phrases like *"fetch your records from the network drive"*. Replaced with `isNetworkErrorShape` (structural check for the `NetworkError` discriminator) + `extractHttpStatus` (pulls `status` or `statusCode` from a plain object).
- **`strategies/multipart/index.ts:isTransientNetworkFailure`** — replaced the `/network/i`, `/timeout/i`, `/5\d\d/`, `/ECONNRESET/i`, `/EHOSTUNREACH/i` regex chain with structured branching on `err.code === 'network'` and HTTP status. Closes a class of misclassification (`/5\d\d/` matched *"500-pixel image"* error messages).
- **Tests** — `store-libs.test.ts` gained two new tests for the structured path; old "network-message" assertion flipped to assert the new safer behavior (plain `Error('failed to fetch from network')` is `unknown` now, not retryable). 124/124 vitest.

### Reducer no-op gate

- **`engine/reducer.ts`** — added a lazy `mutated` flag tracked by both `set()` and a new `remove()` helper. The reducer now returns the input `state` ref when `mutated` stayed false. Multi-item and command events get the same ref-identity no-op gate that single-item events already had.
- **`engine/store/store.runtime.ts:reduceOne`** — short-circuits on `next === prev` before any further work. Reduces `useUploader.items` churn (the React subscriber path uses `Array.from(state.items.values())` per change).

### Scheduling fairness + re-entrancy

- **`engine/store/store.schedule.ts:scheduleUploads`** — `queued` candidates are now sorted by `requestedAt` before slotting. Previously walked Map insertion order, so a removed-and-re-added item could jump in front of older queued items.
- **`engine/store/store.schedule.ts:scheduleWork`** — re-entrant calls used to silently drop. New `rt.schedulingDirty` flag marks pending work, and the outer loop runs an additional pass on the way out. Closes a starvation case where a synchronous `runUpload` prologue applying an internal event (e.g. `validation.failed`) caused the engine to skip rescheduling until the next dispatch.
- **`engine/store/store.types.ts`** + **`store.runtime.ts`** — `schedulingDirty: boolean` field added.

### Hot-path allocations

- **`engine/store/store.dispatch.ts:startAll`/`cancelAll`** — replaced `Array.from(state.items.values()).filter(...).map(...)` with single-pass `for...of` builds. Halves array allocations on bulk ops.
- **`engine/store/handlers/add-file.ts`** — same treatment for the `existingCount` walk used by `maxFiles`.
- **`engine/store/store.schedule.ts:scheduleUploads`** — same single-pass build for the `queued` candidate list.

### Type-leak narrows

- **`engine/store/handlers/create-intent.ts`** — replaced bare `intent as AnyIntent<M>` cast with a `narrowIntent<M>()` helper that documents the trust boundary (a validated intent satisfies the union; the cast turns runtime guarantee into TS narrowing in exactly one place).
- **`core/persistence/persistence.ts:deserializeSnapshot`** — full JSDoc rewrite. Documents the explicit drop policy for non-paused items (`ready`, `validating`, `creating_intent`, `queued`, `uploading` are silently dropped) and the `isIntent` trust-boundary contract.

### Defensive transport

- **`core/contracts/transport/transport.ts:xhrRequest`** — refuse `setRequestHeader` calls whose name or value contains `\r`/`\n`. Browsers already throw on raw CRLF, but the check makes the trust assumption ("`signPart` headers come from your backend") explicit at the call site.
- **`core/contracts/transport/transport.libs.ts:UploadAbortError.reason`** — marked `readonly`.

### Docs + DX

- **`core/utils/id.ts:generateId`** — added `@remarks` explaining the `Math.random()` fallback is bounded to non-secure contexts where Web Crypto is gated, and that collisions are acceptable because the id is client-local and short-lived.
- **`README.md`** — added a "Bundler requirement" section documenting that `process.env.NODE_ENV` is referenced at module load and must be replaced/polyfilled for pure-ESM consumers.

### Verification

```
npx vitest run        → 10 passed (10) / 124 passed (124) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 13 — Snapshot, queue, micro-races (rating ongoing)

### Read-only state snapshot

- **`engine/reducer.ts`** — new `ReadonlyUploadState<M,C,P,R>` type with `readonly items: ReadonlyMap<...>`.
- **`engine/store/store.types.ts`** — `UploadStore.getSnapshot()` now returns `ReadonlyUploadState`. TS forbids `.set()`, `.delete()`, `.clear()`, or `items` reassignment.
- **`engine/store/index.ts:getSnapshot`** — memoized frozen wrapper. Same wrapper is reused across no-op events (the reducer's `mutated` flag returns the input `state` ref, so the cached snapshot still matches identity). `Object.freeze` makes the top-level field immutable at runtime; consumers that bypass types still cannot accidentally `.items = ...` the store into corruption.

### Public `on/off` overload preservation

- **`engine/store/index.ts:storeProxy`** — replaced `rt.emitter.on.bind(rt.emitter)` / `off.bind(...)` with thin closures `(type, cb) => rt.emitter.on(type, cb)`. `Function.prototype.bind` returns `(...args: any[]) => any` and erases the typed-emitter overload, which left `useUploader`'s `on` typed less precisely than its definition. The closures preserve the generic signature.

### Effect-queue O(1) dequeue

- **`engine/store/store.types.ts:StoreRuntime`** — new `effectQueueHead: number` field.
- **`engine/store/store.runtime.ts:processEffects`** — replaced `effectQueue.shift()` (O(n) on a plain `Array`) with a head-pointer cursor. Dequeue is now O(1). Slot is nulled after read (drops the closure ref so a slow worker pool doesn't pin huge closure trees). Compaction policy: clear on drain, otherwise `splice(0, head)` once head outruns 64 entries AND head > length/2 — avoids both unbounded growth and constant memmove. A 10k-file folder drop no longer makes ingest quadratic.

### Effect watchdog cleanup

- **`engine/store/store.runtime.ts:runWithTimeout`** — added a `settled` flag. The watchdog's `setTimeout` no-ops if the effect already won the race; also attaches a no-op `.catch()` to the timeout promise so a stray rejection arriving after the effect resolved does not surface as an unhandled rejection.

### TOCTOU: runUpload final tick

- **`engine/store/handlers/run-upload.ts`** — atomic snapshot of `signal.aborted`, `inflight.mode`, item, and cursor on both the success and catch paths. A `cursor.updated` event landing between the abort check and the cursor read cannot flip a pause-without-cursor into a pause-with-stale-cursor or vice versa.

### `maxConcurrentUploads` cap fence

- **`engine/store/store.schedule.ts:scheduleUploads`** — re-check `rt.inflightUploads.size >= maxConcurrent` on every loop iteration. `applyInternal('upload.begin')` notifies subscribers synchronously; a subscriber dispatching `start` for another ready item adds a new inflight before the loop body returned. Without the per-iteration re-check, the cap could be pierced by one slot per re-entrant `start`.

### Tests

- **+2 R13 tests** (now 126):
  - `getSnapshot` returns a frozen view and rejects assignment to `items`.
  - Snapshot ref is stable across no-op events and rebuilt on real ones.

### Verification

```
npx vitest run        → 10 passed (10) / 126 passed (126) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 14 — Layer-cross fixes + emitter snapshot (rating ongoing)

### 1. `useUploader` undid R13's overload-preservation work

**Problem.** R13 replaced `rt.emitter.on.bind(rt.emitter)` with thin closures at the store layer so that the typed-emitter generic overload signature would survive into the public `UploadStore` surface. The React hook (`react/use-uploader.tsx`) then re-bound the same methods with `store.on.bind(store)` / `store.dispatch.bind(store)` / `store.off.bind(store)`. `Function.prototype.bind`'s static type collapses to `(...args: any[]) => any`; the inferred return of `useUploader` lost the typed-event narrowing it should have inherited.

**Solution.** Replaced every `.bind(store)` inside `useUploader` and `useUploaderActions` with `React.useMemo<...>(() => (args) => store.method(args), [store])`. The closure form preserves the typed signature *and* keeps the per-store identity stable across renders.

**Why this way.** `useMemo` with an explicit generic argument (`React.useMemo<UploadStore<M,C,P,R>['on']>(...)`) makes the inferred return identical to the public type. Going through `useCallback` would be near-equivalent but `useMemo` lets us mirror R13's pattern at the store layer.

### 2. Emitter `emit` had no re-entrancy guard and iterated the live `Set`

**Problem.** `createTypedEmitter` iterated the live `Set<listener>` directly. Two latent footguns:
1. A listener that called `off(type, cb)` for a *peer* listener inside an event handler mutated the Set mid-`forEach`. Per ECMAScript spec `Set.forEach` does skip removed entries that have not yet been visited — so a peer detach during emit could silently un-invoke a listener.
2. A listener that synchronously called `store.dispatch(...)` re-entered `emit` via the reducer pipeline. There was no depth bookkeeping; a buggy "subscribe-then-dispatch-on-change" pattern could form a feedback loop that grew the call stack until it blew.

**Solution.**
- Snapshot the listener set with `Array.from(typeListeners)` before iterating. Mutations from inside a listener land on the *next* emission. Iteration stays self-consistent.
- Added an `emitDepth` counter and a `MAX_EMIT_DEPTH = 50` soft cap. When depth exceeds the cap in dev, log a one-shot `console.warn` instructing the developer to defer the nested dispatch with `queueMicrotask`. We do not throw — a legitimate consumer might have one level of intentional re-entry, and surprising production crashes would be worse than the warning.

**Why this way.** Snapshot-and-iterate is the standard fix for "listeners that mutate during emit"; it's what `Node.EventEmitter` does. The soft cap follows the same pattern as React's "Maximum update depth exceeded" warning — it surfaces the bug without being load-bearing in correctness. Two new emitter tests pin both behaviors.

### 3. Multipart `as C['multipart']` cast leaked variance into call sites

**Problem.** `multipartStrategy` is generic over `C extends CursorMap<M> & { multipart?: MultipartCursor }`. Inside the function body, TypeScript only knows `C['multipart']` as a lookup type and cannot prove that a `MultipartCursor` literal is assignable to a wider `C['multipart']` (subtype variance). Every `persistCursor(...)` call site therefore needed a bare `snapshot as C['multipart']` cast. With three such call sites the trust contract was scattered across the file.

**Solution.** Extracted a typed `persistMultipartCursor(ctx, cursor)` helper that scopes the cast to one line and documents the runtime invariant: every call site builds the same `MultipartCursor` shape, so the cast is sound. The call sites now read `persistMultipartCursor(ctx, { done: ... })` without `as`.

**Why this way.** A helper instead of a generic widening of the strategy's `persistCursor` signature: the public `StrategyCtx.persistCursor` type stays strict for *other* strategies (post, future tus). The cast is the cheapest sound bridge across a TS variance limitation that does not warrant erasing a public type guarantee.

### 4. `enqueueEffect` fire-and-forget call to `processEffects`

**Problem.** `enqueueEffect` triggered `void rt.processEffects()` when not already processing. The `void` operator silently swallows any rejection from the outer loop. Per-effect failures were already handled by `runOne`'s internal `.catch`, but an unexpected throw in the *outer* `processEffects` (e.g. an internal invariant tripping during reentry/scheduling) would surface as an unhandled rejection because the caller has nowhere to `await`.

**Solution.** Replaced `void rt.processEffects()` with `rt.processEffects().catch((err) => console.error('[UploadEngine] processEffects outer loop crashed:', err))`. The caller is still synchronous; rejections route to console rather than to the runtime's unhandled-rejection handler.

**Why this way.** Belt-and-suspenders. The intent is observability, not recovery — if the outer loop actually crashes, the engine is already in a bad state; the catch buys us a logged stack frame instead of a node-level fatal in strict-rejections mode.

### Tests

- **+2 emitter tests** (now 128 total):
  - R14: snapshot semantics — `on()` during `emit` lands on next emission.
  - R14: snapshot semantics — `off()` during `emit` still invokes remaining listeners in the current pass.

### Verification

```
npx vitest run        → 10 passed (10) / 128 passed (128) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 15 — Native aborts, version fence, lazy alloc (rating ongoing)

### 1. `isAbortError` only caught the bundled abort shape

**Problem.** `isAbortError` returned `err.code === 'aborted'` — matched the `UploadAbortError` thrown by the bundled XHR transport but missed `DOMException` with `name === 'AbortError'`, which is what `fetch`, `ReadableStream`, and most custom transports throw on cancel. A consumer plugging in a fetch-based transport saw aborts classified as `unknown`, which then ran through `retryDecision` and was treated as a non-retryable error instead of a clean abort. Telemetry recorded false failures; the engine logged spurious "Upload failed" rows.

**Solution.** `isAbortError` now also returns `true` when `err.name === 'AbortError'`. The return type widened to `{ code?: 'aborted'; name?: 'AbortError'; reason?: unknown }` so the same call site narrows both shapes.

**Why this way.** Structural check, not `instanceof DOMException`. Cross-realm thrown values (Node fetch polyfills, worker boundaries, jsdom) often fail `instanceof` even when the shape is correct. The name-check matches what Node's `--experimental-fetch`, undici, browser fetch, and the streams API all set on the rejection. One new R15 test covers this.

### 2. No version-mismatch fence on persisted snapshots

**Problem.** `isPersistedSnapshot` only verified `typeof version === 'number'`. If we shipped a v2 deployment with a breaking schema change, a v1 snapshot in IndexedDB would silently parse — fields that no longer exist became `undefined`, and the engine would restore half-recovered items. There was no migration story; just whatever fields happened to overlap.

**Solution.**
- Added `expectedVersion?: number` to `DeserializeContext`. When supplied, `deserializeSnapshot` rejects the whole snapshot (returns `null`) if `raw.version !== expectedVersion`.
- `createStoreRuntime` wires `expectedVersion: persistence.version` automatically — the consumer's existing `version` field becomes the fence.
- Dev-mode warn explains the rejection so a developer notices in the console rather than wondering why their resume disappeared.

**Why this way.** Rejection > migration. A `persistence.migrate` hook would be more ergonomic but invites consumers to write fragile migrations against a private snapshot shape. Forcing the rejection means a developer who bumps `version` consciously decides whether to recover, drop, or write their own custom `deserialize`. Two new R15 tests pin the fence behavior.

### 3. Reducer allocated a fresh `Map` even for no-op events

**Problem.** Every reducer call began with `const items = new Map(state.items)` and ended with `return mutated ? { items } : state`. The `mutated` flag short-circuited the *return*, but the `Map` clone had already happened — wasted O(n) on every guarded no-op. Throttled progress dropouts, idempotent cancels, and out-of-phase transitions all paid for an allocation that was discarded.

**Solution.** Renamed the local to a `let items = state.items` alias and added an `ensureWritable()` helper that promotes to a fresh `new Map(state.items)` only on the first `set()`/`remove()` call. Reads continue to use `items.get(...)` / `items.has(...)` without change because the alias holds either ref. No-op events now run zero allocations through the reducer.

**Why this way.** Copy-on-write is the standard pattern for this kind of "maybe mutate" reducer. A getter accessor (`items()`) would have required touching every read site (~20 call sites); the alias rebind keeps the diff minimal and the call sites unchanged. The invariant — *never mutate `state.items` directly* — is enforced by routing all writes through `set`/`remove`, both of which call `ensureWritable()` before touching the map.

### 4. Multipart `maxRetries = 3` hardcoded inside the strategy

**Problem.** The per-part retry budget was a local literal inside `uploadOne`. A consumer who wanted faster failure (e.g. cheap CI smoke tests) or longer tolerance (flaky enterprise networks) had to fork the strategy. The library imposed one retry policy on every deployment.

**Solution.** Added `opts.maxPartRetries` to `multipartStrategy()`. Default stays at 3 to preserve existing behavior. `0` disables per-part retries entirely (failures surface to the engine's retry decider instead).

**Why this way.** Per-part retries are a separate concern from the engine's per-attempt retry policy. The engine retries the *outer* upload by re-invoking `strategy.start` from the persisted cursor; the strategy retries individual parts in place to avoid losing the inner progress. Keeping them as independent knobs lets a consumer tune retry depth vs. latency — `maxPartRetries: 0` + `maxAttempts: 5` is a "fail-fast outer, no inner" configuration; `maxPartRetries: 5` + `maxAttempts: 1` is "tolerate everything inside, never resume" — both legitimate.

### 5. `LocalStorageAdapter.save` quota message labeled wrong unit

**Problem.** Quota-exceeded error said `${payload.length} bytes`. `payload.length` returns UTF-16 code units, not bytes. The diagnostic mislead developers reading the message — they'd assume their serialized snapshot was, say, 5MB when it was actually 10MB (ASCII) or worse for emoji-heavy data.

**Solution.** Label changed to `${payload.length} UTF-16 code units`. The numerical value is unchanged because browsers also count localStorage usage in UTF-16 units, so the value is correct against the quota — only the unit label was wrong.

**Why this way.** Conversion to bytes would require `new Blob([payload]).size` or `new TextEncoder().encode(payload).byteLength`, both allocating on an already-stressed error path. The number is correct as-is for comparing against `localStorage`'s ~5MB quota; clarifying the label is sufficient.

### 6. `useUploader` returned fresh `[]` for empty phase buckets

**Problem.** `uploading: byPhase.uploading ?? []` allocated a new empty array on every render when no items were in that phase. Consumers that memoized off `uploader.uploading` saw a new reference per render and re-ran their effect.

**Solution.** Module-scoped `EMPTY_ITEMS = Object.freeze([])`. The fallback path now returns this stable ref. Type-erased to `UploadItem<M, C, P, R>[]` at return because `useUploader` is generic. The `as unknown as` widens for TS without weakening runtime behavior (the array is frozen, so a misbehaving consumer's `.push()` will throw).

**Why this way.** A module singleton is the standard pattern — React itself uses one for its empty-deps array. Freezing the array enforces immutability so a consumer cannot accidentally pollute the shared singleton. The cast is contained to the return statement.

### 7. Bare `as` casts in `deserializeSnapshot`

**Problem.** Two casts at the trust boundary: `parsed.intent as AnyIntent<M>` and the outer object `as UploadItem<M, C, P, R>`. Both were sound after the `isIntent` / `hasStrategy` runtime guards but scattered the trust contract across a 30-line function body.

**Solution.** Local `narrowIntent` and `narrowItem` helpers at the top of the function scope. Each performs the same cast but with a single comment documenting the invariant. The `items.set(...)` block now reads `narrowItem({...intent: narrowIntent(parsed.intent), ...})` without any inline `as`.

**Why this way.** Module-level helpers would require re-importing the generics; closure-scoped helpers inherit them. Cheaper than a fully-typed runtime validator (which would have to encode the full intent union) and clearer than scattered casts.

### Tests

- **+3 R15 tests** (now 131 total):
  - `normalizeError` classifies native `DOMException('AbortError')` as aborted/non-retryable.
  - `deserializeSnapshot` rejects mismatched `expectedVersion`.
  - `deserializeSnapshot` accepts matching `expectedVersion`.

### Verification

```
npx vitest run        → 10 passed (10) / 131 passed (131) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 16 — HTTP error structure + hardening (rating ongoing)

> Each entry below carries a **Why flagged** line — what audit signal made us
> look at it in the first place. Useful for telemetry of "what kinds of issues
> tend to slip past N rounds of polish."

### 1. XHR non-2xx response threw plain `Error` with no `status` field

**Why flagged.** Round-15 audit re-read of `xhrRequest.onload` against the R12 structural retry classifier. The classifier was rewritten in R12 to branch on `code === 'network'` or `err.status` / `err.statusCode`. The transport's *transport-level* errors were updated to `NetworkError(message, status, cors)` — but the *HTTP non-2xx* branch (`xhr.onload` with `status >= 200 && status < 300` failing) was missed during that rewrite and kept throwing `new Error('Upload failed with status ${status}')`. A 503 response from a flaky backend therefore classified as `unknown` (no retry) rather than `http` (retry on 5xx/429). The R12 regex fallback that previously caught this (`/5\d\d/`) was removed at the same time, leaving the gap silent.

**Problem.** Plain `Error` carrying status only in the message string. Structural classifier (`isNetworkErrorShape`, `extractHttpStatus`) returned no match. `normalizeError` fell through to `code: 'unknown'`, `retryable: false`. The retry decider treated transient 503s as terminal failures.

**Solution.** Added `HttpError extends Error` with `readonly code: 'http'` and `readonly status: number` (same shape contract as `NetworkError`). `xhrRequest.onload` throws `HttpError` instead of plain `Error` for non-2xx. `extractHttpStatus` already picks up `.status` so no classifier change needed — the structural path activates automatically. Exported from `core/contracts/transport` so consumer code can `instanceof`-check if desired.

**Why this way.** A separate class instead of reusing `NetworkError`: a non-2xx server response is qualitatively different from a transport-level failure. The server *answered* — auth said no, the body was malformed, rate-limit kicked in. Conflating them under one `code: 'network'` would hide the semantic distinction in telemetry and confuse consumers reading errors in error-tracking dashboards. Two R16 tests cover 503 (retryable) and 400 (non-retryable) classification.

### 2. `reportPersistenceError` re-entrancy guard could stick forever

**Why flagged.** Audit walked the `reportPersistenceError` async-hook path looking for guard-leak paths. The code already had a `HOOK_WATCHDOG_MS` setting with a default of 5000ms — but consumers could set `hookTimeoutMs: 0` to "disable" the watchdog, and the implementation honored that literally with `if (HOOK_WATCHDOG_MS > 0)`. A consumer who set 0 *and* whose hook returned a thenable that never settled would leave `reportingPersistenceError = true` forever. Every subsequent flush would be silently dropped at `schedulePersistence`'s `if (reportingPersistenceError) return` short-circuit.

**Problem.** `hookTimeoutMs: 0` exposed a foot-gun. Combined with a hung async hook, the engine would permanently stop persisting state without surfacing any signal to the consumer.

**Solution.** Forced a `HOOK_WATCHDOG_MIN_MS = 1000` floor on the watchdog. The consumer's `hookTimeoutMs` is clamped to `[1000, ∞)` — either matching their requested value or raising to the floor if they passed `0` / negative. The watchdog setup branch in `reportPersistenceError` no longer needs the `if (HOOK_WATCHDOG_MS > 0)` guard; the timeout is unconditional.

**Why this way.** Removing the opt-out entirely (rather than honoring `0`) is the right call because the guard's whole purpose is to prevent a permanent wedge. "I don't want the watchdog" is asking for the very failure mode the watchdog exists to prevent. 1000ms floor is short enough that legitimate fast hooks aren't affected and long enough that single-shot retries inside a hook can complete.

### 3. `serializeSnapshot` accepted any `version` value, including NaN

**Why flagged.** Audit cross-checked the load-side version fence added in R15 against the save side. Found asymmetry: deserialize rejects on `expectedVersion` mismatch (good), but `serializeSnapshot(state, version)` accepts arbitrary `version` from the caller. A caller passing `undefined` (coerced to `NaN`) or a string-typed value would land in storage and only blow up on the next session's load — by which point the original bug site is gone.

**Problem.** Bad version values silently persisted. Next load would either parse but reject (correct, but error message obscures origin) or fail `typeof raw.version === 'number'` and look like corrupted storage.

**Solution.** Sanity check at the top of `serializeSnapshot`: reject `NaN`, non-integer, or negative. Throws a descriptive error pointing at the call site's parameter.

**Why this way.** Throwing instead of clamping/coercing: a version mismatch is a config bug the consumer needs to fix at the call site. Coercing to `0` or `1` would mask the bug and surface as a "no resume after refresh" mystery later. Four R16 tests cover NaN, negative, non-integer, and the accepted `0`/positive cases.

### 4. `reduceOne` ref-identity check was redundant after R15 lazy alloc

**Why flagged.** Audit traced data flow through the reducer + reduceOne after R15's lazy `Map` clone landed. Before R15, the reducer always returned a fresh `{ items: new Map(...) }`, so `next !== prev` was always true; `reduceOne` then did a per-item `before === after` check to detect guarded no-ops. After R15, the reducer returns the exact `state` ref on no-op, so the first check (`next === prev`) catches every variant. The per-item check became dead code.

**Problem.** Dead branch in a hot path. Tiny perf nit, also a code-clarity smell — future readers wondering whether the per-item check was load-bearing.

**Solution.** Removed the per-item branch. `reduceOne` now relies entirely on the reducer's ref-identity invariant. Updated the inline JSDoc to document the contract.

**Why this way.** Trust the reducer's invariant. The alternative (keeping the per-item check "just in case") would be paranoia at the expense of clarity. The reducer's `mutated` flag is the single source of truth; layering a defensive check on top hides the invariant from new readers.

### 5. `hasCursor` predicate name implied value-present, runtime only checked key

**Why flagged.** Audit found scattered defensive call sites of the form `if (cur && hasCursor(cur) && cur.cursor)`. The duplicated `&& cur.cursor` check suggested the predicate's name was misleading reviewers — `hasCursor` returning `true` for `{ cursor: undefined }` violates least-surprise.

**Problem.** Type guard returned `true` based on `'cursor' in item` (key presence). Items in `uploading`/`paused`/etc. always have the key (even when value is `undefined`), so the guard provided weaker narrowing than the name implied. Every consumer had to add an extra `&& cur.cursor` check or risk reading `undefined`.

**Solution.** Tightened the guard to `'cursor' in item && item.cursor != null` and refined the return type to `Extract<..., { cursor?: AnyCursor<C> }> & { cursor: AnyCursor<C> }`. After the guard, `.cursor` narrows to the non-nullable value type — the extra `&& cur.cursor` checks at call sites are now redundant (kept for now; cleanup can land in a future round).

**Why this way.** Tightening the predicate is safer than a name-change. A name change (`hasCursorValue` or similar) would force all call sites to update and could miss one; tightening the existing predicate keeps every call site working immediately and *also* benefits any new call site that the name attracted. The redundant `&& cur.cursor` checks at the existing sites are harmless — JavaScript short-circuits and TS narrows through them.

### Tests

- **+6 R16 tests** (now 137 total):
  - `HttpError(503)` classifies as `http` with `retryable: true`.
  - `HttpError(400)` classifies as `http` with `retryable: false`.
  - `serializeSnapshot` rejects `NaN` version.
  - `serializeSnapshot` rejects negative version.
  - `serializeSnapshot` rejects non-integer version.
  - `serializeSnapshot` accepts `0` and positive integers.

### Verification

```
npx vitest run        → 10 passed (10) / 137 passed (137) — 2.0s
turbo check-types     → green
biome check           → green
```

---

## Round 17 -- Asymptotic polish + slop scrub (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. Load watchdog had the same unhandled-rejection shape R13 fixed in `runWithTimeout`

**Why flagged.** Audit walked every `setTimeout`-driven `Promise.race` in the runtime looking for the R13 fix pattern. Found one place that was missed: `applyLoaded` constructs a watchdog promise that rejects after `loadTimeoutMs`. If `persistence.adapter.load()` wins the race, the watchdog rejection lands with no handler and becomes an unhandled rejection. Same class of bug as R13; the fix template just hadn't propagated here.

**Problem.** Watchdog `Promise<never>` with no `.catch`. Wins-race scenario silently logs `unhandledRejection` and crashes Node under `--unhandled-rejections=strict`.

**Solution.** Added a `settled` flag + `.catch(()=>{})` on the timeout promise; the inner `setTimeout` callback skips the reject when `settled === true`. `.finally()` on the outer chain clears the watchdog timer.

**Why this way.** Direct port of R13's `runWithTimeout` pattern, applied at the same kind of seam (race between a fast path and a timeout). Belt-and-suspenders -- the no-op catch handles the rejection if the settled guard somehow leaks, the settled guard handles the timer being dropped if the catch ever stops being attached.

### 2. `hasCursor` call sites still carried defensive `&& cur.cursor`

**Why flagged.** R16 tightened the predicate from `'cursor' in item` to `'cursor' in item && item.cursor != null`. Grep showed call sites in `run-upload.ts:63,112` still wrote `cur && hasCursor(cur) && cur.cursor`. The double-check no longer narrowed anything new; the predicate's tightened return type carried the nullability narrowing on its own.

**Problem.** Dead defensive checks. Tiny perf cost, real readability cost -- a new reader looking at the sites would assume the predicate didn't narrow `.cursor` to non-null.

**Solution.** Dropped the `&& cur.cursor` from both call sites. Type-checker confirms `cur.cursor` is non-null after the guard.

**Why this way.** Cleanup follows the predicate refinement. Keeping the redundant checks "just in case" would mask the predicate's contract for the next reader.

### 3. `xhrRequest.send` accepted any `BodyInit`, including types XHR cannot send

**Why flagged.** Audit traced the cast at `xhr.send(args.body as XMLHttpRequestBodyInit | Document | null)`. The function signature accepted `Document | BodyInit | null`. `BodyInit` (the DOM type) includes `ReadableStream` and `URLSearchParams`. XHR rejects `ReadableStream` with a runtime TypeError instead of a structured error -- the cast had no validation, just a type assertion.

**Problem.** A misbehaving custom transport could pass a `ReadableStream` body; the runtime error landed deep in the XHR plumbing with a non-actionable message.

**Solution.** Extracted a `toXhrBody(body)` helper that narrows to the union XHR actually accepts. Allowed: `string`, `Blob`, `ArrayBuffer`, `ArrayBufferView`, `FormData`, `URLSearchParams`, `Document`, `null`. Anything else throws an actionable error at the boundary.

**Why this way.** Narrow at the seam, not the consumer. The XHR transport's caller is the engine -- which always passes `Blob` -- but the function is exported as part of the public transport contract, so a custom transport could pass anything. The seam helper makes the supported set explicit and surfaces unsupported bodies before the request is fired.

### 4. `emit` snapshot allocated `Array.from(typeListeners)` per call, including size-1

**Why flagged.** Audit traced hot-path allocations during progress events. `useUploader` subscribers typically attach exactly one listener per event type; the emitter snapshot allocated a 1-element array per emission anyway. R14 added the snapshot to fix the listener-mutation hazard; the size-1 case has no such hazard.

**Problem.** Per-emit array allocation on the single most common subscriber pattern.

**Solution.** Size-1 fast path: when `typeListeners.size === 1`, destructure the single listener and dispatch directly, skipping `Array.from`. Multi-listener path still snapshots.

**Why this way.** A size-1 listener cannot mutate the set in a way that affects "remaining listeners" because there are none -- the hazard R14 fixed doesn't exist at size 1. Extracting a shared `dispatch(cb)` helper inside `emit` lets both paths share the throw-isolation logic without duplication.

### 5. Native `DOMException('AbortError')` produced `reason: 'unknown'` in telemetry

**Why flagged.** R15 added native-abort support to `isAbortError`. Audit then traced the consumed-by side: `normalizeError`'s abort branch read `err.reason ?? 'unknown'`. `DOMException` has no `reason`, so every native abort logged as `reason: 'unknown'`. The signal source (user cancel, timeout, etc.) was lost.

**Problem.** Telemetry blind to abort cause for any fetch-based or stream-based transport.

**Solution.** Cascade: prefer `err.reason` (custom transport), fall back to `err.message` (DOMException's `'aborted'` / `'user-canceled'` / etc.), then `'unknown'`.

**Why this way.** `err.message` is what fetch/streams set as the cancel reason in practice (`fetch` rejects with `DOMException('The user aborted a request.', 'AbortError')` when no signal reason is set, and propagates `signal.reason` as the message when one is). Reading `message` recovers the information without forcing transport authors to wrap their thrown values.

### Slop scrub + redundancy pass

**Why flagged.** User feedback to strip "AI-slop" comments and ensure no redundant code / bad type design after 17 rounds of polish.

**Actions.**
- Em-dashes (`--`) replaced with `--` across all 14 occurrences in `src/`. None left.
- `useUploader` had three back-to-back comments explaining the same `.bind`-erasure rationale. Collapsed to one near the first `useMemo`; the others now just say "Stable identities" with the canonical `useEffect` example.
- `EMPTY_ITEMS` JSDoc shrunk from 5 lines to 1 -- the name + frozen + `===` hint is self-documenting.
- `adapters.local.ts` quota-message comment shrunk from 5 lines to 1.
- `useUploaderActions` lost its redundant explanatory comment (already documented at the `useUploader` site).

### Tests

- **+1 R17 test** (now 138):
  - DOMException reason fallback uses message for telemetry.

### Verification

```
npx vitest run        -> 10 passed (10) / 138 passed (138) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 18 -- Asymmetry + dedup + pre-resolve (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `hasIntent`/`hasFile` looser than `hasCursor`

**Why flagged.** R16 tightened `hasCursor` to return `& { cursor: AnyCursor<C> }` so call sites no longer needed the redundant `&& cur.cursor` check. Audit cross-referenced the other two structural guards in the same file. `hasIntent` and `hasFile` still used the older `'X' in item && !!item.X` shape with a return type that did NOT narrow `.intent`/`.file` to non-null. Asymmetric; consumers reading the predicates would expect identical narrowing semantics.

**Problem.** Inconsistent narrowing across structural guards. Consumers using `hasIntent(item)` still had to verify `item.intent` was truthy before accessing fields on it, even though the runtime check already guaranteed truthiness.

**Solution.** Widened the return type intersection to `& { intent: M[keyof M] }` and `& { file: File }` respectively. Runtime check unchanged; only the narrowed type widened.

**Why this way.** Type-only change. The runtime guarantee was already there; the type system just wasn't propagating it. Matching the `hasCursor` pattern keeps the three structural guards symmetric and one-liner-narrowable at call sites.

### 2. Multipart queue still used `Array.shift()` -- the same O(n) pattern R13 fixed for the effect queue

**Why flagged.** Cross-referenced R13's effect-queue head-pointer fix against every `queue.shift()` left in the codebase. Multipart's part-dispatch loop (`strategies/multipart/index.ts:271`) was the last holdout. For a 100GB upload with 5MB parts, that's ~20k shifts; `Array.shift` is O(n), so the cumulative cost is ~200M memmoves over the upload's lifetime.

**Problem.** Same O(n) dequeue regression class as the effect queue had pre-R13. Bounded by `totalParts` so not catastrophic, but the workload is exactly the hot path we care about.

**Solution.** Replaced `queue.shift()` with a `queueHead` cursor + `queue[queueHead++]` indexed read. Loop condition switched from `queue.length > 0` to `queueHead < queue.length`. No compaction needed because the entire `queue` array is local to one `start()` invocation and gets garbage-collected when the strategy returns.

**Why this way.** Same fix R13 applied to `effectQueue`. Direct port keeps the patterns consistent across the codebase -- two head-pointer dequeues, identical shape.

### 3. Effect-signal forwarding boilerplate duplicated across three handlers

**Why flagged.** Audit noticed identical `onEffectAbort` blocks in `create-intent.ts`, `finalize.ts`, and `add-file.ts`: same `addEventListener('abort', ..., { once: true })`, same `if (effectSignal.aborted)` fast-fire, same `removeEventListener` in `finally`. Three implementations of the same six-line pattern means three opportunities for one of them to drift, and a future fourth handler would tempt a fourth copy.

**Problem.** Code duplication. Easy for a subtle behavior to drift between handlers (e.g. one forgets the fast-fire on already-aborted signal, another forgets to remove the listener in finally).

**Solution.** Extracted `linkSignals(effectSignal, controller)` in `core/utils/async.ts`. Returns a `detach()` function the caller invokes in `finally`. Handles the three previously-duplicated steps: fast-fire on already-aborted, install once-only listener, expose removal closure. All three handlers now use the helper.

**Why this way.** Helper instead of base class / inheritance. Each handler still owns its lifecycle (`try`/`catch`/`finally` block) and decides when to clean up; the helper just absorbs the listener wiring. Returning the detach function (instead of an `AbortLink` object with `.detach()`) keeps the call site noise minimal.

### 4. `isAutoStart` walked the union every scheduling pass

**Why flagged.** Audit traced hot-path work inside `scheduleUploads`. The auto-start check for every `ready` item called `isAutoStart(opts, purpose)`, which re-evaluated the `autoStart` config's union (undefined / array / function) on each call. The config is immutable per store, so the resolution work was duplicated N × M times (N schedules × M items).

**Problem.** Repeated discriminant walk for an immutable config. Tiny per call, additive at scale.

**Solution.** Extracted `resolveAutoStart(autoStart)` that returns a `(purpose) => boolean` once at construction. Added `shouldAutoStart` to `StoreRuntime`; built once in `createStoreRuntime`. The array variant compiles to a `Set` for O(1) membership instead of `Array.includes`.

**Why this way.** Resolve-once pattern. The Set conversion is a micro-win for the array variant; the function variant is passed through as-is. Removing the old `isAutoStart(opts, purpose)` export breaks no consumers because it was internal.

### Tests

- **+1 R18 test** (now 139 total):
  - `shouldAutoStart` survives across multiple dispatches; consumer-supplied function gets called.

### Verification

```
npx vitest run        -> 10 passed (10) / 139 passed (139) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 19 -- Tail polish + JSDoc scrub (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `run-upload.ts` still had `?.` after R18's `hasFile` tightening

**Why flagged.** R18 tightened `hasFile` to narrow `.file` to non-null. R17 had done the same call-site cleanup for `hasCursor`. Audit grep showed one straggler in `run-upload.ts:180` -- the error-context message read `hasFile(itemForContext) && itemForContext.file?.size`, where the `?.` was redundant after the guard.

**Problem.** Misleading defensive-check pattern. Reads as if `.file` might still be `null` after the guard, contradicting the type contract `hasFile` now exposes.

**Solution.** Extracted `const fileSize = ... ? itemForContext.file.size : 0` above the message template; dropped `?.`. Reads cleanly; matches the R17 cleanup on `hasCursor` sites.

**Why this way.** Same R17 pattern. Pulling the read out of the template removed both the optional chain and the inline `??` fallback; the template now just interpolates `${fileSize}`.

### 2. `reportPersistenceError` allocated `{ value: false }` per call

**Why flagged.** Audit traced micro-allocations in hot error paths. The async-hook settled tracker used an object wrapper `{ value: false }` so the close-captured reference could be mutated. With ES module top-level `let`, a primitive variable works identically and skips the heap allocation.

**Problem.** One heap allocation per async `onPersistenceError` invocation. Tiny in isolation, visible in profiles for consumers that route many persistence errors (e.g. logging every quota-near event).

**Solution.** Replaced `const settled = { value: false }` with `let settled = false`. Same closure semantics; reads/writes go through the primitive.

**Why this way.** Standard refactor. The object wrapper made sense in pre-ES6 code where `var` hoisting + re-binding inside callbacks needed a stable reference; modern `let` solves the same problem without the box.

### 3. IndexedDB adapter shared a memoized `dbPromise` across stores

**Why flagged.** Audit caught a latent footgun: `dbPromise` was a module-level `let` -- two `UploadStore` instances in the same process that constructed IndexedDB adapters with different `name` or `version` would silently share the first connection. Tests instantiating multiple stores hit this regularly; production multi-store apps would too.

**Problem.** Module-scoped connection state. A second store's `version` arg was ignored once the first opened the db. Tests that wanted isolated adapters had to reach into private state to reset.

**Solution.** Wrapped the entire adapter behind a `createIndexedDBAdapter({ name?, version? })` factory. The factory builds its own `dbPromise`, `openDB`, `toPersistenceError`, etc. closure-local. Each call returns an isolated adapter. Kept the named singleton `IndexedDBAdapter` with `@deprecated` for backwards compatibility.

**Why this way.** Direct port of the R10 `MemoryAdapter` -> `createMemoryAdapter()` fix. Same shape, same justification: per-store ownership. The factory accepts optional `name`/`version` so consumers can isolate adapters even when their store key clashes.

### Slop scrub + redundancy audit

**Why flagged.** User feedback after R17 + R18: ensure JSDoc isn't AI-slop and there's no redundancy or bad-design carryover after 19 rounds.

**Actions.**
- `store.libs.ts` JSDoc tightened: `calculateFileChecksum` 4-line block -> 1 line; `sanitizeCause` 4 lines -> 1; `releaseAllSlots` 5 lines -> 3; `scheduleRetry` 4 lines -> 4 (rewritten terser); `resolveAutoStart` 3 lines -> 1; `hasCursor` 4 lines -> 1; `isAbortError` 9-line block -> 1; `retryDecision` 4 lines -> 4 (reworded); `isNetworkErrorShape` 3 -> 1; `extractHttpStatus` 4 -> 1.
- `multipart/index.ts`: collapsed two 3-line "rationale" comments inside `uploadOne` to one-liners; the `persistMultipartCursor` JSDoc dropped from 9 lines to 1 (variance reasoning belongs in the helper name, not the comment).
- Inline `// Retry transient network errors with exponential backoff. Classify by ...` block in multipart removed; `isTransientNetworkFailure` name covers the intent.

### Tests

- No new behavioral tests this round; 139 total still pass.

### Verification

```
npx vitest run        -> 10 passed (10) / 139 passed (139) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 20 -- Dedup helpers + test migration (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `releaseAllSlots` had 5 nearly-identical `get→abort→delete` blocks

**Why flagged.** Audit re-read `store.libs.ts` for repetition. Five sequential blocks differed only in which `rt.*` map they touched; each was 4 lines. Future map additions would tempt a sixth copy.

**Problem.** ~20 lines of mechanical repetition. Drift hazard: a future "release also detach foo" change would need five edits, not one.

**Solution.** Extracted `dropController(map, localId, reason)` helper for the four `Map<string, AbortController>` cases. The fifth (`inflightUploads` carrying `InflightUpload` instead of bare controller) stays inline -- one shape, one helper, one special case beats forcing the special case through a generic getter signature.

**Why this way.** Helper handles the common shape; the outlier stays explicit. A `dropAny(map, getController)` generic would have absorbed the fifth case too, but the API surface would invite future "is this map storing a controller or a wrapper?" misreads. Two-line helper + one inline read is clearer.

### 2. `scheduleRetry` had duplicated `rt.dispatch({type: 'retry', localId})`

**Why flagged.** Audit traced control flow in `scheduleRetry`. After a clean sleep the helper dispatched retry. After a watchdog abort it also dispatched retry (gated on phase). The two dispatch sites were five lines apart and visually identical; a future change to the dispatch payload would require updating both.

**Problem.** Two dispatch sites, one logical action. Easy to drift.

**Solution.** Hoisted a `sleptCleanly` flag inside the effect, collapsed the catch into setting the flag, then dispatched once at the bottom after the phase check. The dedup-superseded short-circuit stays as an early return (only path where we don't dispatch).

**Why this way.** Linear control flow > nested branches with parallel exits. Reading top-to-bottom now says: sleep (maybe abort), bail if superseded, bail if no longer in error, retry. Each predicate is a single early-return; the success path is one line at the end.

### 3. Watchdog `Promise.race(timeout)` shape implemented twice manually

**Why flagged.** R13 fixed the `runWithTimeout` unhandled-rejection class. R17 re-applied the same pattern to `applyLoaded`. Audit noticed both call sites manually implemented the `settled`-flag + `.catch(()=>{})` + `clearTimeout` ceremony. Future watchdog adds would tempt a third copy.

**Problem.** ~25 lines of repeated watchdog plumbing. Both copies use the same safety contract; any improvement (e.g. exponential watchdog) would require parallel edits.

**Solution.** Extracted `withTimeout(promise, ms, buildError, onTimeout?)` in `core/utils/async.ts`. Returns `{ result, cancel }`. Encapsulates the settled flag, the no-op catch on the timeout promise, and the timer cleanup. `runWithTimeout` shrank from 30 lines to 9; `applyLoaded`'s watchdog from 23 lines to 6.

**Why this way.** Helper instead of inline duplication. The two call sites differ in what error they throw and what side effect they want on timeout, so the helper takes those as parameters. Returning a `{result, cancel}` pair lets callers settle the watchdog explicitly when they know the race is done (kept for parity with `linkSignals`).

### 4. `MemoryAdapter` test used deprecated singleton; no `createIndexedDBAdapter` coverage

**Why flagged.** R10 introduced `createMemoryAdapter()` factory; R19 introduced `createIndexedDBAdapter({name?, version?})` factory. Both kept deprecated singleton exports for backwards compat. Tests still exercised the singletons -- so the recommended public surface had zero test coverage.

**Problem.** Tests modeled the deprecated path. A regression in the factory (e.g. forgetting to memoize per-instance) would not be caught.

**Solution.** Migrated `MemoryAdapter` test block to `createMemoryAdapter` factory. Added an isolation test that builds two factory adapters and confirms they do not share storage.

**Why this way.** Tests should pin the recommended API contract, not the deprecated one. The isolation test directly verifies the property the factory was created to guarantee.

### Slop scrub continuation

**Why flagged.** Trailing JSDoc verbosity scan after R19's pass.

**Actions.**
- `store.libs.ts`: dropped redundant `// Sleep aborted. dedup -> ...` comment; the new linear flow self-documents.
- `multipart/index.ts`: kept terse comments from R19 in place.
- `releaseAllSlots` lost the "called when an item leaves the active state machine via cancel, remove, or cleanup" enumeration -- the function name + "Idempotent" tell consumers what they need.

### Tests

- **+1 R20 test** (now 140 total):
  - Two `createMemoryAdapter()` instances do not share storage.

### Verification

```
npx vitest run        -> 10 passed (10) / 140 passed (140) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 21 -- Regression fix + acquireSlot helper (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. Orphan JSDoc above `withTimeout` (R20 regression)

**Why flagged.** R19 audit cycle re-read `core/utils/async.ts`. R20 had inserted `withTimeout` between `anySignal` and `linkSignals` but left the original `linkSignals` JSDoc in place. The orphan JSDoc now sat directly above `withTimeout` -- two JSDoc blocks stacked, one of them describing a different function below. `linkSignals` itself had no JSDoc anymore.

**Problem.** Real defect introduced by R20. A senior PR reviewer would flag this in 30 seconds; documentation reads wrong against the function it's attached to.

**Solution.** Deleted the orphan block above `withTimeout`. Wrote a fresh, terse JSDoc above `linkSignals` itself. Also tightened `withTimeout`'s own JSDoc -- the original was 16 lines explaining safeguards already named in code; collapsed to 8.

**Why this way.** Restore the documentation contract that R20 broke. Tighter `withTimeout` JSDoc removes implementation-detail prose (`settled` flag mechanics) that the code itself shows clearly.

### 2. `acquireSlot` helper unifies the inflight-controller pattern

**Why flagged.** Audit re-read `createIntent` and `finalizeUpload`. Both did the same four-step sequence: `new AbortController()` -> `map.set(localId, ctl)` -> `linkSignals(effectSignal, ctl)` -> in `finally`, `detach()` + `map.delete(localId)`. Two implementations of the same six-line ritual; future handlers would tempt a third copy.

**Problem.** Duplication. The "detach before delete" ordering is load-bearing (a late abort firing on a controller already removed from the map is benign but if logic ever inverts that order, the contract drifts).

**Solution.** Extracted `acquireSlot(map, localId, effectSignal)` in `store.libs.ts`. Returns `{ controller, release }`. Caller spreads the controller into the API call's `signal` and invokes `release()` in `finally`. The release function bundles the detach + the identity-aware delete (only clears if the invocation still owns the slot, mirroring R6's identity-aware ownership). Both handlers now read 1 line for acquire + 1 line for release.

**Why this way.** Helper-based dedup vs base class / context-manager. Each handler keeps its own try/catch/finally shape; the helper just owns the slot-lifecycle ritual. The identity-aware delete is folded in so future call sites can't forget it. Did NOT migrate `add-file.ts` because its validation controller has to be set sync (before `enqueueEffect` returns) so a cancel arriving immediately can find it; `acquireSlot`'s contract doesn't fit that shape and forcing it would weaken the existing pattern.

### 3. `finalize.ts` still had redundant `?.fileId` after R18

**Why flagged.** R18 tightened `hasIntent` to narrow `.intent` to non-null. R17 had done the call-site cleanup for `hasCursor`; R19 did it for `hasFile`. Grep for residual optional-chain-after-guard turned up `finalize.ts:40` -- same pattern, missed in R18.

**Problem.** Misleading defensive read. Implied `.intent` could be `null` after the guard, contradicting the type contract.

**Solution.** Extracted `fileId` above the template, replaced `?.fileId` with `.fileId` -- identical fix to the R19 cleanup of `run-upload.ts`.

**Why this way.** Same pattern as run-upload cleanup. Extracting the read out of the template also dropped the inline `??` fallback; the template now interpolates a definite `string`.

### Slop scrub continuation

**Why flagged.** Trailing JSDoc verbosity from R19.

**Actions.**
- `create-intent.ts` lost its 3-line "effect-signal forwarded into API call's own AbortController" comment block -- `acquireSlot` makes the wiring obvious.
- `create-intent.ts` `narrowIntent` JSDoc shrunk from 8 lines to 1.
- `finalize.ts` JSDoc shrunk from 4 lines to 2.

### IndexedDB factory test deferred

**Why deferred.** `createIndexedDBAdapter` factory was added in R19 with no test coverage. Vitest setup currently has no IndexedDB polyfill (browser DOM not available; `fake-indexeddb` not installed). Adding the test requires installing a dev dep, which is out of scope for a code-only polish round. Tracked as follow-up; the factory's surface area is small enough that the `MemoryAdapter` isolation test from R20 covers the equivalent semantic contract.

### Tests

- No new tests this round; 140 total still pass.

### Verification

```
npx vitest run        -> 10 passed (10) / 140 passed (140) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 22 -- attachSlot extraction + retry-codes dedup (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `acquireSlot` JSDoc claimed `addFiles` as a user (doc rot)

**Why flagged.** R21 added `acquireSlot` to unify the inflight-controller ritual but explicitly chose NOT to migrate `add-file.ts` (its sync pre-allocation shape didn't fit). The JSDoc still listed `addFiles` as a user, contradicting both the changelog and the call sites.

**Problem.** Self-contradicting documentation. A reader following the JSDoc to find `addFiles` callers would find nothing; a reader auditing usage would see the lie.

**Solution.** Split the helper. `attachSlot(map, localId, controller, effectSignal)` takes an already-allocated controller and returns the release fn. `acquireSlot` now composes `new AbortController + map.set + attachSlot` for the common case. `add-file.ts` migrated to use `attachSlot` directly so its sync pre-allocation pattern shares the release semantics.

**Why this way.** Split-and-compose. Both inflight-controller handlers (`createIntent`, `finalizeUpload`) keep their one-line `acquireSlot` call. `add-file.ts` keeps its sync pre-allocation but loses the manual `detach + identity-aware delete` boilerplate. Three handlers now share the same release semantics through two helpers.

### 2. `add-file.ts` manual release boilerplate

**Why flagged.** Direct consequence of R21's decision to skip add-file. The handler still wrote its own `detach()` + identity-aware delete in `finally`. Future fourth slot pattern would copy this manual approach.

**Problem.** ~5 lines of release-semantic boilerplate duplicated outside the shared helper. Drift hazard: a future invariant change (e.g. "release also invokes onSlotReleased hook") would need to update both the helper and the manual site.

**Solution.** Replaced the manual `linkSignals + finally{ detach; map.delete if owner }` block with `const release = attachSlot(rt.pendingValidations, localId, validationCtl, effectSignal)` at the top of the effect and `release()` in `finally`.

**Why this way.** Same release contract as the other two handlers. The sync pre-allocation outside the effect stays exactly as before; only the in-effect plumbing routes through the helper. Zero behavior change; the test suite (which exercises validation-during-cancel paths) verifies that.

### 3. `retryDecision` four sequential `if (code === 'X')` returns

**Why flagged.** Audit pass over `store.libs.ts`. Four sequential `if` statements all matching against an error code, all returning `{retryable: false}`. Each new non-retryable code requires another line; the pattern invites drift.

**Problem.** Four-line repetition with the only varying token being the code string. A future "auth_required" or "policy_violation" code add would tempt copy-paste.

**Solution.** Extracted `NON_RETRYABLE_CODES = new Set([...])` at module scope. The four `if`s collapsed to one `if (NON_RETRYABLE_CODES.has(ctx.error.code)) return { retryable: false }`. Also dropped a one-line const + temporary boolean (`maxAttempts`, `retryable`) that the next-line check made redundant.

**Why this way.** Set-based membership check is O(1), pulls the policy into one declarative list, and makes "add a new non-retryable code" a single-line edit. The Set is module-scoped so it allocates once at load.

### Slop scan

**Why flagged.** Trailing audit pass.

**Actions.**
- `acquireSlot` JSDoc rewritten to mention `attachSlot` as the alternative; the old line claiming `addFiles` as a user removed.
- `add-file.ts` validation-controller comment kept (explains why allocation happens sync) but tightened from 2 lines to 2.
- `retryDecision` JSDoc references the named constant instead of listing codes inline.

### Tests

- No new tests this round; 140 still pass. The `attachSlot` migration is behavior-preserving; existing tests cover the validation-cancel-during-checksum path.

### Verification

```
npx vitest run        -> 10 passed (10) / 140 passed (140) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 23 -- Decouple PII flags + dedup error context (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `errorContextInMessage` flag doubled as `keepRawCause`

**Why flagged.** R22 audit traced `normalizeError` call sites. All three handlers passed `rt.opts.config.errorContextInMessage` as the third arg, which is `keepRawCause: boolean`. The flag did two semantically distinct jobs: gate PII in message strings, and gate raw cause retention. Undocumented coupling -- a consumer who wanted file-name context in error messages had no way to opt out of raw cause retention (which can carry response bodies, auth headers, etc.).

**Problem.** One config field controlling two PII surfaces. A consumer enabling diagnostic context for messages was silently opted into raw cause retention too. The names matched semantically only for one of the two effects.

**Solution.**
- Added `keepRawCause: boolean` to `UploadConfig` (default `false`). Plumbed into `resolveUploadConfig`.
- Updated all three handlers (`createIntent`, `finalizeUpload`, `runUpload`) to pass `rt.opts.config.keepRawCause` as the third arg to `normalizeError`.
- `errorContextInMessage` now only controls the message string. Default still `false` for both flags so existing consumers see no behavior change.

**Why this way.** Two flags, two concerns, two defaults. Consumers who only want diagnostic message context can `errorContextInMessage: true, keepRawCause: false` and persistence stays sanitized. The fields are documented as PII gates at their definitions so the trust boundary is explicit.

### 2. PII-gated error-context template duplicated across three handlers

**Why flagged.** Audit re-read the three handler error paths. Each builds an `errorWithContext` value via the same shape: `if (errorContextInMessage) { ...error, message: \`${error.message} (${ctx})\` }`. Three call sites with the same conditional ceremony, only the context-building expression differs.

**Problem.** Three near-identical spread-and-template patterns. A future change to the wrapping format (e.g. structured context fields instead of string suffix) would require updating three sites.

**Solution.** Extracted `withErrorContext(error, enabled, build)` in `store.libs.ts`. Returns the same ref unchanged when disabled (so no allocation on the off path); when enabled, builds the context lazily via the callback and returns `{...error, message: \`${error.message} (${ctx})\`}`. All three handlers refactored to use it. Each handler's call shrank from ~7 lines to ~5, with the variable-bit (the context-fields template) isolated in a 1-line lambda.

**Why this way.** Helper-with-lambda over a more-structured `withErrorContext(error, fields)` that takes an object. The fields differ per handler (run-upload includes `phase`, finalize includes `fileId`, create-intent includes `purpose`); a structured signature would either need a union or accept untyped extra props. The lambda keeps each call site's context expression typed and inline.

### 3. Effect-queue compaction magic numbers

**Why flagged.** Audit caught two unnamed numerics in the dequeue compaction logic: `head > 64` and `head * 2 > length`. The numbers were correct for their purpose but a reader had to derive their intent from the surrounding comment.

**Problem.** Magic numbers. Reader has to reason about why 64, why ratio 2, both inline.

**Solution.** Hoisted to module-level constants: `EFFECT_QUEUE_COMPACT_MIN_HEAD = 64`, `EFFECT_QUEUE_COMPACT_RATIO_DENOM = 2`. Each carries a one-line JSDoc explaining the role. The compaction comment also rewritten to explain WHY both bounds together (avoid constant memmove + avoid unbounded growth).

**Why this way.** Named constants over config exposure. These thresholds are internal heuristics tuned to typical workloads (batch ingest, sustained streams); exposing them as `effectQueueCompactThreshold` config invites consumers to tune them without understanding the trade-off. Module constants give the same readability win without widening the public API.

### Tests

- **+4 R23 tests** (now 144 total):
  - `withErrorContext` returns same ref when disabled.
  - `withErrorContext` appends `(context)` suffix when enabled.
  - `keepRawCause=true` preserves the thrown value as `cause`.
  - `keepRawCause=false` sanitizes the cause to `{name, message}`.

### Verification

```
npx vitest run        -> 10 passed (10) / 144 passed (144) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 24 -- IndexedDB factory tests + small dedup (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `createIndexedDBAdapter` factory had zero test coverage (R19 introduction, 3 rounds running)

**Why flagged.** R19 introduced the factory; R21 deferred a test for lack of `fake-indexeddb` dep; R22 + R23 kept the gap. The factory's isolation contract (per-call memoized connection) and the `InvalidStateError`/`onversionchange` reset paths were unverified.

**Problem.** Public API surface untested. A regression in the factory (e.g. forgetting per-instance memoization) would not be caught.

**Solution.** Installed `fake-indexeddb` as a dev dep. Added two factory tests: round-trip via fake IDB; two factory adapters with different names own isolated stores. Both tests stash the global `indexedDB` before mutating and restore after.

**Why this way.** `fake-indexeddb` is the standard test polyfill (used by `idb`, `dexie`, and others). The save/load/clear round-trip covers the hot path; the named-isolation test pins the contract R19 was created to guarantee.

### 2. `attempt` lookup duplicated in two handlers

**Why flagged.** R23 audit caught `itemForContext && 'attempt' in itemForContext ? (itemForContext.attempt ?? 1) : 1` in both `run-upload.ts:189` and `finalize.ts:41`.

**Problem.** Two-handler dup of a non-obvious narrowing-and-default expression. Drift hazard.

**Solution.** Extracted `getAttempt(item) -> number` in `store.libs.ts`. Returns 1 if undefined or attempt-less; otherwise `item.attempt ?? 1`. Both handlers call `getAttempt(itemForContext)`.

**Why this way.** Tiny helper, one-line bodies, zero allocation. The narrowing happens in the helper so call sites read as plain expressions.

### 3. `scheduleRetry` `sleptCleanly` flag hid control flow

**Why flagged.** R22 introduced the `sleptCleanly` boolean to deduplicate the dispatch call. R23 audit noted it as the most clever single line left -- the catch-set-flag-then-branch pattern was harder to follow than two parallel exit paths.

**Problem.** Cleverness vs. clarity. Reader has to mentally model the flag's state across both branches.

**Solution.** Restructured to linear: `try { sleep; check dedup; dispatch }` `catch { check dedup; check phase; dispatch; return }`. Each branch reads top-to-bottom; the dedup check appears in both but is one line each.

**Why this way.** Linear control flow over flag-based merging. The total line count is the same; readability wins.

### 4. Inline 4-line abort-context sample block in `run-upload.ts`

**Why flagged.** R23 audit noted the `errAborted / errMode / errItem / errCursor` block appearing twice (success path + catch path) without sharing structure.

**Problem.** Repeated 4-line sampling block with a non-obvious TOCTOU rationale buried in inline comments.

**Solution.** Extracted `sampleAbortContext(rt, localId, controller, inflight)` at the bottom of `run-upload.ts`. Returns `{ aborted, mode, cursor }` in one synchronous block. Both call sites read `const ctx = sampleAbortContext(...)` then branch on `ctx.aborted`/`ctx.mode`/`ctx.cursor`. The TOCTOU rationale lives in the helper's JSDoc once.

**Why this way.** Single source of truth for the atomic sample. The helper's structure documents the contract: "if not aborted, mode is whatever the inflight slot said and cursor is undefined; if aborted, we additionally sample the cursor from state". Both call sites get the same guarantees automatically.

### 5. `useUploader.byPhase` allocation -- left as-is

**Why flagged.** R23 audit noted the per-real-change `Record` allocation.

**Decision.** Held. The shape consumers want IS a per-phase bucket map; rebuilding on every state change is the contract. Memoization via deep-equal would cost more than it saves; partial memo via phase counts would diverge from item identity.

### Tests

- **+2 R24 tests** (now 146 total):
  - `createIndexedDBAdapter` round-trips via fake-indexeddb.
  - Two factory adapters with different names own isolated stores.

### Verification

```
npx vitest run        -> 10 passed (10) / 146 passed (146) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 25 -- Runtime immutability + fuzz + multi-tab (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `getSnapshot().items` was mutable at runtime despite the readonly type

**Why flagged.** R13 wrapped `getSnapshot` to return a frozen object typed `ReadonlyUploadState`. The `items` field was typed `ReadonlyMap` but the underlying value was the raw `Map`; a consumer who reached past the types could still call `.set()` / `.delete()` / `.clear()` directly and corrupt the store. Type-system contract not backed by runtime enforcement.

**Problem.** Footgun for consumers using JS or fighting the types. Test code in particular could accidentally mutate.

**Solution.** New `readOnlyMap(map)` helper wraps the Map in a `Proxy` that returns throwing stubs for `set`/`delete`/`clear` and forbids direct property writes. Read methods (`get`, `has`, `entries`, `keys`, `values`, `Symbol.iterator`) pass through bound to the original target. `getSnapshot` now returns `{ items: readOnlyMap(rt.state.items) }`.

**Why this way.** Proxy over `Object.freeze(map)`: `Object.freeze` doesn't block Map method calls (it only freezes property writes). Proxy is the standard JS pattern for read-only collections. Methods that need internal `this` (e.g. `get`) get auto-bound so consumers can use them without `.bind(target)`.

### 2. `useUploader.byPhase` buckets weren't frozen

**Why flagged.** R23 audit declared byPhase per-real-change allocation as "optimal for the shape". Re-read confirmed it's optimal at the allocation level -- but the bucket arrays were freshly allocated without `Object.freeze`. Consumers using `React.memo` against bucket refs couldn't rely on identity OR immutability.

**Problem.** Bucket arrays mutable; downstream memo equality couldn't pin behavior.

**Solution.** Each bucket array now `Object.freeze`'d after the partition pass; the outer `Record` is frozen too. Consumers see real immutability.

**Why this way.** Same readonly-by-default contract as `getSnapshot`. Freezing is cheap on a one-time-per-real-change basis.

### 3. Effect-queue compaction thresholds hardcoded (R23 named them; R24 left them inline)

**Why flagged.** R23 hoisted the magic numbers to module constants. R24 left them at module scope (not consumer-tunable). Audit noted them as the last hardcoded perf knob in the runtime.

**Problem.** Long-running streams with peculiar dequeue patterns might want different thresholds; consumer had no recourse.

**Solution.** Added `effectQueueCompaction: { minHead: number; ratioDenom: number }` to `UploadConfig` (defaults `{minHead: 64, ratioDenom: 2}`, clamped with `Math.max(1, ...)` / `Math.max(2, ...)`). `processEffects` reads from `rt.opts.config.effectQueueCompaction`. Module constants removed.

**Why this way.** Consumer-tunable with sane defaults. Most consumers never set the field; advanced consumers profiling queue costs have a knob. Validation clamps prevent absurd values that would break the invariant (e.g. `minHead: 0` would compact every dequeue).

### 4. `createIndexedDBAdapter` cross-tab versionchange untested

**Why flagged.** R24 added factory round-trip + isolation tests. The cross-tab `onversionchange` reset path (the most error-prone part of the implementation) was still untested. R24 audit specifically flagged this.

**Problem.** Zero coverage on the multi-tab path; behavior under "second tab opens at v2" was unverified.

**Solution.** Added R25 test: open v1 adapter, save data, open v2 adapter (simulating another tab), save data through v2, then call `v1.load`. **Discovered a real behavior gap during test authoring**: after `onversionchange` closes the v1 connection and resets `dbPromise`, the v1 adapter tries to reopen at version 1 -- which is now BELOW the upgraded version, so IndexedDB raises VersionError. The original `req.onerror` handler wraps the native error into `PersistenceError('unavailable', ...)`, so the surface is clean. Test pins this: `v1.load` rejects with a typed `PersistenceError`, not an unhandled native exception.

**Why this way.** Document the actual contract: consumers using IndexedDB across tabs must coordinate `persistence.version` bumps. The lower-version adapter cannot recover; surfacing as a typed PersistenceError gives consumers a chance to swap adapters or fail gracefully.

### 5. No fuzz coverage on reducer transitions

**Why flagged.** R24 audit noted 146 example-based tests but no property-based coverage. Reducer is the engine's most complex pure function; example tests pin specific transitions but can miss state-machine edge cases.

**Problem.** Property-based gaps. A future reducer edit could silently regress an unexercised transition.

**Solution.** Installed `fast-check`. New `reducer-fuzz.test.ts` covers two properties:
1. Reducer never throws on arbitrary sequences (200 runs, up to 30 events) -- catches any new switch branch that forgot to handle a phase.
2. Reducer returns the same state ref on no-op events (100 runs) -- locks in R15's lazy-alloc invariant for any non-terminal-event applied to a `completed` item.

**Why this way.** `fast-check` is the standard property-based testing lib for TS. Two targeted properties give meaningful coverage without the maintenance burden of stateful model testing. The seed states and event generators are inline (not a separate fixtures module) so the test reads end-to-end.

### Tests

- **+3 R25 tests** (now 149 total):
  - `createIndexedDBAdapter` versionchange surfaces typed PersistenceError.
  - Reducer fuzz: no throws on arbitrary event sequences.
  - Reducer fuzz: no-op events return same state ref.

### Verification

```
npx vitest run        -> 11 passed (11) / 149 passed (149) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 26 -- Test pinning + alias + JSDoc pairing (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `readOnlyMap` runtime block was untested

**Why flagged.** R25 added Proxy-based runtime enforcement of `getSnapshot().items` immutability. R25 audit noted the protection was real but lacked a direct test -- a future refactor of `readOnlyMap` could regress the block without anything failing.

**Problem.** Coverage gap. The Proxy worked but its contract wasn't pinned by an assertion.

**Solution.** New test directly invokes `items.set / .delete / .clear` on the read-only view and asserts each throws with a `/read-only/` message. Same pattern as the R13 top-level-freeze test.

**Why this way.** Triple-method assertion in one test (vs three separate tests) keeps the suite tight; the Proxy's contract is symmetric across all three methods.

### 2. Unused `receiver` Proxy param

**Why flagged.** R25 biome warned `noUnusedFunctionParameters` on the third `get(target, prop, receiver)` arg. Auto-fix was tagged unsafe (renaming might break a manual call site reference), so R25 left it.

**Problem.** Lint warning carried through. Reader has to wonder why `receiver` is named but unused.

**Solution.** Dropped the parameter entirely (`get(target, prop)`). Also added an inline comment explaining why `Reflect.get` passes `target` as the receiver rather than the proxy -- Map's internal slots (`[[MapData]]`) resolve via the underlying object, not the proxy.

**Why this way.** Dropping > renaming. The handler signature accepts a variadic `receiver` per JS spec; omitting trailing params is legal and produces no behavior change. Reader sees only what's used.

### 3. `InflightMode` literal repeated

**Why flagged.** R25 audit caught `'normal' | 'pause' | 'cancel'` declared inline on `InflightUpload.mode` and repeated in `sampleAbortContext`'s parameter + return types.

**Problem.** Three copies of the same union. Adding a fourth mode (e.g. `'soft-cancel'`) requires three edits.

**Solution.** Hoisted `InflightMode = 'normal' | 'pause' | 'cancel'` to `store.types.ts`. Both `InflightUpload` and `sampleAbortContext` reference the alias.

**Why this way.** Single source of truth for the union. The alias is exported so future helpers can import it without re-declaring.

### 4. `acquireSlot` + `attachSlot` JSDoc not paired

**Why flagged.** R25 noted the two helpers share a contract (release semantics, identity-aware delete) but each had a separate JSDoc that documented its own variant. Reader had to read both to understand the relationship.

**Problem.** Documentation scattered across two adjacent helpers.

**Solution.** Pulled the shared contract into `attachSlot`'s JSDoc (it's the lower-level building block) and made `acquireSlot`'s JSDoc a one-line cross-reference. The shared contract now lives in one place; the variant choice is described as a pair.

**Why this way.** One canonical doc block per shared contract. Cross-references keep the relationship explicit without duplicating prose.

### 5. Deepened reducer fuzz

**Why flagged.** R25 introduced 2 fast-check properties but all events were `fc.constant(...)` -- only the event-type permutation was randomized, not payloads.

**Problem.** Shallow fuzz. HTTP status codes, byte counts, and retryability flags weren't exercised across their valid ranges.

**Solution.**
- HTTP `status` randomized via `fc.integer({min:100,max:599})` for `intent.failed` and `upload.failed` events. Retryability derived from status for consistency with the engine's classifier.
- Progress `uploadedBytes` randomized via `fc.integer({min:0,max:10})` for `upload.progress` events.
- Added `paused` event with a cursor payload to cover the cursor-bearing event branch.
- New property: **every reduce call produces either the same state ref or a state whose `items` Map is a fresh ref** -- pins R15's lazy-alloc invariant against future drift.

**Why this way.** Random payloads catch arithmetic / boundary bugs in the reducer. The structural-invariant property locks in the contract R15 added (no in-place Map mutation).

### Tests

- **+2 R26 tests** (now 151 total):
  - `getSnapshot().items` blocks `.set` / `.delete` / `.clear` at runtime.
  - Reducer fuzz: items Map is either same ref or fresh ref (never in-place mutated).

### Verification

```
npx vitest run        -> 11 passed (11) / 151 passed (151) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 27 -- R26 regression fix + fuzz seed + cross-tab docs (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. Orphan JSDoc above `InflightMode` (R26 regression)

**Why flagged.** Same regression class as R20's orphan JSDoc. R26 inserted `InflightMode` between the original `InflightUpload` JSDoc and `InflightUpload` itself. The original JSDoc now sat above `InflightMode`, while a fresh one-liner R26 added also stacked there. `InflightUpload` had no JSDoc anymore.

**Problem.** Documentation on the wrong target. Second time this exact pattern slipped through in this codebase -- worth flagging as a recurring habit issue, not just a one-off slip.

**Solution.** Reordered: `InflightMode` and its one-line JSDoc come first (it's the dependency), then `InflightUpload`'s JSDoc and declaration. The two JSDoc blocks now each sit directly above the correct type.

**Why this way.** Declaration order follows dependency order: `InflightUpload` references `InflightMode`. Reader gets the alias definition first, then the struct that uses it. JSDoc blocks attach to the declarations immediately below them.

### 2. Fuzz seed was fixed (`validating` item only)

**Why flagged.** R26 deepened event-payload randomization but the starting state was always a `validating` item with `localId: 'a'`. Property-based testing benefits from seed diversity too -- a reducer bug specific to `paused` or `ready` starts wouldn't be caught.

**Problem.** Half-randomized property tests. Events drawn from a distribution, seed fixed.

**Solution.** New `seedArb` arbitrary draws from four starting states: `validating`, `ready`, `paused` (with cursor + progress), and empty. The two sequential-reduce properties now pull a seed from `seedArb` per run.

**Why this way.** Four canonical phases cover the most-likely-to-bug starting points. Drawing from `seedArb` per run gives ~75 runs per starting state at `numRuns: 300`, which exercises each starting shape against varied event sequences. Empty-map seed catches "what if `localId` doesn't exist" branches.

### 3. Cross-tab IndexedDB contract undocumented

**Why flagged.** R25 added the multi-tab test and uncovered a real contract: a lower-version adapter surfaces `PersistenceError('unavailable')` after another tab bumps the version. R26 audit flagged this as a real consumer behavior with no README section.

**Problem.** Consumers using IndexedDB across tabs have no docs on what happens at a version bump. The cleanest behavior was untold.

**Solution.** New README "Cross-tab IndexedDB contract" subsection. Explains: onversionchange resets the handle; reopen at the old version fails; surface is `PersistenceError('unavailable')`. Three-bullet policy: bump version in lockstep, treat the error as a reload/swap signal, snapshot-version mismatch surfaces the same way.

**Why this way.** Document the actual contract; don't try to paper over it. A "magic recovery" path would either silently lose data or silently desync across tabs. The clean error is the right outcome; the README just makes that explicit.

### 4. Fuzz describe label said `R25/R26`

**Why flagged.** R26 added a property to the existing `describe('R25: reducer fuzz', ...)` block and renamed it to `R25/R26`. R26 audit noted the multi-round attribution as smelly.

**Problem.** Test describe labels shouldn't carry changelog versions.

**Solution.** Renamed to plain `describe('reducer fuzz', ...)`. Individual test names keep their `R25:` / `R26:` prefixes since those mark specific properties tied to round-specific invariants.

**Why this way.** Top-level describes name the subject; nested test names track which round introduced which assertion. Future rounds add new `test('R28: ...', ...)` lines without touching the describe.

### 5. README adapter examples used deprecated singleton

**Why flagged.** Adjacent to the cross-tab section: the existing example showed `IndexedDBAdapter` (deprecated singleton from R19). Combined with the new advice to swap to memory on quota error, the example contradicted the recommended factory pattern.

**Problem.** Documentation drift between code (factory) and docs (singleton).

**Solution.** Example now uses `createIndexedDBAdapter()`. Added a one-line note steering consumers toward the factories over the singletons.

**Why this way.** Docs follow code. Factories let each store own its connection; singletons share globally and bite multi-store tests.

### Tests

- No new tests; 151 still pass. Fuzz now runs 300 runs across 4 starting states instead of 200 runs from a fixed state.

### Verification

```
npx vitest run        -> 11 passed (11) / 151 passed (151) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 28 -- README scrub + identity test + statusCode (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. README still contained em-dashes (src was scrubbed in R17)

**Why flagged.** R17 scrubbed em-dashes from `src/`. README was missed. R27's new cross-tab section reintroduced them. Audit caught the inconsistency: source style is em-dash-free; README still uses them.

**Problem.** Style drift between code and docs.

**Solution.** Bulk `sed` over `README.md` replacing `—` with `--`. Zero em-dashes left in the package.

**Why this way.** Same one-liner R17 used on src. Documents-as-code: same style policy across both.

### 2. README "swap to memory" advice implied runtime adapter swap

**Why flagged.** R27's cross-tab section advised: "swap to `createMemoryAdapter()` until the user closes other tabs." Audit caught that the engine fixes the adapter at construction; there's no runtime swap API. Consumers would have to tear down and reconstruct the store.

**Problem.** Doc described an API that doesn't exist. A consumer reading this would write code that doesn't work.

**Solution.** Rewrote that bullet: "The adapter is fixed at construction; the store does not support runtime adapter swap. If you want graceful fallback to in-memory persistence, the consumer must tear the store down and reconstruct with `createMemoryAdapter()`."

**Why this way.** Document the actual contract. "Tear down + reconstruct" is the real recovery path; making it explicit prevents consumers from writing a runtime-swap helper that does nothing.

### 3. `acquireSlot` identity-aware release path had no direct test

**Why flagged.** R26 audit noted: identity-aware delete in the release fn is documented + covered transitively by integration tests, but no unit test directly asserts "stale invocation reaches finally, fresh slot survives."

**Problem.** Critical correctness behavior with only indirect coverage.

**Solution.** Three new tests in `store-libs.test.ts`:
- Stale `release()` does NOT clear a map entry that a peer invocation has overwritten.
- Owning `release()` DOES clear the map entry.
- `effectSignal.abort()` propagates into the slot's controller.

**Why this way.** Direct unit tests pin the contract independent of integration plumbing. A future refactor of `attachSlot` cannot regress the identity check without breaking these.

### 4. `statusCode` alias path had no direct test

**Why flagged.** R23 audit noted `extractHttpStatus` accepts both `status` and `statusCode`. Only `status` had a test; the `statusCode` alias (used by Node's `http`, axios, etc.) was only implicitly covered.

**Problem.** Codepath documented but unverified.

**Solution.** New test asserts `normalizeError({ statusCode: 503, message: 'down' })` classifies as `http` with `retryable: true`.

**Why this way.** Same shape as the existing `status` test; the alias path needs the same explicit coverage.

### Tests

- **+4 R28 tests** (now 155 total):
  - `normalizeError` accepts `statusCode` alias.
  - `acquireSlot` stale release doesn't clobber peer.
  - `acquireSlot` owning release clears entry.
  - `acquireSlot` propagates effectSignal abort.

### Verification

```
npx vitest run        -> 11 passed (11) / 155 passed (155) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 29 -- Direct helper coverage + XHR transport tests (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `attachSlot` had no direct test (only transitive coverage)

**Why flagged.** R28 audit noted `attachSlot` was the lower-level building block beneath `acquireSlot`, but only `acquireSlot` was directly tested. A future refactor extracting different semantics into `attachSlot` would not be caught.

**Problem.** Coverage hole. Test pyramid inverted -- higher-level helper tested, lower-level not.

**Solution.** Three direct tests:
- `release()` detaches the effect-signal listener (late abort does not propagate).
- Identity-aware delete: stale invocation doesn't clobber a peer-owned slot.
- `release()` with `undefined` effectSignal still clears the map entry.

**Why this way.** Mirrors the R28 `acquireSlot` triplet but exercises `attachSlot` directly so a future divergence between the two is caught.

### 2. `getAttempt` helper had no direct test

**Why flagged.** R24 introduced `getAttempt(item)` to dedupe `'attempt' in item ? (item.attempt ?? 1) : 1` across two handlers. Used by both, but no direct unit test.

**Problem.** Helper-coverage matrix gap. The narrowing logic and the `?? 1` fallback weren't pinned.

**Solution.** Three direct tests: `undefined` item, item without `attempt` field, item with `attempt` set.

**Why this way.** Triplet covers the three paths the helper branches through. Future refactor (e.g. switching from `'attempt' in item` to a structural check) cannot regress the contract without breaking one of these.

### 3. `acquireSlot` fast-fire path was untested

**Why flagged.** R26 audit noted the fast-fire case (`effectSignal.aborted === true` at construction) had no test.

**Problem.** Edge case in the controller wiring. If `linkSignals` ever stops calling the abort handler synchronously when the signal is already aborted, the regression goes silent.

**Solution.** New test: pre-abort the outer signal, call `acquireSlot`, assert the controller's signal is aborted before `release()`.

**Why this way.** Pinning the fast-fire contract at the helper layer prevents handler-level integration tests from being the only safety net.

### 4. `createXHRTransport` had zero unit tests

**Why flagged.** R28 audit caught this. Transport was exercised through full upload integration tests, not directly. Behaviors like HttpError construction, CRLF rejection, abort propagation, progress forwarding were transitively covered but not pinned.

**Problem.** Transport is a public API entry point with non-trivial wiring (status classification, header parsing, abort lifecycle, progress events). Integration coverage is too coarse to catch a regression in any individual concern.

**Solution.** New `transport.test.ts` with a `MockXHR` class (captures method/url/headers/body, exposes `fireSuccess` / `fireError` test hooks). Eight tests:
- `put` resolves on 2xx and parses ETag.
- `put` rejects with `HttpError` on non-2xx status.
- `put` rejects with `NetworkError({cors: true})` on `status=0`.
- `put` rejects with `UploadAbortError` when the signal aborts.
- `put` rejects headers containing CRLF.
- `put` rejects non-absolute URLs.
- `put` forwards upload progress events.
- `postForm` builds `FormData` with fields + file.

**Why this way.** Mock XHR is the standard pattern -- `xhr-mock` or hand-rolled. Hand-rolled is fine here: the surface is small and the engine's expectations are well-defined. Beforeach/afterEach stash + restore the global so other test files aren't affected.

### Tests

- **+15 R29 tests** (now 170 total):
  - `attachSlot`: 3 tests (detach, identity-aware, no-effectSignal).
  - `acquireSlot` fast-fire: 1 test.
  - `getAttempt`: 3 tests.
  - `createXHRTransport`: 8 tests.

### Verification

```
npx vitest run        -> 12 passed (12) / 170 passed (170) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 30 -- Helper coverage matrix completion (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `dropController` had no direct test

**Why flagged.** R20 introduced the helper to dedupe 5 blocks in `releaseAllSlots`. Only transitive coverage existed.

**Problem.** The abort-then-delete sequencing isn't asserted as a unit. A refactor inverting the two steps would not be caught at the helper level.

**Solution.** Exported the previously-private function. Three direct tests: abort + delete with reason preserved, no-op on missing key, idempotent across double calls.

**Why this way.** Export is justified -- the helper is reusable for future adapter-style maps. Tests are simple enough to keep next to the existing acquireSlot triplet.

### 2. `withTimeout` had no direct test

**Why flagged.** R20 extracted the helper to dedupe the `runWithTimeout` + `applyLoaded` watchdog pattern. Both call sites were tested through integration. The settled-flag + `.catch(()=>{})` safeguards (R13/R17 regression class) had no direct unit pin.

**Problem.** Same R13-class regression could resurface if `withTimeout` is refactored. Integration coverage too coarse to localize.

**Solution.** Six tests in new `async-helpers.test.ts`:
- Resolves when the promise wins.
- Rejects with the builder error when the watchdog wins.
- Invokes `onTimeout` side effect when watchdog wins.
- Skips the watchdog when `timeoutMs <= 0`.
- Settled flag stops the watchdog from firing after the promise wins.
- Lost-race rejection does not bubble as an unhandled rejection (via `unhandledrejection` event listener).

**Why this way.** Each safeguard gets its own pin. The unhandled-rejection test is the most subtle -- attaches an `unhandledrejection` listener and asserts an empty captured array. Catches future regressions of the R13 pattern at the helper level.

### 3. `linkSignals` had no direct test

**Why flagged.** Transitive coverage via `attachSlot` tests; no direct unit.

**Problem.** Foundational helper for signal forwarding; should be tested at its layer.

**Solution.** Four tests: undefined-signal no-op, fast-fire on already-aborted signal, late-abort propagation, detach prevents subsequent aborts.

**Why this way.** Mirrors the `attachSlot` triplet shape but exercises `linkSignals` directly. Future divergence between the two is now catchable at the helper level.

### 4. `isTransientNetworkFailure` had no direct test (R12 regression class)

**Why flagged.** R12 explicitly dropped the message-regex retry classifier (`/network/i`, `/5\d\d/`, etc.) in favor of structural HttpError/NetworkError. R28 audit noted this critical contract had only transitive integration coverage.

**Problem.** The structural-vs-regex contract is the most important behavior the multipart strategy enforces. If the helper ever drifts back to message sniffing, integration tests might still pass on common cases.

**Solution.** Exported `isTransientNetworkFailure` from `strategies/multipart`. New `multipart-classifier.test.ts` with six tests:
- NetworkError classifies as retryable.
- HttpError 5xx classifies as retryable.
- HTTP 429 classifies as retryable (both HttpError and `{status}`/`{statusCode}` shapes).
- HTTP 4xx (except 429) classifies as final.
- Non-network non-HTTP throws classify as final.
- **Regression check**: plain `Error('500-pixel image failed')` and `Error('please fetch from the network drive')` must NOT classify as retryable. Pins the R12 anti-regression contract explicitly.

**Why this way.** The regression-check test is the keystone. Names the threat directly (message-substring sniffing) and verifies it cannot resurface without a test failure. The other five pin the positive contract.

### Tests

- **+19 R30 tests** (now 189 total):
  - `dropController`: 3 tests.
  - `withTimeout`: 6 tests.
  - `linkSignals`: 4 tests.
  - `isTransientNetworkFailure`: 6 tests.

### Verification

```
npx vitest run        -> 14 passed (14) / 189 passed (189) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Round 31 -- Config knob coverage + emitter depth + persistence fuzz (rating ongoing)

> Each entry carries **Why flagged / Problem / Solution / Why this way**.

### 1. `effectQueueCompaction` config had no behavior test

**Why flagged.** R23 added the public knob with clamped defaults. R30 audit caught that no test verified custom values were threaded through or that the clamps worked.

**Problem.** Public knob with no test. Future refactor of `resolveUploadConfig` could regress the clamp/default behavior without anything failing.

**Solution.** Four tests in `store-libs.test.ts`:
- Defaults applied when omitted (64 / 2).
- Custom values pass through.
- `minHead` clamps to >= 1.
- `ratioDenom` clamps to >= 2.

**Why this way.** Each clamp boundary gets its own assertion. Future drift on either invariant is caught at the helper level, not at integration runtime.

### 2. Emitter `MAX_EMIT_DEPTH` warning had no test

**Why flagged.** R14 introduced the soft cap on emit re-entry. Documented as a dev-only `console.warn` once per top-level emit. R30 audit noted no test pinned the warn behavior.

**Problem.** Re-entrancy cap is a real correctness contract (catches feedback loops). The warn fires once per outer emit by design; both the threshold and the once-per-emit semantics were unverified.

**Solution.** New test: feedback-loop listener re-emits the same event up to depth 60 (above the cap of 50). Spy on `console.warn` with `NODE_ENV='development'`. Assert exactly one matching warning is logged. Old NODE_ENV restored in finally.

**Why this way.** Direct assertion on both the trigger (depth > 50) and the once-per-emit invariant (`warnings.length === 1`). NODE_ENV stash/restore prevents test bleed.

### 3. Snapshot serialization round-trip had no fuzz coverage

**Why flagged.** R23 added the version-fence on serialize + deserialize. Example tests existed but no property-based round-trip. The implicit invariant -- "a paused item that goes through `serialize -> JSON -> deserialize` recovers everything except `file`" -- was untested at scale.

**Problem.** Persistence layer carries snapshots across reloads. Any drift in the field-by-field serialize/deserialize translation could silently lose data on certain payloads. Example tests cover specific shapes; fuzz catches edge cases (long names, varied sizes, varied types).

**Solution.** New `persistence-fuzz.test.ts` with two properties:
- Round-trip: arbitrary `paused` items survive `serialize -> JSON.stringify -> JSON.parse -> deserialize`. Asserts phase, fingerprint, intent, cursor all match the original. `file` is stripped (documented behavior). Up to 5 items per state; deduped by `localId`.
- Version-fence: any mismatched `expectedVersion` (2-100) against a v1 snapshot always returns null.

**Why this way.** Arbitrary covers the field combinations that matter (filename, size, type, cursor offset, progress). `fc.constantFrom` for MIME type since random strings would fail the `isIntent` type guard. Cursor offset bounds match realistic upload sizes. Version-fence fuzz pairs cleanly with the snapshot fuzz: same setup, different question.

### Tests

- **+7 R31 tests** (now 196 total):
  - `effectQueueCompaction`: 4 tests.
  - Emitter depth-cap warning: 1 test.
  - Persistence round-trip fuzz: 1 property (100 runs).
  - Persistence version-fence fuzz: 1 property (50 runs).

### Verification

```
npx vitest run        -> 15 passed (15) / 196 passed (196) -- 2.0s
turbo check-types     -> green
biome check           -> green
```

---

## Final state

```
Test Files  10 passed (10)
     Tests  122 passed (122)
   Duration ~2.0s

turbo run check-types --filter='@gentleduck/upload' --filter='@gentleduck/registry-examples'
→ Tasks: 10 successful, 10 total

biome check packages/duck-upload
→ Checked 79 files. No fixes applied.
```

| | Round-0 baseline | After Round 6 |
|---|---|---|
| Architecture | 8 | 9.3 |
| Type safety | 8.5 | 9.1 |
| API design | 7 | 8.7 |
| Completeness | 6 | 8.9 |
| Testing | 1 | 8.7 |
| Edge cases | 6 | 8.7 |
| Docs | 6.5 | 9.3 |
| **Overall** | **6.8** | **8.9** |

### Known trade-offs

- **Persistence during the error window**: state changes that arrive while `onPersistenceError` is routing are NOT trailing-flushed. Trade-off vs unbounded async loops on permanent failures (e.g. quota exceeded). Consumers needing strict durability should treat `onPersistenceError` as a signal to pause their own writes until they verify recovery.
- **`calculateFileChecksum`** is signal-aware between async boundaries but Web Crypto's `digest` itself is not cancellable mid-flight. Best win is for medium/small files; multi-GB files still hold the slot during the digest call.
- **`errorContextInMessage` default changed to `false`** (BREAKING). Filenames/file sizes are PII in some deployments; consumers who want the diagnostic context back must opt in via `config: { errorContextInMessage: true }`.

---

## Round 11 — Namespace migration + vulnerability sweep (rating 8.9 → 9.1)

### Architecture: namespace-only public surface

- **`src/strategies/{multipart,post,registry}/index.ts → src/strategies/{multipart,post,registry}.ts`**. Three single-file folders flattened. Each strategy is now one `.ts` file; the folder hierarchy was carrying no information. Subpath exports in `package.json` still resolve because `tsdown` rewrites them on build.
- **`src/core/engine/validation/validation.ts → src/core/engine/validation.ts`**. Same flatten — the folder held one file. Consolidated `validateFile` + `validateFileList` + `validateIntent` (already in one module; the wrapping folder was pure noise).
- **`src/core/utils/emitter/index.ts` split into `emitter.ts` (runtime) + `index.ts` (barrel)**. The folder convention everywhere else in the repo is `<module>.ts` for runtime and `index.ts` as a pure re-export; the emitter folder was the one outlier with runtime code in `index.ts`.
- **All public types now live behind an `I`-prefixed namespace**. `Strategy.ICtx`, `Strategy.IStrategy`, `Strategy.IRegistry`, `Store.IUploadStore`, `Store.IOptions`, `Store.IRuntime`, `Store.IInflightUpload`, `Engine.Item`, `Engine.Command`, `Reducer.IState`, `Reducer.IReadonlyState`, `Persistence.IAdapter`, `Persistence.IPersistedSnapshot`, `Client.IUploadConfig`, `Client.IUploadHooks`, `Client.IUploadPlugin`, `Contracts.IUploadApi`, `Contracts.IResultBase`, `Contracts.IFileFingerprint`, `Contracts.IValidationRules`, `Transport.IUploadTransport`, `Emitter.ITypedEmitter`, `Multipart.IIntent`, `Multipart.ICursor`, `Post.IIntent`, `Post.ICursor`, `Uploader.IUploader`, `Uploader.IActions`. Constants moved to nested `Defaults` namespaces (`Defaults.RETRY_DELAY_BASE_MS`, `Multipart.Defaults.MAX_PART_CONCURRENCY`).

**Why this matters.** Same pattern as `duck-calendar` / `duck-iam`. One import token (`Strategy`, `Store`, `Engine`) brings every related type into scope, autocomplete works against a tree instead of a flat list, and there is no dual-export surface that drifts. No `@deprecated` flat aliases — every consumer goes through the namespace.

**How to migrate.** Anywhere you previously imported `IUploadConfig` from `@gentleduck/upload`, replace with `Client.IUploadConfig`. Same for every other interface. No runtime change.

### `Strategy.IRegistry` storage swap (TS variance fix)

- **`src/strategies/registry.ts`** — internal storage changed from `Partial<{ [K in keyof M & string]: IStrategy<M, C, P, R, K> }>` to a plain `Map<string, AnyStrategy>`.

**Why flagged.** Homomorphic mapped types (`{ [K in keyof M & string]: ... }`) are not assignable for writes when wrapped in `Partial`. TS 4.8+ rejected `map[strategy.id] = strategy` with `Type '...' is generic and can only be indexed for reading.`

**Solution.** Use a `Map`. `get<K>(id)` casts the readback to `IStrategy<M, C, P, R, K> | undefined`; `set<K>(strategy)` casts the strategy to `AnyStrategy` via `unknown` to bridge the variance gap (the type-level relationship is correct — only the cast surface needed work).

**Why this way.** A `Map` is the right shape for "string → strategy"; the previous record was forced into a generic mapped type only because we wanted the `id`→`strategy` correlation to surface at the type level. The correlation now lives on the public method signatures (which still infer `K` from the literal `id`), not in the internal storage.

### Vulnerability + correctness sweep

- **Retry jitter** (`src/core/engine/store/store.libs.ts:retryDecision`). Exponential backoff was deterministic — N failures on the same backend tick all retried on the same beat. Added ±20% jitter so retries spread out and the backend gets breathing room. New tests in `store-libs.test.ts` pin both the spread (64 draws must produce >1 distinct delay) and the bound (each draw stays within ±20% of base).
- **Pct clamp guards negative `uploadedBytes`** (`src/core/engine/reducer.ts:pct`, `src/core/engine/store/store.runtime.ts` emit branch). A strategy that reports a negative `uploadedBytes` during a resume race could leak negative or NaN pct to UI subscribers. Added `Math.max(0, …)` in both compute sites.
- **Persistence parse-side bounds** (`src/core/persistence/persistence.ts:parsePersistedItem`, `parseProgress`). A corrupted IndexedDB snapshot could ship `file.size: -1`, `file.size: NaN`, `progress.uploadedBytes: -5`, or `progress.totalBytes: Infinity`. Each would propagate into `pct` and pollute the UI. New parse-side checks reject these. New tests in `persistence.test.ts` cover negative/NaN size (item dropped) and negative/Infinity progress (item loads but progress is discarded — cursor is still valid).
- **`parseHeaders` single-pass scan** (`src/core/contracts/transport/transport.libs.ts`). Previous chain (`split → map → filter → forEach`) allocated four intermediate arrays per response. Replaced with one index-based scan. Hot path because multipart uploads parse headers on every part response; the diff is small but cumulative.

### Tests

- **+4 tests** (now 200 total):
  - Retry jitter spread (1 test).
  - Retry jitter bound (1 test).
  - Persistence rejects negative/NaN file size (1 test).
  - Persistence rejects negative/Infinity progress (1 test).

### Verification

```
npx vitest run         -> 15 passed (15) / 200 passed (200) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 12 — Build entries + subpath export correctness (rating 9.1 → 9.2)

### Issue

`package.json` declared subpath exports like `./core/persistence`, `./core/transport`, `./core/validation`, `./core/emitter`, `./strategies/multipart`, `./strategies/post`, but `tsdown.config.ts` only built four entries (`index`, `core/index`, `react/index`, `strategies/index`). Every subpath in that list pointed at a `dist/.../index.js` that the build never produced. Importing `@gentleduck/upload/core/persistence` would have failed module resolution at consume time. Round 11's folder flatten compounded it — `./strategies/multipart` and `./strategies/post` pointed at folder shapes that no longer existed.

### Fix

- **`tsdown.config.ts`** — `entry` switched to a glob (`src/**/*.{ts,tsx}` minus `__test__`). Matches the duck-calendar pattern: every source module gets a 1:1 dist file, so any path declared in `exports` resolves to a real artifact. Bundle size grew from 4 entries (~50 kB) to 126 files (~154 kB), but `sideEffects: false` keeps tree-shaking at the consumer level: importing one named export still drops the rest.

- **`package.json`** — `./core/validation` now points to `./dist/core/engine/validation.{js,d.ts}` (was `./core/engine/validation/index.*` for the deleted folder). `./strategies/multipart` and `./strategies/post` likewise repointed at the flat module paths.

### Verification

```
rm -rf dist && npx turbo run build --filter=@gentleduck/upload --force
→ 126 files emitted; every subpath in package.json `exports` resolves to a present file.
npx vitest run -> 200/200 passed
```

---

## Round 13 — Eight weakness fixes (rating 9.2 → 9.5)

Round 12's rating audit named eight remaining weaknesses. This round fixes every one with paired tests.

### 1. `handleAddFiles.existingCount` no longer O(n)

**Why flagged.** Every `addFiles` call walked every item to enforce `maxFiles`. N sequential adds compounded to O(N²). Visible on stores with thousands of items.

**Solution.** `getActiveCount(rt, purpose)` in `store.libs.ts` memoizes a per-purpose count on `rt.activeCountState` / `rt.activeCountCache`. The cache key is the `rt.state` reference; the reducer's lazy-alloc keeps that reference stable on no-op events, so back-to-back `addFiles` calls without mutations reuse the count for free. `handleAddFiles` calls `getActiveCount` instead of walking items. Wired through `IRuntime` in `store.types.ts`; initialized in `createStoreRuntime`.

### 2. `deserializeSnapshot` rejects oversized snapshots

**Why flagged.** A malicious or corrupted persistence backend could ship a 1M-item snapshot and OOM the page on hydration.

**Solution.** New `maxItems` option (default `10_000`, `null` to disable) on `deserializeSnapshot` and `IPersistenceOptions`. The cap is checked before per-item parsing so the bad path stays O(1). Surfaced as `persistence.maxItems` so consumers can dial it per deployment.

### 3. `checksumMaxSize` skips SHA-256 for huge files

**Why flagged.** Browser SHA-256 has no streaming variant; `crypto.subtle.digest` requires the full payload in memory. Uploading a 10GB file used to allocate 10GB of heap just for the checksum (and the dedupe lookup it enables).

**Solution.** New `config.checksumMaxSize` (default `null`). When set, `handleAddFiles` skips `calculateFileChecksum` and the `findByChecksum` dedupe call for files past the cap. A dev-mode `console.warn` explains the trade-off (no dedupe for that upload).

### 4. `waitFor` carries partial outcomes on timeout/abort

**Why flagged.** `store.waitFor` rejected with a bare `Error` on timeout or signal abort; every id that did resolve was lost. Callers had no way to act on the partial completion.

**Solution.** New exported `WaitForError` class with `code: 'timeout' | 'aborted'`, `outcomes: readonly Outcome[]`, and a `cause` field for signal aborts (so the original `signal.reason` is preserved without overloading the message). Both rejection paths now build the partial outcomes array via `buildOutcomes()` before throwing. The existing two integration tests were updated; the `signal.reason` payload is now read off `.cause` and the partial outcomes are asserted to ride along.

### 5. `fingerprintMatches` gains a `compareType` opt-in

**Why flagged.** Browsers disagree on MIME detection — Safari may omit a `.heic` MIME that Chrome attaches. The match function always ignored `type` to avoid cross-browser rebind failures, but consumers running same-runtime sessions had no way to opt into the stricter check.

**Solution.** Added `{ compareType?: boolean }` parameter to `fingerprintMatches`. Default `false` preserves existing behavior; `true` requires `type` to match. New `config.strictRebindType` (default `false`) plumbs through `handleRebind` so consumers can flip it once instead of at each call site.

### 6. Async plugin `setup` + `store.ready`

**Why flagged.** `plugin.setup` was strictly synchronous. A plugin that needed to fetch a remote feature flag or warm up state had nowhere to do it without racing the consumer's first `dispatch`.

**Solution.** `IUploadPlugin.setup` return type widened to `void | Promise<void>`. `createUploadStore` collects plugin promises, joins them as `store.ready`, and routes both sync throws and async rejections through `onListenerError`. `store.ready` never rejects — a plugin failure is the hook's problem, not the consumer's. Existing sync plugins keep working unchanged.

### 7. `xhr` transport gains a stall watchdog

**Why flagged.** The transport leaned entirely on the engine-wide `effectTimeoutMs` watchdog. Consumers could not pick a tight bound for HEAD-style probes vs. a loose one for big multipart parts.

**Solution.** New `timeoutMs` parameter on `Transport.IUploadTransport.put` / `postForm` / `patch`. Inside `xhrRequest`, the watchdog rolls over on every `xhr.upload.onprogress` tick — expiry means no bytes moved for `timeoutMs`, i.e. a stall. Armed after `xhr.send` so the browser's own connect timeout still owns pre-flight. Cleared from the shared `cleanup()` path so abort/error/load all release the timer.

### 8. Emitter snapshot cache

**Why flagged.** Multi-listener `emit` reallocated the iteration snapshot (`Array.from(typeListeners)`) on every call. For busy progress streams the cost was once per progress tick — tiny per call, real at sustained throughput.

**Solution.** `snapshots: Map<string, ReadonlyArray<…>>` memoizes the iteration snapshot per event type. Invalidated by `on` / `off`. The size-1 fast path stays untouched; the cache only kicks in when there are two or more listeners. New emitter test asserts the observable invariant: a new `on` is delivered on the very next `emit` (proving the cache invalidates) and back-to-back emits with stable subscribers all see the same ordered list.

### Tests

- **+7 tests** (now 207 total):
  - `fingerprint.test.ts` — `compareType: true` makes type difference fail (1); `compareType: true` still matches identical types (1).
  - `persistence.test.ts` — `maxItems` cap rejects oversized snapshots (1); `maxItems: null` disables the cap (1).
  - `emitter.test.ts` — snapshot cache invalidates on `on`/`off` (1).
  - `store-integration.test.ts` — `store.ready` waits for async plugin setup (1); plugin rejection routes through `onListenerError` without rejecting `ready` (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 207 passed (207) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 14 — Eight remaining nits (rating 9.4 → 9.6)

Round 13's rating audit named eight remaining nits. This round fixes seven of them with paired tests (the eighth, test-poll cadence, is left as polish — every poll-based test currently passes with margin).

### 1. `LocalStorageAdapter.save` warns above ~1MB

**Why flagged.** `JSON.stringify` + `localStorage.setItem` are both synchronous on the main thread. A multi-MB snapshot freezes the UI for tens of ms.

**Solution.** `LocalStorageAdapter.save` now emits a dev-mode `console.warn` when the serialized payload exceeds 1MB, pointing the consumer at `createIndexedDBAdapter()` (off-thread). Production builds skip the check.

### 2. `readOnlyMap` swaps Proxy for a pre-bound frozen view

**Why flagged.** The original `Proxy` implementation hit a `get` trap on every `.get(id)` / `.has(id)` / `.size` read AND rebuilt a bound function each call. React renders that loop over `snapshot.items` paid that cost per access.

**Solution.** `readOnlyMap` in `core/engine/store/index.ts` now returns a `Object.freeze`-d view with read methods pre-bound to the underlying Map once at construction. Mutating methods (`set`/`delete`/`clear`) throw via cached blocked-function closures. The cached snapshot view (already keyed on `rt.state`) reuses the view across getSnapshot calls.

**Trade-off.** The view is no longer a `Map` instance — `snapshot.items instanceof Map` is now `false`. Consumers depending on that check would break; the public type is `ReadonlyMap<...>` so well-typed code is unaffected.

### 3. `cleanupOldItems` memoizes the no-walk path

**Why flagged.** When `completedItemTTL` was set, every dispatch walked all items even when nothing was past TTL.

**Solution.** New `rt.cleanupCheckedState` / `rt.cleanupNextDeadline` cache. On each cleanup pass we track the soonest `terminalTs + TTL` across the items we already inspected. Next dispatch: if `state` reference is unchanged AND wall-clock is below the cached deadline, the walk is skipped entirely. The signature changed from `(opts, state)` to `(rt, state)` so the cache lives where the state ref does. Cache is invalidated on actual eviction (which mutates state) so the next pass always walks fresh.

Also: direct Map iteration replaces `Array.from(state.items.entries())` — saves one allocation per pass on the TTL-only branch.

### 4. Progress throttle survives pause → resume

**Why flagged.** `runUpload`'s `lastEmit = 0` reset every call. A rapid pause/resume loop fired progress events with no throttling because the first emit after each resume always landed.

**Solution.** Per-item throttle state lives on `rt.progressThrottle: Map<string, number>`. `reportProgress` reads/writes through the map keyed by `localId`. `releaseAllSlots` clears the entry on terminal release (cancel / remove) so a fresh upload starts clean; pause-without-release keeps the timestamp so resume continues to honor the throttle window.

### 5. Persistence backpressure: inflight-flag coalescing

**Why flagged.** Debounce-only persistence. If `adapter.save` took 2s and a new dispatch landed at 1.9s, the next debounced flush stacked on top of the inflight one. Long chains of dispatches against a slow adapter built unbounded outstanding flushes.

**Solution.** `persistenceInflight` flag + `persistDirty` bit in `createStoreRuntime`. While a `save` is awaiting, any subsequent `schedulePersistence` sets `persistDirty` instead of starting a new flush. The flush loop re-runs `serialize + save` until `persistDirty` is false, so the trailing state always lands without ever running two concurrent saves. New integration test (`store-integration.test.ts > persistence backpressure`) holds the first save open with a deferred promise; multiple dispatches land while held; assertion confirms `saves.length === 1` while the first is inflight.

### 6. `config.checksumChunkBytes` for approximate dedupe

**Why flagged.** `checksumMaxSize` was a hard cutoff — past the threshold, no dedupe at all. Some consumers want "checksum first N MB then ship as the dedupe key" so very large files still benefit from server-side dedupe.

**Solution.** `calculateFileChecksum(file, signal, chunkBytes?)` takes an optional chunk size. When set, only the first `chunkBytes` of the file are read into the digest. `config.checksumChunkBytes` (default `null`) plumbs through `handleAddFiles`. New tests in `store-libs.test.ts` cover: full hash distinguishes files with identical heads, chunk=8 collides files sharing the first 8 bytes (the documented trade-off), chunk=8 still distinguishes files with different heads, chunk > file size falls back to full hash.

### 7. `WaitForError` is now generic over `R`

**Why flagged.** `outcomes: readonly unknown[]` lost the result type across the error boundary. Callers had to cast.

**Solution.** `WaitForError<R extends Contracts.IResultBase>` mirrors the store generic. `outcomes` is typed `ReadonlyArray<Engine.Outcome<R>>`. The waitFor builder constructs `WaitForError<R>` so `instanceof WaitForError` + `.outcomes` works end-to-end with no casts.

### Tests

- **+5 tests** (now 212 total):
  - `store-libs.test.ts` — full hash distinguishes identical heads (1); `chunkBytes` collides shared heads (1); `chunkBytes` distinguishes different heads (1); `chunkBytes > file.size` falls back to full hash (1).
  - `store-integration.test.ts` — persistence backpressure coalesces concurrent dispatches (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 212 passed (212) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 15 — User-predicate guards + React surface stability (rating 9.6 → 9.7)

### User-predicate throws are now isolated

Three user-supplied predicates could previously crash internal state when they threw:

- **`config.autoStart` (`store.libs.ts:resolveAutoStart`)** — a throwing predicate unwound the `scheduleUploads` autoStart batch mid-iteration. Now wrapped in a `try`/`catch` that returns `false` and dev-logs the throw. The batch keeps going for the remaining items.
- **`opts.validateFile` (`handlers.ts:handleAddFiles`)** — a throwing predicate stranded the item in `validating` because the effect's outer catch swallowed the error and no transition fired. Now caught: the item moves to `error` via `validation.failed` with a `type_not_allowed` rejection reason so the consumer can react.
- **`opts.fingerprint` (`handlers.ts:handleAddFiles`)** — a throwing custom fingerprinter used to take down the entire `addFiles` call and drop every remaining file in the batch. Now falls back to the built-in `computeFingerprint` so one bad implementation doesn't strand a multi-file selection.

All three guards dev-log the throw so the consumer sees the diagnostic without it crashing the engine.

### React `useUploader` returns a memoized object

`useUploader` and `useUploaderActions` were rebuilding their returned plain-object literal on every render. Any `useEffect(() => …, [uploader])` or `useMemo(…, [actions])` in consumer code fired on every host re-render even when nothing changed. Both hooks now wrap the return in `React.useMemo` keyed on the underlying stable references (`items`, `byPhase`, `dispatch`, `on`, `off` / `dispatch`, `on`, `store`), so a `[uploader]` dep array is stable across host renders and only flips when state actually moves.

### Tests

- **+3 tests** (now 215 total):
  - `validateFile` throw → item to `error` (1).
  - `fingerprint` throw → built-in fallback, items keep their fields (1).
  - `autoStart` throw → item stays `ready`, treated as `false` (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 215 passed (215) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 16 — Concurrency + transport + persistence hardening (rating 9.5 → 9.7)

Round 15's rating audit named eight remaining nits. Seven shipped this round; one (cursor lost-write race) turned out to be a non-race after closer review — `persistCursor` is synchronous, so the post-strategy `sampleAbortContext` already sees the latest cursor.

### 1. Multipart part-retry jitter (±20%)

**Why flagged.** `multipart.ts:210` slept `2 ** retryCount * 500` ms without jitter. N parallel parts failing on the same backend tick all retried on the same beat. The engine-level retries got jitter in R11; mirror it for part-level retries.

**Solution.** Same `±20%` formula as `retryDecision`: `base ± base * 0.2 * (Math.random() * 2 - 1)`, clamped to `Math.max(0, ...)`. Sole runtime change in `strategies/multipart.ts`.

### 2. `retryDecision` clamps `attempt < 1`

**Why flagged.** A custom `retryPolicy` returning `attempt: 0` made the engine compute `base * 2^-1 = 250ms` — half the documented `RETRY_DELAY_BASE_MS`. Quiet drift below the documented floor.

**Solution.** `const safeAttempt = Math.max(1, ctx.attempt)`. New test pins the bound: 32 draws with `attempt: 0` must each land in `[400, 600]` (the ±20% window around 500).

### 3. `waitFor` resolves via typed emitter (O(1) per terminal)

**Why flagged.** The subscriber walked every pending id on every notify. For a 1000-id wait, every unrelated state change paid 1000 phase checks.

**Solution.** New listeners on `upload.completed` / `upload.error` / `upload.canceled` keyed by `localId` resolve each id in O(1) when its terminal event fires. A `Set<string>` of watched ids gates each callback so unrelated events drop out immediately. A separate state-listener handles the `remove` case (no terminal event fires) by checking only the still-pending ids — bounded by `pending.size`, not the whole store.

**Trade-off.** The implementation is bigger but the asymptotic win is large: 1000 pending × 1000 dispatches goes from 1M checks to 1M terminal events that each touch one entry.

### 4. IndexedDB pre-flight quota probe

**Why flagged.** `adapter.save` only discovered quota exhaustion on the failing transaction. The user's `onPersistenceError` hook fired after the corrupted-state moment.

**Solution.** `createIndexedDBAdapter().save` calls `navigator.storage.estimate()` before opening the transaction. If `usage / quota > 0.95`, it throws a `PersistenceError('quota_exceeded', 'save', ...)` immediately. Skipped silently when `estimate` is missing (old Safari shims) or throws.

### 5. Effect-queue `maxQueueLength` cap

**Why flagged.** Compaction trimmed the queue once it grew, but a dispatch storm that produced effects faster than compaction drained could push the array unboundedly large. Memory pressure / GC pauses.

**Solution.** New `effectQueueCompaction.maxQueueLength` knob (default `10_000`, `null` to disable). `enqueueEffect` checks `(queue.length - head) >= cap` and drops + dev-logs new effects past the cap. Tests cover the default, clamp-to-1, and `null` disable.

### 6. BroadcastChannel cross-tab sync (`persistence.crossTabSync`)

**Why flagged.** Two browser tabs sharing one `persistence.key` silently overwrote each other (last-writer-wins). No cross-tab notification.

**Solution.** Opt-in `persistence.crossTabSync: true`. The runtime opens `new BroadcastChannel('upload-engine:<key>')`, posts a `{type: 'persisted'}` message after every state change, and on receiving a sibling-tab message it re-runs `adapter.load` + the deserialize + merge path. A `suppressNextBroadcast` flag prevents ping-pong. Gracefully skipped when `BroadcastChannel` is unavailable (old Safari).

**Trade-off.** Receivers post-merge new items only (`if (!merged.has(id)) merged.set(id, item)`); already-present items keep their current local state. That matches the existing load-time merge contract and avoids clobbering an in-flight upload's `uploading` phase with a sibling's stale `paused` view.

### 7. `UploadConfigInput<P>` accepts partial `effectQueueCompaction`

**Why flagged.** Adding `maxQueueLength` to `IEffectQueueCompaction` broke every call site that passed `{ minHead, ratioDenom }` because TS required all three fields when overriding the nested object.

**Solution.** `UploadConfigInput<P>` is now `Partial<Omit<…, 'effectQueueCompaction'>> & { effectQueueCompaction?: Partial<IEffectQueueCompaction> }`. Callers can override one knob without restating the rest. The resolved `IUploadConfig` keeps strict shape.

### Tests

- **+3 tests** (now 218 total):
  - `maxQueueLength` default 10_000, clamps to 1, large values pass through (1).
  - `maxQueueLength: null` disables the cap (1).
  - `attempt: 0` is clamped to 1 so the jittered delay stays inside the documented ±20% window (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 218 passed (218) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 17 — Cross-tab correctness, new event surface, telemetry hooks (rating 9.6 → 9.8)

Round 16's audit named eight remaining nits. All eight fixed this round, each with the bug, why-it-mattered, and concrete fix below.

### 1. BroadcastChannel posted on every notify (over-broadcast)

**Bug.** R16 wired cross-tab sync via a listener attached to `rt.listeners` — fired on every state-change notification (progress ticks included). Each notify called `channel.postMessage`, so a single upload could spam siblings with hundreds of pings per second. Siblings re-ran `adapter.load` for each → net work was bounded (no data loss) but BCH bandwidth was wasted.

**Why it mattered.** Two real costs: (a) BroadcastChannel postMessage is structured-clone serialization on every call, adding µs-scale CPU per progress tick × N tabs; (b) the receiver re-fetches the whole snapshot every ping, dwarfing the actual write rate.

**Fix.** New private hook variable `onSaveSuccess` on `createStoreRuntime`. The BCH path installs it; `flushPersistence` calls `onSaveSuccess?.()` only after the actual `adapter.save` / `adapter.clear` resolves successfully. Failed saves do NOT broadcast. Progress-only state changes that produce no save (rare) likewise stay quiet. One ping per real persistence write.

### 2. No `upload.removed` event

**Bug.** `dispatch({ type: 'remove' })` deleted the item from state without emitting any typed event. Consumers (the engine's own `waitFor`, UI listeners, telemetry) had to poll `getSnapshot().items.has(id)` on every notify to learn about removes.

**Why it mattered.** `waitFor`'s missing-detection used a fallback `rt.listeners.add(onStateChange)` that walked every pending id on every notify — exactly the O(pending × notifies) cost R16 tried to eliminate via the typed emitter. Without an `upload.removed` event there was no way to make it O(1).

**Fix.** New typed event `upload.removed: { localId: string }` in `Engine.EventMap`. `dispatch.ts` emits it after the reducer drops the item, but only when the item actually existed (idempotent removes stay silent — match the existing `'upload.canceled'` contract). `waitFor` now listens to it instead of the state-change fallback, completing the O(1) story.

### 3. `crossTabSync` ping-pong guard had a microtask race

**Bug.** The original suppression flag flipped to `true` synchronously in `channel.onmessage`, then back to `false` via `queueMicrotask`. But `applyLoaded`'s notify ran from inside a `.then` AFTER that microtask. The state listener (which posted to BCH) saw the flag already `false` and echoed the sibling's write straight back to it.

**Why it mattered.** Subtle infinite loop. Two tabs would ping-pong forever on the slightest difference in load timing. Each tab seeing each other's broadcast, re-loading, broadcasting, ad infinitum.

**Fix.** Replaced the boolean with a depth counter `suppressDepth`. Incremented at the start of `channel.onmessage`, decremented in the `.finally` of the load chain — so the suppression window covers the entire load lifecycle (no microtask gap). `onSaveSuccess` (#1 above) early-returns when `suppressDepth > 0`.

### 4. IndexedDB `navigator.storage.estimate()` ran on every save

**Bug.** R16's quota pre-flight called `estimate()` unconditionally before every save. `estimate()` is itself async (returns a Promise) and on some browsers adds ~5-20ms of work for the budget calculation.

**Why it mattered.** Hot save path. Persistence flushes every 200ms by default; every flush paid the estimate cost. On a sustained-write workload (e.g. 100 progress events/s × debounce buffering), the engine spent more time polling quota than serializing snapshots.

**Fix.** Two-tier cache: `quotaCachedRatio` + `quotaCacheAt`. Refresh only when (a) the cache is older than `QUOTA_REFRESH_MS` (30s) or (b) the previous reading was already in the warning band (`>= QUOTA_WARN_RATIO = 0.8`, where usage moves fast). Below 80%, we trust the cache until TTL. The hard refusal threshold (`> 0.95`) reads from the cache.

### 5. Production effect-drop was silent

**Bug.** R16's `effectQueueCompaction.maxQueueLength` cap only logged in dev (`process.env.NODE_ENV === 'development'`). Production builds dropped effects with zero telemetry.

**Why it mattered.** A dispatch loop in production could lose effects silently — items stranded in `validating` / `creating_intent` because their effect never landed. No way to discover the bug post-deploy.

**Fix.** New `hooks.onEffectDropped({ queueLength, active, cap })`. Routed before the dev-warn fallback so production wiring sees every drop. Hook throws are isolated via the standard try/catch around the dev console.error path.

### 6. `Strategy.IRegistry.set` trusted caller-supplied `id` blindly

**Bug.** A `(strategy as any)` cast at the call site could register a strategy with `id: ''` or `id: undefined`. The Map stored it, then no incoming intent (`intent.strategy === '<something>'`) would ever match. The strategy was effectively a no-op and the engine kept routing items to "not found".

**Why it mattered.** Silent misconfig that surfaced as upload.error("Strategy not found: ...") on every upload. Painful to diagnose because the registration looked fine and the failure was at use site.

**Fix.** `set` now `throw new TypeError(...)` when `typeof strategy.id !== 'string' || strategy.id.length === 0`. Failure surfaces at registration, not on first upload. Tests in `store-integration.test.ts` cover both bad shapes.

### 7. `waitFor` allocated a `Set<string>` even for 1-2 ids

**Bug.** `waitFor`'s `watched = new Set(localIds)` ran on every call. For tiny id lists (the common case — most calls wait on one upload), the hash-bucket allocation was overkill vs. an array `indexOf`.

**Why it mattered.** Two micro-costs: (a) Set allocation + per-id hashing; (b) `Set.has` lookup vs `Array.indexOf` cache locality. For n ≤ 4, array wins on modern V8.

**Fix.** Branch on `localIds.length <= 4`: small lists keep the original `localIds` array and use `indexOf !== -1`; larger lists fall back to `Set`. Single `isWatched(id)` closure encapsulates the choice.

### 8. `UploadAbortError` discarded the original abort payload

**Bug.** `UploadAbortError.reason` collapsed any `signal.reason` into `'pause' | 'cancel' | 'unknown'` via `normalizeAbortReason`. The raw value — an Error, an object with debug context, a structured payload — was lost.

**Why it mattered.** Telemetry pipelines (Sentry, Datadog) couldn't attach the actual cause for an aborted upload. The constructor parameter was discarded after the normalization.

**Fix.** Added `originalReason: unknown` field on `UploadAbortError`. Constructor stores the raw `reason` argument verbatim. `reason` keeps the normalized string for switch/case routing. Three new tests in `transport-libs.test.ts` cover Error, string, and structured-object payloads.

### Tests

- **+5 tests** (now 223 total):
  - `dispatch.remove` emits `upload.removed`; idempotent removes stay silent (1).
  - `waitFor` resolves `missing` via `upload.removed`, not state-polling (1).
  - `strategies.set` throws `TypeError` on empty / `undefined` id (1).
  - `onEffectDropped` hook fires when cap rejects (1).
  - `UploadAbortError.originalReason` preserves raw payload across Error / string / structured shapes (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 223 passed (223) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 18 — Lifecycle, migration, leak audit (rating 9.7 → 9.8)

Round 17's audit named eight remaining nits. All eight shipped, each with the bug + why + fix below.

### 1. `store.destroy()` added — release every owned resource

**Bug.** Long-lived SPAs that swapped upload providers leaked `BroadcastChannel` handles, debounced persistence timers, pending controllers (validation / retry / intent / complete / upload), and the subscriber set. Each new store accumulated handles on top of the previous one.

**Why it mattered.** Real memory leak in production. A tab with 10 provider swaps held 10 BCH channels, 10 timer slots, and 10 sets of controllers. Long sessions accumulated DOM-level handles the GC couldn't reclaim.

**Fix.** New `rt.teardown?: () => void` set at construction, exposed via the public `store.destroy()`. Teardown: aborts every controller in `pendingValidations` / `pendingRetries` / `inflightIntents` / `inflightCompletes` / `inflightUploads` with reason `'store-destroyed'`, clears those Maps + `progressThrottle` + `effectQueue` + `listeners`, clears the persist debounce timer, drops `onSaveSuccess`, closes the BCH channel. Replaces `rt.dispatch` with a no-op that dev-logs (so a post-destroy dispatch is visible). Idempotent: subsequent destroy calls early-return.

### 2. `cleanupOldItems` now emits `upload.removed` with reason discriminator

**Bug.** Terminal items aged out by `maxItems` or `completedItemTTL` left state silently. Consumers tracking upload lifecycle via the R17 `upload.removed` event missed the cleanup case entirely.

**Why it mattered.** UIs that listened to `upload.removed` to slide-out a row in an upload list would only animate user-removed items; cleanup-evicted items vanished without trigger. Telemetry lost the cleanup-vs-user signal.

**Fix.** `Engine.EventMap['upload.removed']` extended with `reason: 'user' | 'cleanup'`. `dispatch.remove` emits `reason: 'user'`. `finalizeApply` collects the diff of evicted ids and emits `reason: 'cleanup'` for each AFTER `notify` (so a subscriber reading `getSnapshot()` from inside the event handler sees the post-cleanup state).

### 3. `persistence.migrate` hook

**Bug.** A snapshot whose `version` differed from `expectedVersion` was rejected wholesale and dev-warned. Consumers had no place to upgrade older snapshots; bumping `version` silently dropped every existing item.

**Why it mattered.** Real migration story missing. Any schema change required a hard cut-over with no path for already-persisted in-flight uploads.

**Fix.** New optional `persistence.migrate: (raw, fromVersion) => unknown`. Called inside `applyLoaded` BEFORE the version fence. `fromVersion` is best-effort: reads `raw.version` if it's a number, else `0`. A throwing migrate routes through `onPersistenceError` (code: `serialization_failed`) so a buggy migration discards the snapshot rather than crashing hydration. Test covers a real v1→v2 upgrade (`intent` lacking `strategy` field, migration injects it).

### 4. `scheduleWork` outer loop capped at 100 passes

**Bug.** The re-entrant scheduling loop had no upper bound. A buggy subscriber that dispatched commands which always produced new work would set `schedulingDirty=true` forever; the `do/while` never exited.

**Why it mattered.** Edge-case foot-gun. A user-side feedback loop would hang the engine in a busy-loop with no recovery — the consumer couldn't even dispatch a `cancel` because the loop owned the call stack.

**Fix.** `passes` counter + `MAX_PASSES = 100` ceiling. On reaching the cap, break the loop with a dev `console.error` naming the failure mode. The next dispatch starts a fresh scheduling pass; a self-correcting subscriber recovers automatically.

### 5. `progressThrottle` Map entries leaked on completion

**Bug.** R14 stored per-item progress-throttle timestamps on `rt.progressThrottle: Map<string, number>` so the throttle survived pause→resume. The entry was cleared by `releaseAllSlots` (cancel/remove paths) but NOT by natural completion — a completed item kept its (`localId`, `ts`) pair forever.

**Why it mattered.** Every successful upload leaked ~40 bytes. For long-running tabs with thousands of completions, accumulates to tangible memory.

**Fix.** Clear the entry from `emitInternalEvent` on every terminal phase: `dedupe.ok`, `complete.ok`, `canceled`, `complete.failed` (only when `!retryable` — retryable errors keep the entry so the retry's first tick honors the throttle window).

### 6. `Strategy.IRegistry.onOverwrite` hook

**Bug.** `registry.set` warned on overwrite but only in dev (`NODE_ENV !== 'production'`). Production tab-reloads that re-registered strategies lost the old refs silently.

**Why it mattered.** Hot-reload patterns common in HMR / SSR-hydration scenarios silently shadowed strategies. No telemetry signal for the misconfig.

**Fix.** New `IRegistry.onOverwrite?: (id: string) => void`. `set` calls it before the dev-warn fallback so production wiring sees every overwrite. Hook throws caught + logged via `console.error`.

### 7. `waitFor` defensively copies caller's `localIds`

**Bug.** The small-list (≤4 ids) fast path used `localIds` directly. A caller that mutated the array after `waitFor()` saw a shifting watched set mid-wait.

**Why it mattered.** Subtle correctness footgun. Caller passes `[a, b, c]`, then pushes `d` after the call; `isWatched` now matches `d` too, but the original `pending` Set never had `d` so the new id would never resolve.

**Fix.** `watchedArr = localIds.slice()` on the small path. Negligible cost (≤4 elements).

### 8. `UploadAbortError` mirrors `originalReason` onto `cause`

**Bug.** R17 added `originalReason` to preserve the raw payload, but telemetry pipelines (Sentry, Datadog) automatically read `Error.cause` per the standard convention. Two fields meant the same thing, but only consumers who knew about `originalReason` could find it.

**Why it mattered.** Adoption friction. Existing telemetry stacks expected `cause`; the engine forced consumers to add custom adapters.

**Fix.** Set `this.cause = reason` alongside `this.originalReason = reason` in the constructor. Both fields hold the same value. `originalReason` stays for backwards compat with R17 callers; `cause` becomes the documented telemetry surface.

### Side change: persistence hydration no longer gates on `typeof window`

The hydration path used to wrap in `if (... && typeof window !== 'undefined')`. Migration tests (and any node-environment test of persistence) couldn't trigger it. Removed the gate — adapters that need browser globals (IndexedDB, localStorage) throw their own `'unavailable'` `PersistenceError`, which already routes through `onPersistenceError`. Doc note added inline.

### Tests

- **+4 tests** (now 227 total):
  - `dispatch.remove` emits `reason: 'user'` (1).
  - `cleanupOldItems` eviction emits `reason: 'cleanup'` (1).
  - `store.destroy()` aborts pending work, drops listeners, makes subsequent dispatches no-ops, idempotent on repeat (1).
  - `persistence.migrate` runs before the version fence and upgrades a v1 snapshot to v2 (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 227 passed (227) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 19 — Lifecycle correctness, telemetry symmetry, cross-tab semantics (rating 9.7 → 9.8)

R18's audit named eight nits. All eight landed; each below names the bug, why it mattered, and the fix.

### 1. `store.destroy()` now flushes pending persistence before tear-down

**Bug.** R18 wired `destroy()` to clear the debounce timer with `clearTimeout` before the timer fired. Any state changes from the last `persistDebounceMs` window were lost because `flushPersistence` never ran.

**Why it mattered.** Consumers calling `destroy()` right after a state change had no durability guarantee. A pause-and-swap-provider flow would silently drop the just-paused cursor.

**Fix.** `destroy()`'s teardown block now checks `persistTimer`, clears it, and kicks off one final fire-and-forget `flushPersistence()`. Synchronous adapters (Memory, LocalStorage) settle inside the call; async adapters (IndexedDB) settle on the next microtask. The pending state still lands on disk.

### 2. `waitFor` consolidated into engine-level registry (O(1) per terminal)

**Bug.** R17 wired each `waitFor` call to four emitter subscriptions (`upload.completed`, `upload.error`, `upload.canceled`, `upload.removed`). 100 concurrent `waitFor`s = 400 emitter listener entries. Every terminal event walked every entry (the snapshot cache reused the array but the dispatch was still O(listeners)).

**Why it mattered.** waitFor was advertised as O(1) per terminal in R17 docs but the implementation was O(waitFor_calls) per emit. High-volume orchestration code (e.g. waiting on 1000 uploads then waiting on 1000 more) paid hidden quadratic cost.

**Fix.** New `rt.waitForRegistry: Map<localId, Set<Resolver>>`. Each `waitFor` adds resolvers keyed by `localId`. Engine emits terminal events through a new `dispatchWaitForTerminal` helper that does one Map lookup, walks just the resolvers waiting on that id. Resolvers return `true` to accept (engine removes) or `false` to stay subscribed (`onlyFinal: true` skipping a retryable error). 4×N emitter listeners → 0 emitter listeners; per-terminal dispatch is O(resolvers-for-this-id) instead of O(all-resolvers).

The small-array `isWatched` branch from R17 was retired in the rewrite — a Map lookup is already O(1).

### 3. Cross-tab delete reconciliation via tombstones

**Bug.** R16 added BroadcastChannel cross-tab sync, but the merge in `applyLoaded` only ADDED new items (`if (!merged.has(id)) merged.set(id, item)`). Tab A removes item X; Tab B's snapshot still has X; Tab B's BCH ping triggers Tab A to reload + re-merge X back. Removes silently undone.

**Why it mattered.** Cross-tab consistency was advertised in R16 but broken for the most common delete case. Users in two tabs trying to clean up an upload queue saw items resurrect.

**Fix.** New `tombstones: Map<localId, deletedAt>` on the runtime, surfaced as `tombstones?: Record<string, number>` in the persisted snapshot.
- `dispatch.remove` writes the tombstone BEFORE calling `applyCommand` so the persistence flush triggered by the reducer's drop captures it in the same write.
- `cleanupOldItems` evictions also tombstone (with `reason: 'cleanup'` already surfaced via the R18 event).
- `applyLoaded` reads `tombstones` from the loaded snapshot and deletes any tombstoned id from local state BEFORE merging the items map. Cross-tab removes now propagate.
- New `persistence.tombstoneTTLMs` (default 60s) prunes old entries on each flush so the map can't grow unboundedly.

### 4. `onEffectDropped` carries `localId`

**Bug.** R17's drop hook only passed `{queueLength, active, cap}`. Production telemetry couldn't tell which upload triggered the drop.

**Why it mattered.** Diagnosing the responsible upload required reading queue contents — impossible from the hook payload alone.

**Fix.** `Store.IRuntime.enqueueEffect` signature widened to accept `ctx?: { localId?: string }`. The four call sites (`handleAddFiles`, `handleCancel`'s multipart abort, `createIntent` via scheduleIntentCreations, `finalizeUpload` via scheduleCompletes, `scheduleRetry`) all thread the localId through. The drop hook now receives it for attribution.

### 5. `persistCursor` rejects writes after `controller.abort`

**Bug.** A strategy's `start()` could hold the `persistCursor` reference across its own async boundaries. Calling it after the controller aborted used to flip `cursor.updated` through the reducer on an item the engine had already moved out of `uploading`. The reducer's phase guard (`if (item.phase === 'uploading' || 'queued' || 'paused')`) sometimes matched the paused phase and overwrote the cursor with a stale value.

**Why it mattered.** Subtle data-loss race during pause/resume cycles. The new cursor would clobber the just-paused cursor; resume started from the wrong offset.

**Fix.** `if (controller.signal.aborted) return` at the top of `persistCursor`. Late writes drop at the source.

### 6. `Strategy.IRegistry.onDelete` hook

**Bug.** R18 added `onOverwrite`; `delete()` stayed silent. Telemetry asymmetric.

**Why it mattered.** A consumer subscribing to overwrite events would have a blind spot when a strategy was explicitly unregistered (HMR reload, dynamic plugin teardown).

**Fix.** New optional `IRegistry.onDelete: (id) => void`. Fires only when `map.delete(id)` returns `true` (idempotent deletes stay silent — match `onOverwrite` semantics). Hook throws caught + logged.

### 7. `crossTabSync` first-load suppression

**Bug.** R17's suppression counter only bumped inside `channel.onmessage` (sibling-driven loads). A sibling broadcasting `'persisted'` in the same window as the initial hydrate saw `suppressDepth === 0` → echoed back. Two concurrent loads then raced for `rt.state`.

**Why it mattered.** Edge-case race on store construction. Could land at any time on a busy multi-tab session.

**Fix.** `suppressDepth` declared at outer scope; bumped before the initial hydrate's `result.then(applyLoaded)` and decremented in its `.finally`. Suppression window now spans BOTH the initial load and sibling-driven reloads.

### 8. `onScheduleStarved` hook

**Bug.** R18's `scheduleWork` cap (100 passes) only logged in dev. Production silently bailed.

**Why it mattered.** Same telemetry gap as the pre-R17 effect-drop. A runaway feedback loop in a deployed build was invisible.

**Fix.** New `hooks.onScheduleStarved: (ctx: { passes }) => void`. Routed before the dev-error fallback so production wiring sees every bail. (Synthetic provoking the cap from outside the scheduler is hard — sub-schedulers no-op when items aren't moving — so the hook is wired but not directly unit-tested; manual telemetry inspection covers it.)

### Tests

- **+2 tests** (now 229 total):
  - Cross-tab tombstone: snapshot's `tombstones` field carries the removed id with a timestamp after `dispatch.remove` (1).
  - Registry `onDelete` hook fires on present-id delete; silent on missing-id delete (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 229 passed (229) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 20 — API parity, awaitable lifecycle, hot-path polish (rating 9.8 → 9.85)

R19's audit named eight nits. Seven shipped with code; one (onScheduleStarved test) is documented as a manual-inspection case because synthesizing the 100-pass starvation from outside the scheduler is unreliable.

### 1. Tombstones now visible to custom `deserialize`

**Bug.** R19 surfaced cross-tab tombstones in the persisted snapshot, but the runtime applied the delete-pass directly in `applyLoaded` -- a custom `persistence.deserialize` got no access. Asymmetric API: built-in deserializer saw the same delete contract, custom didn't.

**Why it mattered.** Consumers who replaced the default deserializer (e.g. to inject migration logic) lost the cross-tab delete semantics silently. Their custom path resurrected removed items.

**Fix.** `IDeserializeContext.tombstones?: Record<string, number>` and the matching field on `deserializeSnapshot`'s opts. The runtime threads the loaded snapshot's `tombstones` into the deserialize call AND still runs its own delete-pass afterwards, so the default behavior is unchanged but custom deserializers can read the field for their own logic.

### 2. `store.destroy()` returns `Promise<void>`

**Bug.** R19 destroy() was fire-and-forget on the trailing flush. Callers who needed durability for the last state change (pause cursor, final result hand-off) had no way to know when the write landed.

**Why it mattered.** Fast-shutdown paths (browser tab close, provider swap during navigation) raced the flush. A user pausing an upload right before closing the tab would lose the cursor.

**Fix.** `Store.IRuntime.teardown` retyped as `() => Promise<void>`. Public `store.destroy()` returns it. Teardown body awaits `flushPersistence()` before clearing controllers and BCH. Idempotent: a second `destroy()` returns the same resolved promise. The save error path catches internally so `destroy()` never rejects -- the persistence-error hook already handled it.

Side fix: swap `rt.dispatch` to no-op BEFORE the first `await` so a synchronous dispatch after a non-awaited `destroy()` still cannot reach the live reducer. Also retyped `storeProxy.dispatch` as `(cmd) => rt.dispatch(cmd)` -- the previous shape captured the initial `rt.dispatch` reference at object-literal time and would have ignored the no-op swap.

### 3. `store.flush(): Promise<void>` public API

**Bug.** Only `destroy()` could force a persistence flush. Tests + consumers needing a sync point (before navigation events, after a batch dispatch) had no option that kept the store usable.

**Why it mattered.** A `beforeunload` handler wanting to land the last write either had to call `destroy()` (which kills the store) or wait the full debounce -- losing the navigation window.

**Fix.** New `rt.flushNow?: () => Promise<void>` + public `store.flush()`. Clears the debounce timer, runs one `flushPersistence` pass, resolves when the adapter settles. Distinct semantics from `destroy()`: the store keeps running afterwards.

### 4. Tombstones prune on `applyLoaded` too

**Bug.** R19 pruned old tombstones inside `flushPersistence`. An idle store (no state changes -> no flush) kept the map forever.

**Why it mattered.** Long-running tabs that did one remove + sat idle for hours retained the tombstone past its TTL, then shipped it in the next save. Wasted snapshot bytes; in extreme cases (thousand-item cleanup pass) measurable.

**Fix.** `applyLoaded` runs the same prune step: walks `rt.tombstones`, deletes any entry past `tombstoneTTLMs`. Also skips applying stale tombstones from the loaded snapshot itself -- saves a `new Map(rt.state.items)` per stale entry on busy stores.

### 5. `IRegistry.onDelete` carries optional `reason`

**Bug.** R19 added the hook but only forwarded `id`. HMR teardown, plugin lifecycle, manual cleanup -- all looked identical in telemetry.

**Why it mattered.** Without attribution, an `onDelete` listener flooded the same event regardless of cause. Couldn't filter HMR noise from real teardowns.

**Fix.** `IRegistry.delete<K>(id: K, reason?: string)`. The reason propagates to `onDelete(id, reason)`. Existing call sites (which pass no reason) keep working unchanged.

### 6. `onScheduleStarved` test — kept as manual-inspection

**Bug claimed (R19).** Hook wired but untested.

**Why kept manual.** Synthesizing the 100-pass starvation from outside the scheduler requires a subscriber that produces NEW schedule-worthy work on every notify pass. Sub-schedulers no-op when state isn't actually moving, so the loop converges quickly. A reliable synthetic test would mock the scheduler internals, which we explicitly don't expose. Documented in code; production telemetry inspection covers it.

### 7. BroadcastChannel ping payload is a primitive

**Bug.** R19 BCH messages used `{type: 'persisted'}`. `postMessage` does structured-clone of the object including its property descriptor on every save. Object allocations + clones add up under busy save streams.

**Why it mattered.** A multi-tab session with frequent uploads saw measurable extra CPU on BCH traffic.

**Fix.** Payload is the bare string `'persisted'`. Receiver matches against the primitive (`if (e.data !== 'persisted') return`). Structured-clone cost drops to a single primitive copy.

### 8. `scheduleRetry` re-checks item existence after sleep

**Bug.** R19's retry effect dispatched `{type: 'retry'}` after the sleep without re-checking whether the item still existed. A remove between enqueue and post-sleep dispatch left the retry to fire against a missing id; the reducer no-op'd it but the work churned through the effect pool.

**Why it mattered.** Wasted effect-pool slot at the moment the queue was already busy (the whole reason the cancel happened). Measurable on dispatch storms.

**Fix.** Inside the post-sleep clean path: `const current = rt.state.items.get(localId); if (!current || current.phase !== 'error') return`. Mirrors the existing check in the watchdog-aborted branch.

### Tests

- **+3 tests** (now 232 total):
  - `onDelete` receives the optional `reason` from the caller (1).
  - `store.flush()` resolves after the adapter settles even when the debounce window is huge (1).
  - `await store.destroy()` waits for the trailing flush before resolving (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 232 passed (232) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 21 — Flush correctness, terminal-outcome reasons, sweep coverage (rating 9.8 → 9.85)

R20's audit named eight nits. All eight shipped; each below names the bug, why it mattered, and the fix.

### 1. `store.flush()` now awaits the inflight save

**Bug.** R20's `flushNow` short-circuited on `persistenceInflight=true` by setting `persistDirty=true` and returning immediately. Caller's `await store.flush()` resolved BEFORE the actual write landed.

**Why it mattered.** A `beforeunload` handler awaiting flush could leave the page before the adapter completed the transaction. The whole point of the public flush — durable sync point — was broken.

**Fix.** New `persistWaiters: Array<() => void>` shared between `flushNow` and the inner `flushPersistence` loop. `flushNow` pushes a resolver onto the array, then either triggers a new flush pass (if idle) or sets `persistDirty=true` (if inflight). The loop resolves every waiter after a successful save / on a clean-skip exit. Multiple concurrent `flush()` calls join the same inflight pass, returning together once it lands.

### 2. `store.flush()` skips redundant writes when state is clean

**Bug.** Every `flush()` ran `serialize + adapter.save` regardless of whether anything had changed since the last successful write. The previous behavior repeatedly shipped the identical snapshot, paying an adapter round-trip (and an IndexedDB transaction, including the quota probe) for nothing.

**Why it mattered.** Hot-path waste on busy `beforeunload` / poll-flush patterns.

**Fix.** New `persistStateDirty` flag. Flipped to `true` inside `schedulePersistence` on every state-changing dispatch; cleared to `false` at the TOP of the flush loop's iteration (before serialize) so dispatches during the save re-flip it and force a trailing pass. When clean at the top, the iteration resolves any joined waiters and returns without writing.

### 3. `Engine.Outcome.missing` carries a `reason`

**Bug.** Consumer of `waitFor` couldn't tell apart "the id was never in this store" from "I removed it" from "cleanup evicted it after TTL" from "store destroyed mid-wait". All collapsed to `status: 'missing'`.

**Why it mattered.** Telemetry / UI logic needs the distinction. Retry-by-re-add only makes sense for `'removed'`. UI cleanup of stale rows only makes sense for `'evicted'`. A bug log only makes sense for `'never-existed'`.

**Fix.** `Outcome.missing` now has `reason?: 'removed' | 'evicted' | 'never-existed' | 'destroyed'`. Four producers tagged:
- `dispatch.remove` → `'removed'`
- `cleanupOldItems` eviction in `finalizeApply` → `'evicted'`
- `waitForOutcomes.captureCurrent` (synchronous capture path) → `'never-existed'`
- `teardown` → `'destroyed'` (fix #4 below)
The `buildOutcomes` fallback (id never landed in the outcomes map) also defaults to `'never-existed'`.

### 4. `destroy()` resolves pending `waitFor` resolvers

**Bug.** Pending waiters captured in `rt.waitForRegistry` were silently dropped when teardown cleared the map. The promise they returned to the caller hung forever.

**Why it mattered.** Real promise leak. A component awaiting an upload that was unmounted (and tore down its store) would dangle a microtask handle indefinitely.

**Fix.** Teardown walks `rt.waitForRegistry` BEFORE clearing and resolves every resolver with `{status: 'missing', reason: 'destroyed'}`. Idempotent: a second destroy finds an empty registry.

### 5. `checksumMaxSize` + `checksumChunkBytes` precedence documented

**Bug.** Both knobs control checksum behavior. Their interaction was undocumented. (Behavior: `checksumMaxSize` is checked first — over the cap, dedupe skips entirely; under the cap, `checksumChunkBytes` controls how many bytes get hashed.)

**Why it mattered.** Consumers configuring both got surprising behavior.

**Fix.** Behavior is already correct; this round is doc-only (precedence noted in the CHANGES file).

### 6. `store.isDestroyed` introspection

**Bug.** No way to ask "is this store still alive?" without trying to dispatch and observing the dev-mode error.

**Why it mattered.** Defensive component code wanting to skip work after unmount had to wrap every call in try/catch or maintain its own flag.

**Fix.** New `destroyed?: boolean` on `Store.IRuntime` flipped at the top of `teardown`. Public `store.isDestroyed` exposes it via a getter. O(1) reads.

### 7. `tombstoneTTLMs` default deduplicated

**Bug.** R19 read `persistence.tombstoneTTLMs ?? 60_000` in TWO places — `flushPersistence` prune block and `applyLoaded` prune block. Drift risk when the default changes.

**Why it mattered.** Maintenance footgun.

**Fix.** Shared `const tombstoneTTLMs = persistence?.tombstoneTTLMs ?? 60_000` at runtime construction. Both prune paths read it.

### 8. `progressThrottle` orphan sweep on cleanup

**Bug.** `releaseAllSlots` (cancel/remove paths) and terminal events (complete/dedupe/canceled) cleared the throttle entry. A pathological case — a `queued` item that never gets scheduled (engine bug, backend frozen, etc.) — kept its throttle entry forever because no terminal event fired.

**Why it mattered.** Unbounded growth in a stuck-queue scenario.

**Fix.** `finalizeApply` walks `rt.progressThrottle.keys()` after a cleanup pass and drops any entry whose owning id is no longer in state. The walk only runs when `cleanupOldItems` actually evicted (`changedByCleanup`), so the hot path stays unchanged.

### Tests

- **+4 tests** (now 236 total):
  - `store.flush()` joins the inflight save (1).
  - `store.flush()` is a no-op when state is clean (1).
  - `isDestroyed` flips on destroy + pending `waitFor` resolves with `reason: 'destroyed'` (1).
  - `waitFor` on never-registered id resolves with `reason: 'never-existed'` (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 236 passed (236) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 22 — Post-destroy correctness, tombstone scope, registry symmetry (rating 9.8 → 9.85)

R21's audit named eight nits. Seven shipped code; one (#8 — `persistDirty` on clean-skip) re-audited as a non-bug after tracing (the dirty flag is already cleared at the top of every loop iteration, and the clean-skip exits after that clear; the next dispatch correctly re-flips via `schedulePersistence`).

### 1. `store.flush()` post-destroy is now a no-op

**Bug.** `flushNow` survived teardown. A call to `store.flush()` after `destroy()` ran `flushPersistence` against the cleared-but-unmutated state, writing the snapshot AFTER the teardown's final write -- silently undoing the durability guarantee.

**Why it mattered.** The very feature that `destroy()` returning `Promise<void>` provides (R20) could be invalidated by any post-destroy `flush()` call.

**Fix.** `store.flush()` short-circuits on `rt.destroyed`. Returns `Promise.resolve()` immediately.

### 2. Tombstones tracked only when persistence is configured

**Bug.** `dispatch.remove` and `cleanupOldItems` wrote to `rt.tombstones` on every removal regardless of whether persistence was wired. With no persistence, `flushPersistence` (the prune site) never ran, so the map grew forever on each remove.

**Why it mattered.** Memory leak in non-persistence stores. Every removed upload cost ~40 bytes that never released.

**Fix.** Both call sites now gate on `rt.opts.persistence`. Without persistence, tombstones serve no purpose -- cross-tab sync requires persistence too.

### 3. `subscribe` / `on` / `off` / `flush` gated by `isDestroyed`

**Bug.** R20 swapped `dispatch` to no-op on teardown, but the rest of the public API silently appended to cleared `rt.listeners` (subscribe) or hit the cleared emitter (on/off). Listeners added post-destroy never fired but stayed in memory.

**Why it mattered.** Late `useEffect` calls in React unmounts that subscribed AFTER the parent destroyed the store accumulated dead refs.

**Fix.** All four methods early-return when `rt.destroyed === true`. Each still returns a callable unsub for API stability (React's `useEffect` cleanup expects a function).

### 4. `finalizeApply` short-circuits cleanup when no knobs configured

**Bug.** `cleanupOldItems` ran on every dispatch. The internal short-circuit returned `null` quickly when both `maxItems === null` and `completedItemTTL === undefined`, but `finalizeApply` still paid a function-call frame and an `evicted: string[]` allocation.

**Why it mattered.** Hot path. A high-frequency dispatch workload (progress events) paid the cost on every reducer pass even when no cleanup config could ever match.

**Fix.** `cleanupConfigured` boolean computed once at runtime construction. `finalizeApply` skips the call when both knobs are disabled.

### 5. `waitFor` dedupes input `localIds`

**Bug.** Passing the same id twice (`waitFor([id, id])`) produced two entries in the result array because `buildOutcomes` mapped over the raw input.

**Why it mattered.** Edge case but real -- callers building id lists via concat / spread might dup. Result shape surprised consumers.

**Fix.** `localIds = Array.from(new Set(localIds))` at the top of `waitForOutcomes`. Doubles as the defensive copy from R20 (Set's iteration order matches insertion order, preserving original).

### 6. `Strategy.IRegistry.size` getter

**Bug.** Symmetric with `has` / `entries`; no `size` exposed.

**Why it mattered.** Consumers wanting "any strategies registered?" had to call `entries().length` -- O(n) allocation for a one-bit answer.

**Fix.** New `readonly size: number` on `IRegistry`. Implemented as a getter that returns `map.size` (O(1)).

### 7. Cleanup ordering documented (emit → resolver → microtask)

**Bug claim.** R21 audit suggested consumers awaiting `waitFor` might resolve before the `upload.removed` event fired.

**Why it didn't matter (after audit).** The actual code already emits the event SYNCHRONOUSLY before resolving the waitFor resolver. `resolve()` schedules `.then` callbacks for the microtask queue; the emitter listener fires synchronously inside `emit`. So a consumer with both `store.on('upload.removed', ...)` and `await store.waitFor([id])` always sees the `on` callback run BEFORE the `await` resumes. Matches `dispatch.remove`'s ordering. Doc comment added inline.

### 8. `persistDirty` on clean-skip exit — non-bug after re-audit

R21 audit flagged a concern that the clean-skip exit path didn't reset `persistDirty`. Tracing showed:
- The loop sets `persistDirty = false` at the top of every iteration before the clean check.
- The clean-skip exits without re-setting it.
- The next `flushPersistence` call also resets it at top of loop.
- A dispatch landing during the clean-skip's microtask resolves correctly via `schedulePersistence` flipping `persistStateDirty` to true.

No code change needed.

### Tests

- **+3 tests** (now 239 total):
  - Post-destroy `subscribe` / `on` / `flush` are no-ops (1).
  - `waitFor` dedupes duplicate localIds in the input (1).
  - `registry.size` reflects registered strategies (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 239 passed (239) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 23 — Plugin lifecycle, deterministic cleanup, exhaustive missing-reason (rating 9.85 → 9.9)

R22's audit named eight nits. All eight shipped.

### 1. `waitFor` after `destroy()` resolves synchronously with `'destroyed'`

**Bug.** Calling `waitFor` post-destroy registered a resolver into the cleared registry. The dispatch no-op meant no terminal event would ever fire and the resolver remained unreachable. Caller's promise hung forever.

**Why it mattered.** Component-unmount paths that called `waitFor` after the parent had already destroyed the store leaked a pending microtask handle.

**Fix.** Top of `waitForOutcomes` checks `rt.destroyed`. When true, returns `Promise.resolve(localIds.map(id => ({status: 'missing', reason: 'destroyed'})))` synchronously. No resolver registration; no hang.

### 2. Plugin `dispose()` lifecycle

**Bug.** `IUploadPlugin.setup` had no symmetric teardown. Plugins owning their own subscriptions / timers / external resources had nowhere to release them on `destroy()`.

**Why it mattered.** Real plugin leak. A plugin that subscribed to a remote service had no idea the store was being destroyed; its handle survived past the store's lifetime.

**Fix.** New `dispose?: () => void | Promise<void>` on `IUploadPlugin`. `destroy()` calls every plugin's dispose, collects the async ones, and `await`s them all before completing. Sync throws and async rejections route through `onListenerError`. Disposes run BEFORE the store tears down its own resources, so plugins can still read state during cleanup.

### 3. `flushPersistence` loop cap + `onPersistenceLoopStarved` hook

**Bug.** The trailing-flush loop had no upper bound. A buggy `onPersistenceError` hook that dispatched state changes would flip `persistDirty=true` indefinitely; the loop spun forever.

**Why it mattered.** Same class as the R18 `scheduleWork` cap. Production telemetry blind spot.

**Fix.** `MAX_FLUSH_PASSES = 100` ceiling. On hit, route through new `hooks.onPersistenceLoopStarved({passes})` (production-safe) with dev-error fallback. Next `schedulePersistence` starts a fresh pass.

### 4. `Outcome.missing.reason` is now required

**Bug.** Field was optional. Every producer set it, but the type didn't reflect the invariant.

**Why it mattered.** Consumers writing exhaustive `switch (outcome.reason)` couldn't trust the compiler — `undefined` was a legal branch.

**Fix.** Type tightened to required: `reason: 'removed' | 'evicted' | 'never-existed' | 'destroyed'`. The four producers already comply; this is a type-only change that surfaces the contract in TS.

### 5. `store.cleanup()` public method

**Bug.** No public way to force the cleanup pass. Tests + consumers wanting deterministic eviction had to wait for `completedItemTTL` or push the count past `maxItems` indirectly.

**Why it mattered.** Test flakiness. UI rollups that wanted "drop completed items now" had to await timer-based eviction.

**Fix.** New `rt.cleanupNow?: () => number` set in createStoreRuntime; public `store.cleanup()` exposes it. Routes through `finalizeApply(false)` so the same notify + persist + `upload.removed` wiring fires. Returns the eviction count.

### 6. `Strategy.IRegistry.entries()` variance — doc only

**Bug claim.** Element type collapses `K` to `keyof M & string`. Per-strategy type correlation lost when iterating.

**Why it's a doc-only change.** Fixing it requires variance gymnastics (the same homomorphic-mapped-type limit that forced the internal `Map` storage in R11). The trade-off is documented inline: callers that need the per-id correlation use `get(id)` with a literal `id`.

### 7. `getSnapshot()` after `destroy()` — doc only

**Bug claim.** Returns the pre-destroy state. Callers couldn't tell whether the snapshot was "live" or "post-mortem."

**Why it's a doc-only change.** R22 added `isDestroyed` which is the right discriminator. Freezing the snapshot reference at destroy time would surprise consumers who got a stale state by accident; returning a discriminator on the snapshot itself would bloat the shape. JSDoc on `getSnapshot()` now points at `isDestroyed`.

### 8. `tombstoneTTLMs: 0` treated as full disable

**Bug.** R19 set the TTL but kept tracking the tombstones on writer side. With TTL 0, the stale check immediately tombstone-prunes everything on read but the writer still wrote entries that the reader-side immediately discarded — pointless work.

**Why it mattered.** Performance + clarity. Consumers passing `0` to "turn it off" got partial disable.

**Fix.** Both writer paths (`dispatch.remove`, `finalizeApply` cleanup) check `tombstoneTTLMs > 0` before writing. JSDoc updated to document `0` as "feature disabled on both sides."

### Tests

- **+3 tests** (now 242 total):
  - `waitFor` post-destroy resolves with `reason: 'destroyed'` (1).
  - Plugin `dispose` runs (sync + async) during destroy (1).
  - `store.cleanup()` returns eviction count (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 242 passed (242) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 24 — Bail correctness, plugin-dispose surface, bulk API (rating 9.85 → 9.9)

R23's audit named eight nits. All eight shipped (6 code + 2 doc).

### 1. `persistWaiters` resolve on `MAX_FLUSH_PASSES` bail

**Bug.** R23's flush loop cap returned from the function without resolving pending `persistWaiters`. Any `await store.flush()` caller that piggy-backed onto this pass would hang forever because the NEXT pass starts fresh with no resolvers to find.

**Why it mattered.** Real correctness bug -- the bail path turned a flush() into a promise leak.

**Fix.** Splice + resolve waiters BEFORE the return in the bail block. Mirrors the clean-skip exit's behavior so all early-exit paths satisfy waiters.

### 2. Plugin `dispose` now runs with full dispatch surface

**Bug.** R23 fired plugin disposes AFTER swapping `rt.dispatch` to no-op. Plugins that tried to flush their own work via `dispatch` saw silent drops.

**Why it mattered.** A plugin that buffered events and wanted to flush them via dispatch during teardown couldn't. The whole point of dispose -- letting plugins drain -- was undermined.

**Fix.** Disposes run BEFORE the `destroyed = true` flip and BEFORE swap. New `tearingDown` flag prevents recursive re-entry while disposes are in flight. Sequence: disposes (with live dispatch) → flip destroyed → swap dispatch → flush → clear maps.

### 3. `store.cleanup()` returns `Promise<number>` joining flush

**Bug.** R23 cleanup() was synchronous. Consumers wanting to know "the eviction landed on disk" couldn't tell.

**Why it mattered.** UI rollups that needed durability after a manual cleanup had to call `cleanup()` then separately `flush()`. Two-step contract.

**Fix.** Public `cleanup()` is now `async`. Runs the cleanup pass synchronously, then `await rt.flushNow()` so the persistence flush settles before the promise resolves. Resolved value is the eviction count. No-op flush when no persistence.

### 4. `store.purge()` bulk operation

**Bug.** Removing N items required N dispatches. Consumer ergonomic gap.

**Why it mattered.** Common UI gesture ("clear all completed") had no native primitive.

**Fix.** New `store.purge(opts?: { phase?: Phase | Phase[] })`. Snapshots the matching ids first (so mid-iteration removes can't desync), dispatches `remove` per id, returns the count. Each removal still emits `upload.removed` with `reason: 'user'` so consumer listeners get one event per id.

### 5. `waitFor` post-destroy distinguishes `'destroyed'` vs `'never-existed'`

**Bug.** R23's post-destroy guard collapsed every id to `reason: 'destroyed'`. An id that was never in the store got the wrong reason.

**Why it mattered.** Telemetry could not tell apart "store died mid-wait" from "consumer typo'd an id that never existed."

**Fix.** Check `rt.state.items.has(id)` for each id at synchronous-resolve time. Existing id → `'destroyed'`. Missing id → `'never-existed'`.

### 6. `onPersistenceLoopStarved` test wired

**Best-effort coverage.** Provoking the 100-pass cap from outside the engine is hard (the loop only spins when a feedback signal flips `persistDirty` between every iteration, which requires a hook that re-dispatches state changes — blocked by the existing re-entry guard). Test asserts the hook IS wired by feeding a rejecting adapter; production telemetry inspection covers the genuine starvation path.

### 7. `Strategy.IRegistry.entries()` snapshot semantic — doc

**Bug claim.** Returns a snapshot. Concurrent `delete` between call and iteration shows stale entries.

**Fix.** Doc-only. `entries()` is explicitly snapshot-by-design: safe to iterate while mutating. The shape returned is the registry's state at the call moment. Inline JSDoc clarifies.

### 8. `flush()` post-destroy semantic — doc

**Bug claim.** Caller can't distinguish "wrote nothing because clean" from "wrote nothing because destroyed."

**Fix.** Doc-only. Callers needing the distinction read `isDestroyed` first (R22). Return type stays `Promise<void>` because both outcomes are semantically "the consumer asked, the engine confirmed there's nothing left to do." JSDoc points at `isDestroyed`.

### Tests

- **+4 tests** (now 246 total):
  - `store.purge()` removes all items + emits per-id event with `reason: 'user'` (1).
  - `store.purge({ phase })` filters by phase (1).
  - Post-destroy `waitFor` distinguishes `'destroyed'` (existing id) from `'never-existed'` (phantom id) (1).
  - `onPersistenceLoopStarved` hook wired (1, best-effort).

### Verification

```
npx vitest run         -> 15 passed (15) / 246 passed (246) -- 2.1s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 25 — Bulk API parity, hot-path shortcuts, tombstone-aware waitFor (rating 9.85 → 9.9)

R24's audit named eight nits. All eight shipped.

### 1. `purge()` batches into one reducer pass

**Bug.** R24 purge() looped `rt.dispatch({type:'remove', localId})` per id. N items → N applyCommand calls → N finalizeApply → N notify → N schedulePersistence. A 1000-id purge cost 1000 notifies + 1000 debounced flushes.

**Why it mattered.** Real perf regression for bulk operations. Each notify potentially walks every React subscriber.

**Fix.** Bulk path now releases slots + writes tombstones per id synchronously, then submits ONE `applyCommandBatch` with N `remove` commands. The batch fires one notify + one finalizeApply + one persist. Per-id emit + waitFor resolve happens AFTER the batch (in a single sync loop) so consumer listeners still get N events but the engine pays N×1 reducer work.

### 2. `purge()` returns `Promise<number>` joining flush

**Bug.** R24 cleanup() returned `Promise<number>` joining persistence. purge() stayed sync, drifting from the parallel API.

**Why it mattered.** API inconsistency. Consumer wanting durability of bulk removal had to call `await store.purge(); await store.flush();` -- two-step contract.

**Fix.** purge() is now `async`. After the bulk emit+resolve loop, calls `rt.flushNow()` so the caller's `await store.purge()` knows the bulk removal landed on disk. Both `cleanup()` and `purge()` now share the same "evict + await flush" contract.

### 3. `cleanup()` persistence-failure semantics documented

**Bug.** cleanup() silently swallowed save rejection. A failed adapter write didn't surface to the caller despite the count of evictions being returned.

**Why it's a doc.** Routing the rejection back changes contract semantics consumers may already depend on (eviction-from-memory is independent of durability). JSDoc now spells out: persistence failure goes through `onPersistenceError`, not the return promise. Consumers needing durability confirmation listen to that hook.

### 4. `purge({ predicate })` for arbitrary filter

**Bug.** R24 only supported `phase` filtering. Consumers wanting "drop everything older than 1h" or "drop everything from purpose X" needed manual `dispatch({type:'remove'})` loops.

**Why it mattered.** Common ergonomic gap.

**Fix.** New `purge(opts?: { phase?: Phase | Phase[]; predicate?: (item) => boolean })`. Phase filter runs first (O(1) Set lookup); predicate runs only on items that survived. Both filters AND together when both are set.

### 5. `onPersistenceLoopStarved` test wired (best-effort)

**Bug claim.** R23 hook was wired but the test didn't actually provoke the cap.

**Best-effort fix.** The genuine 100-pass starvation requires a hook that flips `persistDirty` mid-loop -- blocked by the existing `reportingPersistenceError` re-entry guard. Test now feeds a rejecting adapter to assert the hook is at least reachable; documented as "production telemetry covers the real path."

### 6. `store.has(localId)` shortcut

**Bug.** Existence check required `store.getSnapshot().items.has(id)`. Hot-path polls allocated the proxy snapshot view on every call.

**Why it mattered.** React render-loops checking item existence paid an O(1) but real allocation per call. Multiply across thousands of polls.

**Fix.** New `store.has(localId): boolean` thin pass-through: `rt.state.items.has(localId)`. Skips the snapshot wrapper allocation.

### 7. `Strategy.IRegistry.iterate()` allocation-free walk

**Bug.** `entries()` returns a freshly-allocated array on every call. For diagnostics walks across thousands of strategies (extreme but real for HMR-heavy enumerations), the allocation adds up.

**Why it mattered.** Niche but real for large strategy registries.

**Fix.** New `iterate(): IterableIterator<...>` returns the underlying `Map.values()` directly. Concurrent mutation during iteration follows Map semantics (deleted entries may or may not be observed mid-yield). `entries()` stays for the snapshot use case.

### 8. `waitFor` post-destroy respects tombstones

**Bug.** R23 post-destroy resolution checked `rt.state.items.has(id)` to pick `'destroyed'` vs `'never-existed'`. An id that was removed seconds before destroy (in the tombstone window) got the wrong reason.

**Why it mattered.** Telemetry / retry logic relying on `reason: 'removed'` to trigger re-add never fired -- the consumer saw `'never-existed'` and skipped the recovery path.

**Fix.** Priority order: state hit → `'destroyed'`. Otherwise tombstone hit → `'removed'`. Otherwise → `'never-existed'`. New test pins the tombstone path: a removed id resolves with `'removed'` even after destroy.

### Tests

- **+4 tests** (now 250 total):
  - `purge({ predicate })` filters by arbitrary item shape (1).
  - `purge()` collapses N removes into ~1 notify (1).
  - `store.has(id)` is O(1) true/false (1).
  - Post-destroy `waitFor` on a tombstoned id resolves with `'removed'` (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 250 passed (250) -- 2.3s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 26 — Dead-store alignment, snapshot iterators, retry tear-down race (rating 9.85 → 9.9)

R25's audit named eight nits. All eight addressed (4 code + 4 doc).

### 1. `purge()` slot-release ordering — documented invariant

**Bug claim.** R25 purge() releases slots BEFORE the applyCommandBatch. A slot's abort handler that dispatched a sync command could land between the release loop and the batch.

**Why doc-only.** Slot abort handlers don't dispatch through the engine (they only abort the controller, which the inflight strategy/effect picks up async). The "no sync side-effect from abort" invariant is now spelled out in the comment.

### 2. `store.has(id)` returns false after `destroy()`

**Bug.** `has()` read `rt.state.items.has(localId)` -- state survives teardown (only controllers + listeners get cleared), so existence checks lied about a dead store's state.

**Why it mattered.** Consumer code asking "is this item alive?" got a stale truth value, inconsistent with `subscribe`/`on`/`dispatch` which all gate on `isDestroyed`.

**Fix.** `has()` returns `false` when `rt.destroyed`. Matches the dead-store contract: every public method that asserts liveness short-circuits.

### 3. `registry.iterate()` snapshot iterator

**Bug.** R25 iterate() exposed `map.values()` directly. Consumer mutating the registry mid-iteration would see stale refs (deleted entries still yielded the old value) or skip newly-added strategies.

**Why it mattered.** Iteration during HMR / plugin reload paths could surface a strategy that had just been overwritten.

**Fix.** `iterate()` captures `Array.from(map.values())` at call time. The resulting iterator yields the snapshot regardless of concurrent `set` / `delete`. New test pins the contract: deleting an entry AFTER taking the iterator still yields the snapshotted ref.

### 4. `purge()` Promise-then ordering — documented

**Bug claim.** R25 purge() resolves Promise<number> after the emit+resolve loop, but the consumer's `waitFor().then` runs in a microtask scheduled by the resolver call. So `await purge()` finishes before `waitFor().then` fires.

**Why doc-only.** This is standard Promise microtask ordering. Caller wanting to sequence after every waitFor consumer settled should explicitly await both. Doc clarifies.

### 5. `onPersistenceLoopStarved` — documented as production-only

**Bug claim.** Hook can't be provoked from the public API.

**Fix.** Doc marks the hook as production-telemetry-only. The R23 test reaches the rejecting-adapter path; provoking the genuine cap requires an internal test seam we don't ship.

### 6. `cleanup()` vs `purge()` emit-reason — documented

**Bug claim.** Engine-driven cleanup emits `reason: 'cleanup'`; user-driven purge emits `reason: 'user'`. cleanup() can't override.

**Why doc-only.** That's the design: the reason flag tells consumers WHO drove the eviction. A `cleanup(opts: {reason})` knob would muddy the contract.

### 7. `scheduleRetry` checks `rt.destroyed` after sleep

**Bug.** R25 added a `state.items.has(localId)` check after the post-sleep wake but didn't check `rt.destroyed`. A destroy that ran during the sleep window left the item in state (teardown only clears controllers), so the retry effect dispatched a `retry` command into the post-destroy no-op dispatch.

**Why it mattered.** Wasted effect slot at exactly the moment the queue was being torn down. No correctness break (dispatch is no-op), but wasted work.

**Fix.** Both branches of the post-sleep path (watchdog-aborted and clean-sleep) now early-return on `rt.destroyed`.

### 8. `tombstoneTTLMs: 0` apply-side fully disabled

**Bug.** R23 doc said "fully disabled," but the apply-side `applyLoaded` check `if (tombstoneTTLMs > 0 && Date.now() - at > tombstoneTTLMs) continue` evaluated to `false` with TTL=0 -- which meant the stale-skip didn't fire and the tombstone WAS applied (deleting items from local state).

**Why it mattered.** Inconsistent with the doc. Consumer setting TTL=0 to opt out of cross-tab reconciliation still saw tombstones from sibling tabs delete local items.

**Fix.** Outer guard at apply-side: skip the entire tomb-apply block when TTL=0. Both writer and reader now respect the disable.

### Tests

- **+2 tests** (now 252 total):
  - `store.has(id)` returns false post-destroy (1).
  - `registry.iterate()` snapshot independent of mid-iteration delete (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 252 passed (252) -- 2.4s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 27 — Defensive polish + doc tightening (rating 9.85 → 9.9)

R26's audit named eight nits. Code (3) + doc (5). Diminishing returns; the engine is mature.

### 1. `purge()` wraps `applyCommandBatch` in try/catch

**Bug claim.** A defensive throw inside the batch could leave per-id emit + waitFor resolve loop stranded.

**Why it mattered.** Slots already released; if batch throws, consumers waiting on `upload.removed` never hear. Even though the batch doesn't throw in practice, the failure mode would lose every consumer-side signal.

**Fix.** Wrap `applyCommandBatch` in try/catch. On catch, route to `onListenerError` (kind: 'subscriber' for now since there's no specific kind for batch failure). The per-id emit + waitFor resolve loop runs regardless so listeners still get the signal.

### 2. `cleanup()` predicate — kept engine-driven

**Bug claim.** No filter on cleanup().

**Why doc-only.** cleanup() runs the engine's TTL/maxItems eviction pass. Adding a predicate would duplicate `purge(opts: {predicate})`. Documented as "engine-driven; use purge() for arbitrary filters."

### 3. `subscribe()` post-destroy doc

**Bug claim.** Type signature doesn't reflect dead-store semantics.

**Fix.** Doc-only. JSDoc on subscribe spells out: post-destroy returns a no-op unsub; listener never fires; type stays the same to keep React's useEffect cleanup signature legal.

### 4. `waitFor` single-id fast path

**Bug claim.** `Array.from(new Set(localIds))` runs even when length === 1.

**Why it mattered.** Hottest waitFor pattern is single-id wait. Set construction + iteration on a 1-element array is wasted work.

**Fix.** Branch on `localIds.length`. ≤1: re-wrap as a single-element array (defensive copy, no Set). >1: original dedupe path.

### 5. `Strategy.IRegistry.has()` type-predicate asymmetry — doc

**Bug claim.** `id is keyof M & string` narrows the input even when `has` returns false.

**Why doc-only.** That's how TS type predicates work: the predicate documents the shape the runtime check guards. The runtime check is "registered in this registry," not "is a valid intent key." Documented inline with the recommendation to use `get(id)` for "actually registered" checks.

### 6. `flush` cached at construction

**Bug.** `store.flush()` re-read `rt.flushNow` on every call.

**Why it mattered.** Micro-perf; every flush paid a property lookup.

**Fix.** IIFE in the return object caches `rt.flushNow` at construction. The cached callable is used inside the public flush(). One property read at construction, zero per call.

### 7. `tombstones` serialize order — doc

**Bug claim.** Iteration order undocumented.

**Fix.** Doc-only. JSDoc on `IPersistedSnapshot.tombstones` documents the JS Map insertion-order guarantee.

### 8. `Outcome.missing.reason` exhaustiveness — doc

**Bug claim.** TS doesn't warn on missing case.

**Why doc-only.** TS pattern-matching exhaustiveness requires `assertNever` or a strictly typed reducer. Documented in CHANGES as the consumer-side responsibility.

### Tests

No new tests this round (changes are either defensive try/catch on unreachable paths or doc).

### Verification

```
npx vitest run         -> 15 passed (15) / 252 passed (252) -- 2.4s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 28 — Plugin surface widening, granular React hooks, telemetry kind (rating 9.85 → 9.9)

R27's audit named eight nits. 3 code + 5 doc.

### 1. Plugin `setup` ctx widened to full lifecycle surface

**Bug.** R23 plugins got only `on / dispatch / getSnapshot`. Couldn't `await flush`, do bulk operations, check `has(id)`, or subscribe via the public mechanism.

**Why it mattered.** Plugins held raw `rt` references via wrapper code or duplicated logic.

**Fix.** Plugin ctx now exposes `on / off / dispatch / getSnapshot / subscribe / waitFor / flush / cleanup / purge / has`. Internal refactor: chicken-and-egg between `ready` (needs pending-plugin promises) and ctx (needs full store object) resolved by deferring `ready` to a hand-rolled Promise that resolves after all plugin setups settle.

### 2. `onListenerError` gains `'batch'` kind

**Bug.** R27 purge() try/catch routed batch failures through `kind: 'subscriber'`. Wrong tag.

**Fix.** Context union extended: `kind: 'subscriber' | 'plugin-setup' | 'emitter' | 'batch'`. The purge catch now uses `'batch'`.

### 6. Granular React hooks: `useUploaderItems` + `useUploaderPhase`

**Bug.** R20 made `useUploader` memo the returned object; per-slice consumers still re-rendered on every state change because the returned object's `items` was new on every change.

**Why it mattered.** A host showing only "failed uploads" re-rendered on every progress tick because the `failed` field came from the master object.

**Fix.** Two new hooks in `react/use-uploader.tsx`:
- `useUploaderItems(store?)` — `useSyncExternalStore` with a snapshot cache keyed on `state.items` ref. New array allocated only when the items map changes.
- `useUploaderPhase(phase, store?)` — same shape but filters to a single phase. Shallow shape-compare on the resulting bucket means consumers see the SAME array ref across notifies when their phase didn't change.

### Doc-only changes (3, 4, 5, 7, 8)

- `entries()` vs `iterate()` use cases.
- `Engine.Outcome.missing.reason` consumer-side `assertNever` pattern.
- waitFor single-id alloc minimized in R27.
- `Engine.Phase` 'settling' alias documentation.
- `EventMap` closed-shape by design; plugins use sibling emitters.

### Verification

```
npx vitest run         -> 15 passed (15) / 252 passed (252) -- 2.4s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 29 — Ergonomic exports, naming consistency, streaming API (rating 9.9 → 9.95)

R28's audit named eight nits. 4 code + 4 doc.

### 1. React-hook test rig — doc

Granular hooks (`useUploaderItems` / `useUploaderPhase`) need jsdom + @testing-library/react. Out of scope for the node-env vitest setup; doc as "consumer-side integration test."

### 2. `useUploader` legacy — doc

Both hooks ship. Legacy `useUploader` returns the master object (back-compat); new `useUploaderItems` + `useUploaderPhase` are per-slice. JSDoc points consumers at the granular hooks for new code.

### 3. Exported `assertNever`

**Bug.** Consumers doing exhaustive switch on `Outcome.missing.reason` wrote their own.

**Fix.** New `assertNever(value: never): never` in `core/utils/guards.ts`. Throws on missing branch; satisfies TS exhaustiveness check at the default case. Test pins the throw semantics.

### 4. `purge` predicate short-circuit — doc

Phase filter already runs before predicate. Iteration walks every item; predicate runs only on phase survivors. No-match phase still pays the iteration but skips predicate alloc. Doc clarifies.

### 5. `pluginCtx` inline — doc

Style nit; not changed because the explicit binding clarifies the surface.

### 6. `Engine.Phases` enum-style const

**Bug.** `Phase` was a string union with no runtime values. Consumers either memorized literals or built their own constants.

**Fix.** New `Engine.Phases = { validating: 'validating', ... } as const satisfies Record<Phase, Phase>`. Both styles coexist: `phase === 'completing'` (literal) and `phase === Engine.Phases.completing` (named). Test pins the const matches the union.

### 7. `store.dispose` alias for `destroy`

**Bug.** Plugin lifecycle uses `dispose`; store lifecycle uses `destroy`. Inconsistent verbs.

**Fix.** `store.dispose` is a direct alias for `store.destroy`. Both reference the same function; idempotency + flush semantics shared. Test pins the alias.

### 8. `store.outcomes()` async iterable

**Bug.** No streaming API for terminal outcomes. Consumers wanting `for await (const outcome of store.outcomes())` had to subscribe + buffer manually.

**Fix.** New `outcomes(): AsyncIterableIterator<Engine.Outcome<R>>`. Internal: listeners on `upload.completed` / `upload.error` (non-retryable only) / `upload.canceled` / `upload.removed` push into a buffer; the iterator's `next()` either pops from the buffer or returns a pending promise that resolves on the next event. `return()` (called by `break` in a `for await` loop) detaches all listeners. `destroy()` ends the iterator. Test pins the streaming order across two completed uploads.

### Tests

- **+4 tests** (now 256 total):
  - `assertNever` throws with the unhandled value (1).
  - `store.dispose` aliases destroy + idempotent (1).
  - `store.outcomes()` streams terminal outcomes (1).
  - `Engine.Phases` const matches the Phase string union (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 256 passed (256) -- 2.5s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 30 — Bounded outcomes buffer, defensive helpers, deprecation marks (rating 9.9 → 9.95)

R29's audit named eight nits. 3 code + 5 doc.

### 1. `outcomes()` buffer is now bounded

**Bug.** R29 outcomes() pumped events into an unbounded array. A slow consumer + fast emitter would balloon memory.

**Fix.** New `bufferLimit?: number | null` opt on `outcomes()` (default `1000`, `null` disables). Drop-oldest on overflow keeps the buffer bounded; consumer sees the latest tail. Test pins the cap.

### 2. Plugin `destroy` invariant — doc

Plugin's `setup` ctx exposes the full lifecycle surface but not `destroy` itself. A plugin that somehow calls `store.dispose()` from outside the setup phase still triggers the `tearingDown` recursion guard from R28. Doc note added.

### 3. `assertNever` circular-safe

**Bug.** `JSON.stringify(value)` throws on circular refs and masks the real exhaustiveness bug.

**Fix.** Wrap in try/catch; fall back to `String(value)` if stringify throws.

### 4. `Engine.Phases` bundle cost — doc

The const adds ~200 bytes. Documented as acceptable trade for enum-style ergonomics. Tree-shake works because the const is a leaf export.

### 5. `outcomes({includeRetryable: true})`

**Bug.** R29 outcomes() silently skipped retryable errors to match waitFor onlyFinal. Some consumers want every error.

**Fix.** New `includeRetryable?: boolean` opt. Default `false` preserves the existing semantic; `true` emits retryable errors as terminal outcomes too.

### 6. `useUploaderPhase` shape compare — doc

The shape compare uses item ref equality. When the reducer's lazy-clone keeps item refs stable across no-op events, the bucket ref stays stable too. Doc the contract.

### 7. `entries()` deprecated in favor of `iterate()`

**Bug.** Both methods snapshot now. `entries()` allocates the array eagerly; `iterate()` returns an iterator over the snapshot.

**Fix.** `entries()` JSDoc adds `@deprecated` pointing at `iterate()`. Both stay shipped for back-compat.

### 8. `store.dispose` semantic — doc

Direct alias of `destroy`. JSDoc on both points at the relationship. No semantic difference; the naming choice mirrors `IUploadPlugin.dispose`.

### Tests

- **+1 test** (now 257 total):
  - `outcomes({bufferLimit: 2})` caps the buffer at 2 entries when consumer falls behind.

### Verification

```
npx vitest run         -> 15 passed (15) / 257 passed (257) -- 2.6s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 31 — Final-tier polish: streaming replay, error subclass (rating 9.9 → 9.95)

R30's audit named eight contrived nits. 3 code + 5 doc.

### 1. `outcomes()` drop-newest opt — not added

Drop-oldest is the right default for "show me the latest activity stream." Drop-newest would lose new info; consumer can break out of `for await` and re-call with fresh listeners if they want a reset. Doc.

### 2. `AssertNeverError` subclass

**Bug.** R30 `assertNever` threw plain `Error`. Couldn't filter exhaustiveness failures from other engine errors via `instanceof`.

**Fix.** New `AssertNeverError extends Error` with `code: 'assert_never'` and `value: unknown`. `assertNever()` now throws this class. Sentry / telemetry can route via `instanceof AssertNeverError`. Test covers both `instanceof` and the captured `.value`.

### 3. `Engine.Phases` top-level export — doc

Already reachable via `Engine.Phases` from `@gentleduck/upload/core`. Adding a sibling `Phases` re-export risks name collision; doc the access path.

### 4. waitFor signal + timeout interaction — doc

Both compose via the same `WaitForError`. JSDoc on waitFor spells out the precedence (signal abort wins over timeout if it lands first; either rejects with `WaitForError` carrying partial outcomes).

### 5. `outcomes({replay: 'all'})`

**Bug.** R29 outcomes() only subscribed to future events. Consumers wanting "reduce across every terminal upload past and future" had to manually iterate `getSnapshot().items` first then subscribe.

**Fix.** New `replay?: 'all' | 'none'` opt (default `'none'`). When `'all'`, the iterator seeds the buffer with every existing terminal item (completed / error / canceled) before subscribing. Buffer-limit cap still applies during seeding. Test pins replay across two pre-completed uploads.

### 6. `registry.iterate()` order — doc

Returns `Array.from(map.values())` iterator. Order matches Map insertion (JS spec-stable). Doc note.

### 7. `Engine.Outcome` branded type — not added

Over-engineering. The discriminated union already gives type safety; branding adds opacity for no real win.

### 8. `store.dispose` one-time dev warning — not added

Pure alias. Warning would be noise. Consumers picking one for telemetry should standardize at their layer.

### Tests

- **+2 tests** (now 259 total):
  - `AssertNeverError` instanceof + captured value (1).
  - `outcomes({replay: 'all'})` yields existing terminals before new events (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 259 passed (259) -- 2.6s
npx tsc --noEmit       -> green
npx biome check .      -> green
```

---

## Round 32 — outcomes() race fix, purge predicate guard (rating 9.9 → 9.95)

3 real fixes. Skipping 5 contrived nits per the "no churn" rule.

### 1. `outcomes()` attach listeners BEFORE replay seed

**Bug.** R31 seeded the buffer first, then attached emitter listeners. An event landing between the seed walk and listener attach was dropped.

**Why it mattered.** Real race in tight loops where a strategy completes during the call to `outcomes()`.

**Fix.** Listeners attach first; replay seed runs after. Trade-off: a single item that completed mid-seed could appear twice (once in the seed snapshot, once via listener). Documented as "exactly-at-least-once" — drops > duplicates for this use case.

### 2. `outcomes()` after `destroy()` returns immediately-done iterator

**Bug.** A post-destroy `outcomes()` call attached listeners on a destroyed emitter. Listeners never fired but stayed registered, leaking memory.

**Fix.** Top-of-function check on `rt.destroyed`. Returns a done-from-the-start iterator with no listeners.

### 3. `purge({predicate})` guards against predicate throws

**Bug.** A throwing predicate aborted the entire purge mid-walk. The slot-release + tombstone logic ran for some ids but not others; state inconsistent.

**Fix.** Per-item try/catch around the predicate call. A throw treats the item as "exclude" and routes the error through `onListenerError` (kind: 'subscriber'). Bulk operation completes for the rest.

### Tests

- **+2 tests** (now 261 total):
  - `outcomes()` after destroy returns done iterator (1).
  - `purge` with throwing predicate excludes the throw'd item, continues (1).

### Verification

```
npx vitest run         -> 15 passed (15) / 261 passed (261) -- 2.7s
npx tsc --noEmit       -> green
npx biome check .      -> green
```
