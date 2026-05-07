---
"@gentleduck/docs": major
---

**Breaking:** drop `buildSidebar`, `SidebarDoc`, and `BuildSidebarOptions` exports.

The auto-generated sidebar utility is removed. Consumers should declare per-package sidebars statically via typed config files instead — see the `apps/duck/config/sidebars/<pkg>.ts` pattern in the repo.

Migration:

```diff
- import { buildSidebar } from '@gentleduck/docs'
- const sidebar = buildSidebar(docs, { pkg: 'duck-cli' })
+ // apps/your-app/config/sidebars/duck-cli.ts
+ import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'
+ export const duckCliSidebar: IDocsConfig = {
+   mainNav: [], chartsNav: [],
+   sidebarNav: [
+     { title: '', href: '/duck-cli/introduction', items: [
+       { title: 'Introduction', href: '/duck-cli/introduction', items: [] },
+     ]},
+   ],
+ }
```

`DocsPagerTop`, `DocsPagerBottom`, and `DocsSidebarNav` still accept a `config` prop so per-package sidebars wire in cleanly.

`IDocsConfig`, `ISidebarNavItem`, `INavItem`, and the rest of the type exports are unchanged.
