# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Per-package changelogs are managed by
[Changesets](https://github.com/changesets/changesets) and live next to
each package's `package.json`. This file tracks repo-wide notes:
governance, OSS scaffolding, workspace structure, and other changes
that span multiple packages.

## [Unreleased]

### Added

- LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, and CHANGELOG
  scaffolding files.
- `.editorconfig`, `.typos.toml`, `socket.yml` for cross-editor and
  supply-chain hygiene.
- `@gentleduck/calendar` headless calendar engine package.
- `apps/duck-iam-docs` and benchmark workspaces.

### Changed

- Renamed repo references `gentleeduck/duck-ui` -> `gentleeduck/gentleduck`.
- Biome formatting applied across workspace placeholder `package.json`
  files.

### Removed

- `apps/duck-iam-docs/package.json` placeholder (workspace pending).

[Unreleased]: https://github.com/gentleeduck/gentleduck/compare/HEAD
