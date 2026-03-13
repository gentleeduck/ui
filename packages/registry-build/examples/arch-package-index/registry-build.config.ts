import { defineConfig } from '../../src'
import { archRepositoryExtension } from './arch-repository.extension'

export default defineConfig({
  collections: {
    packages: {
      data: './data/packages.json',
      metadata: {
        repoOrder: ['core', 'extra'],
      },
      sources: {
        pkgbuilds: {
          glob: '**/PKGBUILD',
          path: './pkgbuilds',
          referencePath: '/pkgbuilds',
        },
      },
    },
  },
  extensions: [
    archRepositoryExtension({
      collection: 'packages',
    }),
  ],
  output: {
    dir: './dist',
  },
})
