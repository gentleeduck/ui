import { examples } from '@/registry/examples'
import { Registry } from '@/registry/schema'
import { ui } from '@/registry/ui'

export const registry: Registry = [...ui, ...examples]
