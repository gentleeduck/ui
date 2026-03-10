/**
 * Phase entrypoints are exported from folder modules. Each non-trivial phase
 * owns its local `*.types.ts` and `*.lib.ts` files beside the phase runner.
 */
export * from './banner/index'
export * from './colors/index'
export * from './component-index/index'
export * from './components/index'
export * from './index-build/index'
export * from './validate/index'
