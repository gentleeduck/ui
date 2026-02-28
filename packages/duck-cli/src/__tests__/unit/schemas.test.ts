import { describe, expect, it } from 'vitest'
import { add_arguments_schema, add_options_schema } from '~/commands/add/add.dto'
import { init_arguments_schema, init_options_schema } from '~/commands/init/init.dto'
import { registry_entry_schema } from '~/utils/get-registry/get-registry.dto'
import { duck_ui_schema } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.dto'
import { createMockDuckUIConfig, createMockRegistryEntry } from '../helpers/fixtures'

describe('init_options_schema', () => {
  it('provides defaults for empty input', () => {
    const result = init_options_schema.parse({})
    expect(result.yes).toBe(false)
    expect(typeof result.cwd).toBe('string')
    expect(result.cwd.length).toBeGreaterThan(0)
  })

  it('accepts valid options', () => {
    const result = init_options_schema.parse({ yes: true, cwd: '/tmp/test' })
    expect(result.yes).toBe(true)
    expect(result.cwd).toBe('/tmp/test')
  })
})

describe('init_arguments_schema', () => {
  it('defaults to empty array', () => {
    const result = init_arguments_schema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts array of strings', () => {
    const result = init_arguments_schema.parse(['button', 'input'])
    expect(result).toEqual(['button', 'input'])
  })
})

describe('add_options_schema', () => {
  it('provides defaults', () => {
    const result = add_options_schema.parse({})
    expect(result.yes).toBe(false)
    expect(result.force).toBe(false)
  })

  it('accepts valid options', () => {
    const result = add_options_schema.parse({ yes: true, force: true })
    expect(result.yes).toBe(true)
    expect(result.force).toBe(true)
  })
})

describe('add_arguments_schema', () => {
  it('defaults to empty array', () => {
    const result = add_arguments_schema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts component names', () => {
    const result = add_arguments_schema.parse(['button', 'card'])
    expect(result).toEqual(['button', 'card'])
  })
})

describe('registry_entry_schema', () => {
  it('parses valid registry entry', () => {
    const entry = createMockRegistryEntry()
    const result = registry_entry_schema.parse(entry)
    expect(result.name).toBe('button')
    expect(result.type).toBe('registry:ui')
    expect(result.root_folder).toBe('button')
  })

  it('rejects entry without required name', () => {
    const entry = { ...createMockRegistryEntry(), name: undefined }
    expect(() => registry_entry_schema.parse(entry)).toThrow()
  })

  it('rejects entry without required type', () => {
    const entry = { ...createMockRegistryEntry(), type: undefined }
    expect(() => registry_entry_schema.parse(entry)).toThrow()
  })

  it('rejects invalid type value', () => {
    const entry = { ...createMockRegistryEntry(), type: 'invalid' }
    expect(() => registry_entry_schema.parse(entry)).toThrow()
  })

  it('allows optional fields to be missing', () => {
    const entry = {
      name: 'minimal',
      type: 'registry:ui' as const,
      root_folder: 'minimal',
    }
    const result = registry_entry_schema.parse(entry)
    expect(result.name).toBe('minimal')
    expect(result.dependencies).toBeUndefined()
    expect(result.files).toBeUndefined()
  })
})

describe('duck_ui_schema', () => {
  it('parses a valid full config', () => {
    const config = createMockDuckUIConfig()
    const result = duck_ui_schema.parse(config)
    expect(result.rsc).toBe(true)
    expect(result.aliases.ui).toBe('~/ui')
    expect(result.tailwind.baseColor).toBe('zinc')
  })

  it('rejects config missing the aliases field', () => {
    const config = createMockDuckUIConfig()
    delete (config as any).aliases
    expect(() => duck_ui_schema.parse(config)).toThrow()
  })

  it('rejects config with invalid tailwind baseColor', () => {
    const config = createMockDuckUIConfig({
      tailwind: {
        baseColor: 'invalid-color',
        css: './src/styles.css',
        cssVariables: true,
        prefix: '',
      },
    })
    expect(() => duck_ui_schema.parse(config)).toThrow()
  })

  it('rejects config with non-URL schema field', () => {
    const config = createMockDuckUIConfig({ schema: 'not-a-url' })
    expect(() => duck_ui_schema.parse(config)).toThrow()
  })

  it('accepts all valid BASE_COLORS values', () => {
    const colors = ['zinc', 'slate', 'stone', 'gray', 'neutral', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet']
    for (const color of colors) {
      const config = createMockDuckUIConfig({
        tailwind: { baseColor: color, css: './src/styles.css', cssVariables: true, prefix: '' },
      })
      expect(() => duck_ui_schema.parse(config)).not.toThrow()
    }
  })
})
