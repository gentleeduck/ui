## Install

```typescript
import { HttpAdapter } from '@gentleduck/iam/adapters/http'
```

Delegates all storage operations to a remote API via `fetch`. Zero dependencies.

***

## When to use

* Your access engine runs on a dedicated service
* Multiple applications share a single policy store
* Client-side code needs to evaluate permissions against a server (without exposing the database)

***

## Usage

```typescript
import { HttpAdapter } from '@gentleduck/iam/adapters/http'
import { Engine } from '@gentleduck/iam'

const adapter = new HttpAdapter({
  baseUrl: 'https://api.example.com/access',
  headers: {
    Authorization: 'Bearer ' + serviceToken,
  },
})

const engine = new Engine({ adapter })
```

***

## Dynamic headers

Pass a function to compute headers per-request. Useful for rotating tokens or per-request context.

```typescript
const adapter = new HttpAdapter({
  baseUrl: 'https://api.example.com/access',
  headers: async () => ({
    Authorization: 'Bearer ' + (await getServiceToken()),
    'X-Request-Id': crypto.randomUUID(),
  }),
})
```

***

## Custom fetch

Provide your own fetch for environments without a global `fetch`, or to add middleware (logging, retries, tracing).

```typescript
import { HttpAdapter } from '@gentleduck/iam/adapters/http'

const adapter = new HttpAdapter({
  baseUrl: 'https://api.example.com/access',
  fetch: async (url, init) => {
    console.log('Access API request:', url)
    const res = await globalThis.fetch(url, init)
    console.log('Access API response:', res.status)
    return res
  },
})
```

***

## API endpoints

The HTTP adapter expects these REST endpoints on your server:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/policies` | List all policies |
| GET | `/policies/:id` | Get a single policy |
| PUT | `/policies` | Create or update a policy |
| DELETE | `/policies/:id` | Delete a policy |
| GET | `/roles` | List all roles |
| GET | `/roles/:id` | Get a single role |
| PUT | `/roles` | Create or update a role |
| DELETE | `/roles/:id` | Delete a role |
| GET | `/subjects/:id/roles` | Get a subject's roles |
| GET | `/subjects/:id/scoped-roles` | Get a subject's scoped roles |
| POST | `/subjects/:id/roles` | Assign a role (body: `{ roleId, scope? }`) |
| DELETE | `/subjects/:id/roles/:roleId` | Revoke a role (query: `?scope=...`) |
| GET | `/subjects/:id/attributes` | Get subject attributes |
| PATCH | `/subjects/:id/attributes` | Update subject attributes (body: attribute object) |

The built-in Express `adminRouter` covers part of this admin surface, but it does **not** implement the full HTTP adapter contract. To use `HttpAdapter`, either implement the complete endpoint set manually or extend the admin router with the missing item lookups, scoped-role reads, and subject-attribute endpoints.

***

## Error handling

The HTTP adapter throws an `Error` with the message `"@gentleduck/iam HTTP {status}: {responseText}"` for any non-2xx response. It does not retry failed requests. Add retry logic in your custom `fetch` function if needed.

A `Content-Type: application/json` header is sent on every request. If `headers` is a function, it is awaited before each request.

***

## Constructor config

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `baseUrl` | `string` | -- | Base URL for the access API (trailing slash stripped) |
| `headers` | `Record or () -> Record or Promise` | `{}` | Static or dynamic headers |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Custom fetch implementation |

***

## Notes

* `HttpAdapter` fetches authorization data over HTTP, but the consuming engine still evaluates permissions **locally**. It is not an outsourcing-evaluation adapter - it just moves storage behind a service boundary.
* For server-side evaluation across services, expose `engine.permissions()` as an endpoint and consume the resulting `PermissionMap` on clients via the [client integrations](/duck-iam/integrations/client).