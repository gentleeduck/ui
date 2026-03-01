# @gentleduck/cli

## 1.1.0

### Minor Changes

- Add robust monorepo workspace support across CLI commands.

  - add `--workspace <path>` support for `init`, `add`, `update`, `remove`, and `diff`
  - validate workspace targets (`package.json` and `tsconfig.json` where required)
  - infer workspace from current directory when running inside a monorepo workspace
  - improve config handling with legacy migration errors for missing `workspace`
  - add command help/docs/test coverage for workspace behavior

## Unreleased

### Features

- Added monorepo workspace targeting support via `--workspace <path>` for:
  - `init`
  - `add`
  - `update`
  - `remove`
  - `diff`
- Added strict workspace validation:
  - `package.json` required
  - `tsconfig.json` required for component commands
- Added workspace auto-inference from current directory when running inside a monorepo workspace and `--workspace` is not provided.

### Improvements

- Added explicit runtime output showing resolved workspace target (`Using workspace: ...`).
- Added legacy config migration guard:
  - old `duck-ui.config.json` files missing `workspace` are rejected with a migration message.
- Added parent-directory discovery for `duck-ui.config.json`.

### Tests

- Added e2e coverage for valid and invalid `--workspace` behavior across `add/update/remove/diff`.
- Added e2e coverage for invalid `init --monorepo --workspace` preflight path.
- Added command help snapshot tests to lock `--workspace` help output.

## 1.0.11

### Patch Changes

- fixed binaries
