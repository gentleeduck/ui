/**
 * Package entrypoint for `@gentleduck/iam`.
 *
 * Re-exports the core access-control engine, built-in adapters (file, memory),
 * and shared utilities (LRU cache, permission-key builder). Subpath imports
 * remain available for tree-shakable consumers (for example
 * `@gentleduck/iam/invalidators/redis`).
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type { File } from './adapters/file'
export { FileAdapter } from './adapters/file'
export type { Memory } from './adapters/memory'
export { MemoryAdapter } from './adapters/memory'
export * from './core'
export { LRUCache } from './shared/cache'
export { buildPermissionKey } from './shared/keys'
