## Bundle Size + Dependencies

---

## Per-Library Comparisons

Feature-by-feature tables against each competitor:

---

## Internal Breakdown

Module sizes, core engine performance, and adapter benchmarks:

---

## Methodology

- **gentleduck**: sizes from `packages/duck-calendar/dist/` via `gzip -c | wc -c`
- **Competitors**: bundle sizes from npm and bundlephobia.com
- **Performance**: average of 2,000 iterations per operation
- Sizes are **minified + gzipped**

Regenerate:

```bash
cd packages/duck-calendar
bun run benchmark
```