import { describe, expect, it } from 'vitest'
import { addArgumentsSchema, addOptionsSchema } from '~/commands/add/add.dto'
import { diffArgumentsSchema, diffOptionsSchema } from '~/commands/diff/diff.dto'
import { initArgumentsSchema, initOptionsSchema } from '~/commands/init/init.dto'
import { removeArgumentsSchema, removeOptionsSchema } from '~/commands/remove/remove.dto'
import { updateArgumentsSchema, updateOptionsSchema } from '~/commands/update/update.dto'
import { registryEntrySchema } from '~/utils/get-registry/get-registry.dto'
import { type DuckUI, duckUiSchema } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.dto'
import { createMockDuckUIConfig, createMockRegistryEntry } from '../helpers/fixtures'

describe('initOptionsSchema', () => {
  it('provides defaults for empty input', () => {
    const result = initOptionsSchema.parse({})
    expect(result.yes).toBe(false)
    expect(typeof result.cwd).toBe('string')
    expect(result.cwd.length).toBeGreaterThan(0)
  })

  it('accepts valid options', () => {
    const result = initOptionsSchema.parse({ yes: true, cwd: '/tmp/test' })
    expect(result.yes).toBe(true)
    expect(result.cwd).toBe('/tmp/test')
  })
})

describe('initArgumentsSchema', () => {
  it('defaults to empty array', () => {
    const result = initArgumentsSchema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts array of strings', () => {
    const result = initArgumentsSchema.parse(['button', 'input'])
    expect(result).toEqual(['button', 'input'])
  })
})

describe('addOptionsSchema', () => {
  it('provides defaults', () => {
    const result = addOptionsSchema.parse({})
    expect(result.yes).toBe(false)
    expect(result.force).toBe(false)
  })

  it('accepts valid options', () => {
    const result = addOptionsSchema.parse({ yes: true, force: true })
    expect(result.yes).toBe(true)
    expect(result.force).toBe(true)
  })
})

describe('addArgumentsSchema', () => {
  it('defaults to empty array', () => {
    const result = addArgumentsSchema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts component names', () => {
    const result = addArgumentsSchema.parse(['button', 'card'])
    expect(result).toEqual(['button', 'card'])
  })
})

describe('registryEntrySchema', () => {
  it('parses valid registry entry', () => {
    const entry = createMockRegistryEntry()
    const result = registryEntrySchema.parse(entry)
    expect(result.name).toBe('button')
    expect(result.type).toBe('registry:ui')
    expect(result.root_folder).toBe('button')
  })

  it('rejects entry without required name', () => {
    const entry = { ...createMockRegistryEntry(), name: undefined }
    expect(() => registryEntrySchema.parse(entry)).toThrow()
  })

  it('rejects entry without required type', () => {
    const entry = { ...createMockRegistryEntry(), type: undefined }
    expect(() => registryEntrySchema.parse(entry)).toThrow()
  })

  it('rejects invalid type value', () => {
    const entry = { ...createMockRegistryEntry(), type: 'invalid' }
    expect(() => registryEntrySchema.parse(entry)).toThrow()
  })

  it('allows optional fields to be missing', () => {
    const entry = {
      name: 'minimal',
      type: 'registry:ui' as const,
      root_folder: 'minimal',
    }
    const result = registryEntrySchema.parse(entry)
    expect(result.name).toBe('minimal')
    expect(result.dependencies).toBeUndefined()
    expect(result.files).toBeUndefined()
  })
})

describe('duckUiSchema', () => {
  it('parses a valid full config', () => {
    const config = createMockDuckUIConfig()
    const result = duckUiSchema.parse(config)
    expect(result.rsc).toBe(true)
    expect(result.aliases.ui).toBe('~/ui')
    expect(result.tailwind.baseColor).toBe('zinc')
  })

  it('rejects config missing the aliases field', () => {
    const { aliases, ...configWithoutAliases } = createMockDuckUIConfig()
    expect(() => duckUiSchema.parse(configWithoutAliases)).toThrow()
  })

  it('rejects config with invalid tailwind baseColor', () => {
    const config = createMockDuckUIConfig({
      tailwind: {
        baseColor: 'invalid-color' as DuckUI['tailwind']['baseColor'],
        css: './src/styles.css',
        cssVariables: true,
        prefix: '',
      },
    })
    expect(() => duckUiSchema.parse(config)).toThrow()
  })

  it('rejects config with non-URL schema field', () => {
    const config = createMockDuckUIConfig({ schema: 'not-a-url' })
    expect(() => duckUiSchema.parse(config)).toThrow()
  })

  it('accepts all valid BASE_COLORS values', () => {
    const colors: DuckUI['tailwind']['baseColor'][] = [
      'zinc',
      'slate',
      'stone',
      'gray',
      'neutral',
      'red',
      'rose',
      'orange',
      'green',
      'blue',
      'yellow',
      'violet',
    ]
    for (const color of colors) {
      const config = createMockDuckUIConfig({
        tailwind: { baseColor: color, css: './src/styles.css', cssVariables: true, prefix: '' },
      })
      expect(() => duckUiSchema.parse(config)).not.toThrow()
    }
  })
})

// -- remove command schemas --

describe('removeOptionsSchema', () => {
  it('provides defaults for empty input', () => {
    const result = removeOptionsSchema.parse({})
    expect(result.yes).toBe(false)
    expect(typeof result.cwd).toBe('string')
    expect(result.cwd.length).toBeGreaterThan(0)
  })

  it('accepts valid options', () => {
    const result = removeOptionsSchema.parse({ yes: true, cwd: '/tmp/test' })
    expect(result.yes).toBe(true)
    expect(result.cwd).toBe('/tmp/test')
  })

  it('defaults yes to false', () => {
    const result = removeOptionsSchema.parse({ cwd: '/tmp' })
    expect(result.yes).toBe(false)
  })
})

describe('removeArgumentsSchema', () => {
  it('defaults to empty array', () => {
    const result = removeArgumentsSchema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts component names', () => {
    const result = removeArgumentsSchema.parse(['button', 'input'])
    expect(result).toEqual(['button', 'input'])
  })
})

// -- update command schemas --

describe('updateOptionsSchema', () => {
  it('provides defaults for empty input', () => {
    const result = updateOptionsSchema.parse({})
    expect(result.yes).toBe(false)
    expect(result.all).toBe(false)
    expect(typeof result.cwd).toBe('string')
    expect(result.cwd.length).toBeGreaterThan(0)
  })

  it('accepts valid options', () => {
    const result = updateOptionsSchema.parse({ yes: true, all: true, cwd: '/tmp/test' })
    expect(result.yes).toBe(true)
    expect(result.all).toBe(true)
    expect(result.cwd).toBe('/tmp/test')
  })

  it('defaults all to false', () => {
    const result = updateOptionsSchema.parse({ cwd: '/tmp' })
    expect(result.all).toBe(false)
  })
})

describe('updateArgumentsSchema', () => {
  it('defaults to empty array', () => {
    const result = updateArgumentsSchema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts component names', () => {
    const result = updateArgumentsSchema.parse(['button', 'card'])
    expect(result).toEqual(['button', 'card'])
  })
})

// -- diff command schemas --

describe('diffOptionsSchema', () => {
  it('provides defaults for empty input', () => {
    const result = diffOptionsSchema.parse({})
    expect(typeof result.cwd).toBe('string')
    expect(result.cwd.length).toBeGreaterThan(0)
  })

  it('accepts valid options', () => {
    const result = diffOptionsSchema.parse({ cwd: '/tmp/test' })
    expect(result.cwd).toBe('/tmp/test')
  })
})

describe('diffArgumentsSchema', () => {
  it('defaults to empty array', () => {
    const result = diffArgumentsSchema.parse(undefined)
    expect(result).toEqual([])
  })

  it('accepts component names', () => {
    const result = diffArgumentsSchema.parse(['button'])
    expect(result).toEqual(['button'])
  })
})
