import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./lib/index.ts'],
  format: ['cjs', 'esm'], // Corresponds to CommonJS and ES module formats
  outDir: 'dist',
  sourcemap: false, // Disable sourcemaps
  clean: true, // Clean the output directory before each build
  dts: true, // Generate type definitions
  external: [
    // Exclude dependencies to avoid bundling them
    ...Object.keys(require('./package.json').devDependencies || {}),
    ...Object.keys(require('./package.json').peerDependencies || {}),
    '**/*.stories.tsx', // Exclude stories files
    '**/*.mdx', // Exclude MDX files if necessary
    '**/*.public/**', // Exclude files in public directories if necessary
  ],
  minify: false, // Set to true to enable minification
})
