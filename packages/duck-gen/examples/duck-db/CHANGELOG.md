# Changelog

All notable changes to this project will be documented in this file.

# 2026-01-19

## Improvements

- Updated `seed.ts` to match current database schema:
    - Removed `accessTokens` table and seeding logic (table removed).
    - Updated `sessions` seeding to use `sessionTokenHash` instead of `refreshTokenHash` and `prevRefreshTokenHash`.
    - Removed `rotatedAt` from `sessions` seeding (field removed).
    - Cleaned up duplicate imports and insert calls.

# Changelog - 2026-01-17

## Database Schema Performance Optimization

### Added
- **Composite Index on Tokens Table**: Added `tokens_user_purpose_status_kind_idx` index
  - Columns: `(userId, purpose, status)`
  - Partial index expression: `(meta->>'kind')`
  - Location: `src/schema/control/auth/auth.sessions.ts`

### Rationale
- **Query Performance**: This composite index significantly improves query performance for common authentication token lookups
- **Use Case**: Optimizes queries that filter tokens by user, purpose, and status - a frequent pattern in authentication flows
- **Partial Index**: The partial expression on `meta->>'kind'` allows efficient filtering on JSONB metadata without full table scans
- **Impact**: Reduces query time for token validation, refresh, and cleanup operations

### Migration Required
This change requires running database migrations to apply the new index to existing databases.

