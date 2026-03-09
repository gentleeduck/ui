import { describe, expect, test } from 'bun:test'
import { registry } from '../../index'
import { block_schema, REGISTRY_ITEM_TYPES, registry_item_file_schema, registry_schema } from '../registry-schema'

describe('registers', () => {
  test('registry schema parses the aggregate registry export', () => {
    const parsed = registry_schema.parse(registry)

    expect(parsed.uis.length).toBeGreaterThan(20)
    expect(parsed.examples.length).toBeGreaterThan(20)
    expect(parsed.blocks.length).toBeGreaterThan(5)
    expect(parsed.internal.length).toBeGreaterThan(0)
  })

  test('registry item types stay unique and stable', () => {
    expect(new Set(REGISTRY_ITEM_TYPES).size).toBe(REGISTRY_ITEM_TYPES.length)
    expect(REGISTRY_ITEM_TYPES).toContain('registry:ui')
    expect(REGISTRY_ITEM_TYPES).toContain('registry:block')
    expect(REGISTRY_ITEM_TYPES).toContain('registry:example')
  })

  test('all aggregate entries have names, root folders, and valid types', () => {
    for (const entry of [...registry.uis, ...registry.examples, ...registry.blocks, ...registry.internal]) {
      expect(entry.name.length).toBeGreaterThan(0)
      expect(entry.root_folder.length).toBeGreaterThan(0)
      expect(REGISTRY_ITEM_TYPES).toContain(entry.type)
    }
  })

  test('registry item files reject unknown types', () => {
    const parsed = registry_item_file_schema.safeParse({
      path: 'button.tsx',
      type: 'registry:unknown',
    })

    expect(parsed.success).toBe(false)
  })

  test('block schema requires registry:block entries with highlighted output', () => {
    const valid = block_schema.safeParse({
      code: 'export function Demo() {}',
      component: { name: 'Demo' },
      container: { className: 'h-10', height: '40px' },
      description: 'Demo block',
      file: 'demo.tsx',
      highlightedCode: '<span>demo</span>',
      name: 'demo-block',
      root_folder: 'registry-blocks',
      type: 'registry:block',
    })
    expect(valid.success).toBe(true)

    const invalid = block_schema.safeParse({
      code: 'export function Demo() {}',
      component: { name: 'Demo' },
      description: 'Demo block',
      file: 'demo.tsx',
      name: 'demo-block',
      root_folder: 'registry-blocks',
      type: 'registry:ui',
    })
    expect(invalid.success).toBe(false)
  })
})
