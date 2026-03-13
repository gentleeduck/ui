/**
 * Framework adapters for generating component-index output files.
 *
 * Each adapter knows how to render framework-specific dynamic imports
 * (Next.js, Vite) for the generated component loader.
 */
export * from './component-index'
export * from './component-index.types'
export * from './nextjs'
export * from './vite'
