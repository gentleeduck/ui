import { type } from 'arktype'

const User = type({
  name: 'string | string',
  platform: "'android' | 'ios'",
  'versions?': 'string | number | null',
})
