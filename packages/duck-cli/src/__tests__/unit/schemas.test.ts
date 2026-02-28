import { describe, expect, it } from 'vitest'
import { add_arguments_schema, add_options_schema } from '~/commands/add/add.dto'
import { init_arguments_schema, init_options_schema } from '~/commands/init/init.dto'
import { registry_entry_schema } from '~/utils/get-registry/get-registry.dto'
import { createMockRegistryEntry } from '../helpers/fixtures'

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
