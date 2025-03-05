import { defineConfig } from 'velite'
import { docs } from '~/velite-configs'

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

const config = defineConfig({
  collections: {
    docs,
  },
})

export default config
