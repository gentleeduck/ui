<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/docs" width="120"/>
</p>

<h1 align="center">@gentleduck/docs</h1>

<p align="center">
  Shared docs app kit used by the gentleduck/ui docs apps.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/docs"><img src="https://img.shields.io/npm/v/@gentleduck/docs.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/docs"><img src="https://img.shields.io/npm/dm/@gentleduck/docs.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/docs.svg" alt="MIT"/></a>
</p>

---

Shared docs app kit for building documentation sites.

Provides MDX rendering, page layouts, navigation, search, AI chat, theming, and Velite content pipeline -- everything needed to build a gentleduck docs app on Next.js.

## Quick Start

```bash
bun add @gentleduck/docs
```

```tsx
import { DocsProvider } from '@gentleduck/docs/client'
import { Mdx } from '@gentleduck/docs/client'
```

## What it includes

- **MDX components** -- code blocks with syntax highlighting (Shiki), callouts, tabs, component previews, linked cards
- **Page layouts** -- site header/footer, sidebar navigation, table of contents, breadcrumbs, pager
- **Search** -- command menu with full-text search (Lunr)
- **AI chat** -- built-in chat panel
- **Theming** -- theme provider, mode toggle, color system, CSS variables
- **Velite pipeline** -- content schemas, rehype/remark plugins, MDX runtime
- **Utilities** -- event tracking, chart color helpers, date formatting

## Entry points

| Entry point | Description |
| --- | --- |
| `@gentleduck/docs` | Types, config helpers, lib utilities (server-safe) |
| `@gentleduck/docs/client` | React components, hooks, providers (`'use client'`) |
| `@gentleduck/docs/velite` | Velite content pipeline config |
| `@gentleduck/docs/styles/base.css` | Base stylesheet |
| `@gentleduck/docs/styles/docs.css` | Docs layout styles |
| `@gentleduck/docs/styles/mdx.css` | MDX content styles |

## License

MIT
