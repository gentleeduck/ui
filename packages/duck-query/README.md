<p align="center">
  <img src="../../public/logo-dark.svg" alt="@gentleduck/query" width="120"/>
</p>

<h1 align="center">@gentleduck/query</h1>

<p align="center">
  Type-safe Axios client that pairs with Duck Gen or custom route maps.
</p>

<p align="center">
  <a href="../../LICENSE">MIT</a> -
  <a href="../../CHANGELOG.md">Changelog</a> -
  <a href="../../CONTRIBUTING.md">Contributing</a> -
  <a href="https://gentleduck.org/duck-ui">Docs</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gentleduck/query"><img src="https://img.shields.io/npm/v/@gentleduck/query.svg" alt="npm"/></a>
  <a href="https://www.npmjs.com/package/@gentleduck/query"><img src="https://img.shields.io/npm/dm/@gentleduck/query.svg" alt="downloads"/></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/npm/l/@gentleduck/query.svg" alt="MIT"/></a>
</p>

---

Duck Query is a type-safe Axios client that pairs with Duck Gen or custom route
maps. It gives you typed request bodies, params, query strings, and responses.

## Install

```bash
bun add @gentleduck/query
```

## Quick start

```ts
import { createDuckQueryClient } from '@gentleduck/query'
import type { ApiRoutes } from '@gentleduck/gen/nestjs'

const client = createDuckQueryClient<ApiRoutes>({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

const { data } = await client.post('/api/auth/signin', {
  body: {
    username: 'duck',
    password: '123456',
  },
})
```

## Request shape

Each request can include `body`, `query`, `params`, and `headers`:

```ts
await client.get('/api/users/:id', {
  params: { id: 'u_123' },
  query: { with: 'profile' },
  headers: { authorization: 'Bearer token' },
})
```

## Client methods

- `get(path, req?, config?)`
- `post(path, req, config?)`
- `put(path, req, config?)`
- `patch(path, req, config?)`
- `del(path, req?, config?)`
- `request(path, req?, config?)`
- `byMethod(method, path, req?, config?)`
- `axios` (the underlying Axios instance)

## Types

Duck Query exports helper types if you want to define routes yourself:

```ts
import type { DuckApiRoutes, DuckRouteMeta, RouteReq, RouteRes } from '@gentleduck/query'
```

## Docs

See the full docs in `apps/duck-gen-docs/content/docs/duck-query.mdx`.

