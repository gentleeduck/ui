# duck-calendar: Bundle Size Audit and Performance Benchmarks

Issue #313. Measure and validate bundle size, rendering performance, and package quality.

## Bundle Size

| Bundle | Gzipped | Target | Status |
|--------|---------|--------|--------|
| Core (no React) | 2.5 KB | < 3 KB | PASS |
| React hooks | 4.2 KB | < 8 KB | PASS |
| Full package | 4.9 KB | < 8 KB | PASS |

75% smaller than react-day-picker v9 (~20 KB).

## Performance Tests

8 tests in `src/__test__/performance.test.ts`:
- buildCalendarMonth < 1ms
- buildMultiMonth(3) < 3ms
- buildMultiMonth(12) < 10ms
- applySelection < 1ms
- Adapter ops < 10μs
- Memoization correctness verified

## Package Quality

publint: pass. attw: pass. Tree-shakeable.

## Total: 498 tests (416 calendar + 82 primitives)
