# MCP Architecture

This folder contains the acme MCP server implementation for `ui.acme.com/api/mcp`.

## Files

- `server.ts`: tool definitions, document indexing, search logic, rate limiting helpers, and shared MCP metadata
- `docs-index-persistence.ts`: persistent docs-index snapshots stored on disk outside process memory
- `route.ts`: Streamable HTTP entrypoint with per-session transport reuse
- `session-store.ts`: in-memory MCP session registry and TTL cleanup
- `health/route.ts`: runtime health probe for docs/index/session visibility, including cache age, TTL, and load source
- `server.test.ts`: pure unit tests for parsing, indexing helpers, and scoring
- `server.integration.test.ts`: in-memory MCP SDK tests for all tool handlers
- `route.integration.test.ts`: HTTP transport tests against the actual route handlers

## Request Flow

1. A client sends `POST /api/mcp` with an `initialize` request.
2. `route.ts` creates a session-scoped MCP server and Streamable HTTP transport.
3. `session-store.ts` keeps that connected pair keyed by `Mcp-Session-Id`.
4. Later `POST`, `GET`, and `DELETE` requests reuse the same session transport.
5. Session entries are evicted on explicit `DELETE` or after the TTL expires.

Browser clients rely on CORS exposing `Mcp-Session-Id`, otherwise they cannot reuse the initialized transport session.

## Search Pipeline

1. Docs are read from `content/docs`.
2. Frontmatter and MDX-only wrappers are stripped into token-efficient markdown.
3. A persistent snapshot is loaded from disk when available, keyed by content directory.
4. Only changed docs are reparsed; unchanged docs reuse the persisted snapshot entry.
5. A cached index is built with:
   - `docs`
   - `docsBySlug`
   - `docsByCategory`
   - `termToDocIndexes`
   - TF-IDF vectors for semantic search
6. `search_docs` and `suggest_components` use the inverted index first, then fall back to a full scan when typo-only queries need fuzzy matching.
7. `semantic_search` uses the same inverted index as a candidate prefilter before scoring TF-IDF cosine similarity.

## Constraints

- Session state is process-local and in-memory.
- The MCP SDK transport is connection-bound, so a single global connected `McpServer` instance is not safe.
- Docs index persistence is filesystem-backed, so it survives process restarts on the same host but is not a distributed shared cache.
- Keyword and semantic lookup both reuse the same cached inverted term index.
