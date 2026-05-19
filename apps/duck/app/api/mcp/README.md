# MCP Architecture

This folder contains the duck-ui MCP server implementation for `gentleduck.org/api/mcp`.

## Files

### Server & Transport
- `server.ts`: MCP tool handler registrations and re-exports for all utility modules
- `route.ts`: Streamable HTTP entrypoint with per-session transport reuse
- `session-store.ts`: in-memory MCP session registry and TTL cleanup
- `health/route.ts`: runtime health probe for docs/index/session visibility

### Search Pipeline Modules
- `text.ts`: frontmatter parsing, MDX stripping, code block extraction, section/summary extraction
- `tokenize.ts`: stemming, stop word filtering, bigram generation, synonym expansion
- `tfidf.ts`: TF-IDF vector computation (term frequency, inverse document frequency, cosine similarity)
- `fuzzy.ts`: Levenshtein edit distance, fuzzy matching, weighted keyword scoring
- `docs-index.ts`: doc types, file system access, index building/caching, changelog helpers, stats

### Infrastructure
- `rate-limit.ts`: per-IP rate limiting, slug validation, request logging
- `docs-index-persistence.ts`: persistent docs-index snapshots stored on disk outside process memory

### Tests
- `__test__/server.test.ts`: pure unit tests for parsing, indexing helpers, and scoring
- `__test__/server.integration.test.ts`: in-memory MCP SDK tests for all tool handlers
- `__test__/route.integration.test.ts`: HTTP transport tests against the actual route handlers

## Request Flow

1. A client sends `POST /api/mcp` with an `initialize` request.
2. `route.ts` creates a session-scoped MCP server and Streamable HTTP transport.
3. `session-store.ts` keeps that connected pair keyed by `Mcp-Session-Id`.
4. Later `POST`, `GET`, and `DELETE` requests reuse the same session transport.
5. Session entries are evicted on explicit `DELETE` or after the TTL expires.

Browser clients rely on CORS exposing `Mcp-Session-Id`, otherwise they cannot reuse the initialized transport session.

## Search Pipeline

1. Docs are read from `content/docs` (`docs-index.ts`).
2. Frontmatter and MDX-only wrappers are stripped into token-efficient markdown (`text.ts`).
3. Text is tokenized with stemming, stop word removal, and bigram generation (`tokenize.ts`).
4. A persistent snapshot is loaded from disk when available, keyed by content directory.
5. Only changed docs are reparsed; unchanged docs reuse the persisted snapshot entry.
6. A cached index is built with:
   - `docs`, `docsBySlug`, `docsByCategory`
   - `termToDocIndexes` (inverted index)
   - TF-IDF vectors for semantic search (`tfidf.ts`)
7. `search_docs` and `suggest_components` use the inverted index first, then fall back to a full scan when typo-only queries need fuzzy matching (`fuzzy.ts`).
8. `semantic_search` uses the same inverted index as a candidate prefilter before scoring TF-IDF cosine similarity.

## Constraints

- Session state is process-local and in-memory.
- The MCP SDK transport is connection-bound, so a single global connected `McpServer` instance is not safe.
- Docs index persistence is filesystem-backed, so it survives process restarts on the same host but is not a distributed shared cache.
- Keyword and semantic lookup both reuse the same cached inverted term index.
