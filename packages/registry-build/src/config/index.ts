/**
 * Public config surface. Folder modules such as `loader/`, `merge/`, and
 * `resolution/` keep their internal libs and support files local, while this
 * index only re-exports the stable top-level API.
 */
export * from './defaults'
export * from './loader/loader'
export * from './loader/loader.types'
export * from './merge/merge'
export * from './presets'
export * from './resolution/resolution'
export * from './schema'
export * from './types'
