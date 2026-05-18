# duck-iam · TanStack Start example

End-to-end ABAC + RBAC demo of [`@gentleduck/iam`](../../../) using TanStack
Start (router + query + devtools) and an in-memory mock backend.

No database. No server. The mock backend lives in `src/iam/mock-backend.ts`
and persists nothing across reloads.

## What it shows

- Typed access config with `actions`, `resources`, `roles`, `scopes`,
  and a per-resource attribute map for `post`, `comment`, and `user`.
- RBAC role tree: `guest → reader → author → editor → admin`.
- ABAC policy bundle covering:
  - **Workspace gate** — every request must match the resource's workspace.
  - **Draft visibility** — drafts hidden from non-owners unless editor+.
  - **Publish window** — editors only publish ≥ 9am; admins bypass.
  - **Comment delete** — owner OR editor+ may delete.
- TanStack Query hooks that cache decisions per
  `(subjectId, action, resource, scope)`.
- `<Authorize>` component for declarative UI gating, plus `useCan` and
  `useExplain` hooks.
- The full [`@gentleduck/iam/dt`](../../../src/dt) devtools panel mounted at
  `/iam`, wired to the same engine + metrics aggregator the app uses.

## Run

```bash
bun install   # from the monorepo root
bun --bun run dev
```

Then open <http://localhost:3000>.

Use the **Acting as** dropdown in the top bar to switch subjects:

| User | Role | Workspace | Tier |
|---|---|---|---|
| Alice | admin | alpha | pro |
| Bob | author | alpha | free |
| Cara | editor | beta | pro |
| Dan | reader | alpha | free |

Switch users and watch buttons appear/disappear, posts get hidden by the
workspace gate, and `Why publish?` traces flip from ALLOW to DENY.

## Project layout

```
src/
├── iam/                       # all duck-iam wiring
│   ├── types.ts               # AppAction / AppResource / AppRole + typed Ctx
│   ├── config.ts              # createAccessConfig
│   ├── roles.ts               # RBAC tree
│   ├── policies.ts            # ABAC rules + bundle
│   ├── mock-backend.ts        # in-memory store w/ simulated latency
│   ├── engine.ts              # MemoryAdapter + metrics + Engine
│   ├── auth-context.tsx       # current subject + user switcher state
│   ├── hooks.tsx              # useCan, useExplain, <Authorize>
│   └── queries.ts             # TanStack Query hooks for posts/comments/users
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   └── UserSwitcher.tsx
├── integrations/
│   └── tanstack-query/
│       ├── root-provider.tsx
│       └── devtools.tsx
└── routes/
    ├── __root.tsx
    ├── index.tsx              # landing
    ├── posts.tsx              # list + create + delete (all gated)
    ├── posts.$postId.tsx      # detail + comments + live explain trace
    ├── users.tsx              # assign / revoke RBAC roles
    └── iam.tsx                # <IamDevtools engine={engine} metrics={metrics} />
```

## Swap the mock backend

Replace `MemoryAdapter` in `src/iam/engine.ts` with any other adapter
shipped by `@gentleduck/iam`:

- `@gentleduck/iam/adapters/http` for a network-backed policy/role store
- `@gentleduck/iam/adapters/prisma`, `/drizzle`, `/redis`, `/file`

The rest of the app — components, hooks, devtools — does not change.

## Workspace tracking

The root `package.json` workspace pattern includes `**/examples/*/*` and
`**/examples/*/packages/*` so this nested client is automatically linked
to the workspace copy of `@gentleduck/iam`. Re-run `bun install` after
editing the iam package to refresh the symlink.

## Linting

```bash
bun --bun run lint
bun --bun run format
bun --bun run check
```
