# Branch protection — required setup

Configure on GitHub: **Settings → Branches → Add rule** for `master` (and any release branches).

## Required for `master`

- **Require a pull request before merging**
  - Require approvals: **1**
  - Dismiss stale pull request approvals when new commits are pushed: **on**
  - Require review from Code Owners: **on** (if `.github/CODEOWNERS` present)
- **Require status checks to pass before merging**
  - Require branches to be up to date: **on**
  - Required checks:
    - `lint` (from `CI`)
    - `build` (from `CI`)
    - `test` (from `CI`)
    - `analyze` (from `CodeQL`)
    - `dependency-review` (from `Dependency Review`)
    - `lint` (from `Lint PR title`)
- **Require conversation resolution before merging**: on
- **Require signed commits**: on
- **Require linear history**: on (squash + rebase merges only)
- **Lock branch**: off
- **Do not allow bypassing the above settings**: on
- **Restrict who can push**: maintainers only
- **Allow force pushes**: off
- **Allow deletions**: off

## Repository settings

- **General → Pull Requests**
  - Allow squash merging: **on** (default)
  - Allow rebase merging: **on**
  - Allow merge commits: **off**
  - Always suggest updating pull request branches: **on**
  - Automatically delete head branches: **on**
- **Code security and analysis**
  - Dependency graph: **on**
  - Dependabot alerts: **on**
  - Dependabot security updates: **on**
  - Dependabot version updates: **on** (managed by `.github/dependabot.yml`)
  - Code scanning (CodeQL): **on** (managed by `.github/workflows/codeql.yml`)
  - Secret scanning: **on**
  - Secret scanning push protection: **on**
  - Private vulnerability reporting: **on**

## Tags

Protect tags matching `v*` and `@gentleduck/*`:

- **Settings → Tags → New rule** → pattern `v*` and `@gentleduck/*`
  - Only repository admins and the release workflow can create matching tags.

## CodeRabbit (free for public OSS repos)

CodeRabbit reviews PRs automatically. Configured via `.coderabbit.yaml`.
Install the GitHub App once per org: https://github.com/marketplace/coderabbit

## OSSF Scorecard

Public, scheduled supply-chain security analysis. Configured via `.github/workflows/scorecard.yml`.
Results published to the OpenSSF Scorecard API.

## Required repo secrets

| Secret | Purpose |
|---|---|
| `NPM_TOKEN` | Publish releases (Changesets) |
| `TURBO_TOKEN` | Remote cache (optional) |
| `TURBO_TEAM` | Remote cache team (optional) |
