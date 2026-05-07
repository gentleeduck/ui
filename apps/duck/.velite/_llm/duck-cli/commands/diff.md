## Usage

```bash
npx @gentleduck/cli diff [components...]
```

Compares your local component source against the latest registry version. Default output is a **syntax-highlighted side-by-side TUI**; pass `--gui false` for plain text.

---

## Options

| Flag | Description |
| --- | --- |
| `-c, --cwd         │   return  │
│ }                          │ }                              │
└────────────────────────────┴───────────────────────────────┘
                          [j/k] move  [q] quit  [u] update
```

Press `u` to launch [`update`](/duck-cli/commands/update) on the currently-focused component without leaving the TUI.

---

## Common workflow

1. `cli diff` — see what's drifted from upstream
2. `cli update <name>` — pull changes via the merge TUI (preserves your local edits)
3. `cli diff <name>` — verify the merge resolved correctly

---

## Use in CI

For CI / scripts, diff exits with code `1` when there's a diff and `0` when in sync:

```bash
npx @gentleduck/cli diff --gui false || echo "drift detected"
```