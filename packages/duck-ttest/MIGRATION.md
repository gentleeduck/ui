# Migration Guide

## Unreleased — breaking renames + canonicalization

The pass-1 cleanup canonicalized helpers that were duplicated across multiple
sub-packages and corrected a long-standing typo. **Update your imports before
upgrading.**

### Subpath renames

| Old subpath | New subpath | Notes |
|---|---|---|
| `@gentleduck/ttest/predictates` | `@gentleduck/ttest/predicates` | Typo fix. |
| `@gentleduck/ttest/domain` | `@gentleduck/ttest/json` + `@gentleduck/ttest/format` | Split — `JSONValue` etc. live in `json`, formatting helpers in `format`. |
| `@gentleduck/ttest/objects` | `@gentleduck/ttest/object` | Singular form is canonical. |

### Type renames

| Old name | New name | Reason |
|---|---|---|
| `NegativeNumber` | `Negative` | Symmetric with peer `NonNegative`. |
| `IsOptional` (from `~/sql`) | `IsSQLOptional` | Avoids semantic collision with `~/primitive`'s `IsOptional`. |
| `IsNullable` (from `~/sql`) | `IsSQLNullable` | Avoids semantic collision with `~/primitive`'s `IsNullable`. |

### Type-level behaviour change

| Symbol | Before | After |
|---|---|---|
| `SQLTypeMap['JSON']` | `any` | `JSONValue` (imported from `~/json`) |

If you previously relied on the `any` widening on `SQLTypeMap['JSON']`, narrow
your value to `JSONValue` (object \| array \| string \| number \| boolean \| null) or
explicitly cast at the boundary.

### Back-compat re-exports (deprecated)

The following symbols are re-exported from their old `~/sql` location with
`@deprecated` JSDoc. They will be removed in a future major.

- `Trim` — now canonical in `~/template`.
- `UnionToIntersection` — now canonical in `~/union`.

### Rebuild requirement

If you have a local `dist/` from a prior version, **delete it before
rebuilding** — the renamed folders (`predicates/`, `json/`, `format/`,
`object/`) won't replace the stale ones (`predictates/`, `domain/`,
`objects/`):

```bash
cd packages/duck-ttest
rm -rf dist
bun run build
```

The npm tarball ships `src/` only (`package.json#files`), so registry consumers
are unaffected — this only matters for local development of the package itself.
