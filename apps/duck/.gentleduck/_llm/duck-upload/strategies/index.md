A strategy is the piece that actually moves bytes. The engine stays protocol-agnostic: your
backend returns an intent, the engine reads its `strategy` field, looks the strategy up in the
registry, and calls `start()`. Swapping S3 POST for multipart, TUS, or a custom endpoint never
touches engine code.

## What a strategy does

Each strategy:

* Turns an intent into network calls via the injected `ctx.transport`.
* Reports progress with `ctx.reportProgress` and, if resumable, persists a cursor with
  `ctx.persistCursor`.
* Honors `ctx.signal` so pause and cancel abort cleanly.

The shape is `Contracts.Strategy.Me<M, C, P, R, K>`:

```ts
{
  id: K              // must equal the intent's `strategy` value
  resumable: boolean
  start(ctx): Promise<void>
}
```

## Built-in strategies

| Strategy | Factory | Use case | Resumable |
| --- | --- | --- | --- |
| [POST](/duck-upload/strategies/post) | `PostStrategy()` | Presigned form uploads (small/medium) | No |
| [Multipart](/duck-upload/strategies/multipart) | `multipartStrategy(opts?)` | Large files, concurrent parts | Yes |

Note the casing: `PostStrategy` (also a type namespace) and `multipartStrategy` (its type
namespace is `MultipartStrategy`).

## Registering

`createStrategyRegistry()` returns an empty typed registry; add strategies with `.set()`:

```ts
import { PostStrategy, multipartStrategy, createStrategyRegistry } from '@gentleduck/upload/strategies'

const strategies = createStrategyRegistry<Intents, Cursors, Purpose, Result>()
strategies.set(PostStrategy())
strategies.set(multipartStrategy({ maxPartConcurrency: 4 }))
```

The registry's key types come from your intent map `M`, so the backend intent response and the
registered strategies stay in sync at compile time. If the backend returns a `strategy` that
isn't registered, the item fails with a `strategy_missing` error.

See [Strategy Registry](/duck-upload/strategies/registry) for the registry API and writing your
own strategy.