import { config } from '@gentleduck/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,

  clean: true,
  dts: true,
  entry: ['./src/*/index.ts'],

  // entry: ['./src/react', './src/primitive'],
})

// export default defineConfig({
//   ...config,
//   declaration: true,
// })

// import { defineConfig } from 'tsdown'
//
// export default defineConfig({
//   rootDir: 'src',
//   outDir: 'dist',
//
//   entry: ['src/**/*.{ts,tsx}', '!src/examples/**/*.{ts,tsx}'],
//   declaration: true,
//   clean: true,
//
//   // 👇 important to disable chunks
//   splitting: false,
//
//   // 👇 optional: don't emit source maps
//   sourceMap: false,
//
//   // 👇 optional: disables file name hashing
//   treeshake: false, // optional if you want raw files
//   minify: false, // prevents rollup/tsup-style minification
// })
