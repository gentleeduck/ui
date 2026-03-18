# duck-calendar: Bundle Size Audit and Performance Benchmarks

Issue #313. Measure and validate bundle size and performance.

> Depends on: #304–#312 — all complete.

## Bundle Size Results

| Bundle | Raw | Gzipped | Target | Status |
|--------|-----|---------|--------|--------|
| **Core** (adapter, grid, selection, nav, time) | 7.3 KB | **2.5 KB** | < 3 KB | ✅ Pass |
| **React** (hooks only) | 11.7 KB | **4.2 KB** | < 8 KB | ✅ Pass |
| **Full** (everything) | 23.3 KB | **7.0 KB** | < 8 KB | ✅ Pass |

### Comparison: duck-calendar vs react-day-picker

| | duck-calendar | react-day-picker v9 | Savings |
|--|--|--|--|
| Core gzipped | 2.5 KB | N/A (no core-only) | — |
| Full gzipped | 7.0 KB | ~20 KB | **65% smaller** |
| CSS included | 0 KB (data attributes) | ~3 KB (built-in) | 100% smaller |
| Dependencies | 0 | date-fns (optional) | — |

## Package Quality

| Tool | Result |
|------|--------|
| **publint** | ✅ All good |
| **attw** (are-the-types-wrong) | ✅ Types correct for node10, node16 (ESM), bundler |
| ESM | ✅ Pure ESM, `"type": "module"` |
| Tree-shaking | ✅ `"sideEffects": false` |

## Individual Module Sizes (gzipped)

| Module | Gzipped |
|--------|---------|
| native-adapter.js | 525 B |
| grid.js | 673 B |
| grid.libs.js | 387 B |
| selection.js | 530 B |
| selection.libs.js | 316 B |
| navigation.js | 394 B |
| time.js | 524 B |
| time.libs.js | 231 B |
| use-calendar.js | 1,378 B |
| use-calendar.libs.js | 550 B |
| use-keyboard.js | 603 B |
| use-announcer.js | 740 B |
| use-time-picker.js | 1,390 B |
| use-datetime.js | 614 B |

## Test Coverage

- 408 calendar tests (364 runtime + 44 type-level)
- 82 primitives calendar tests (60 component + 15 a11y + 7 utils)
- **490 total tests, all passing**
