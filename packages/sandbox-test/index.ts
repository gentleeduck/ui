import { type } from 'arktype'

const User = type({
  name: '(string | number)[]',
  platform: "'android' | 'ios'",
  'versions?': 'string | number | null',
})
