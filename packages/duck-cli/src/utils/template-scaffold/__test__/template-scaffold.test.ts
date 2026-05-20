import type { Ora } from 'ora'
import { describe, expect, it } from 'vitest'
import { scaffoldTemplate } from '~/utils/template-scaffold'

/** Minimal Ora stub: template-name validation throws before any spinner method is used. */
const spinnerStub = {} as Ora

describe('scaffoldTemplate template-name validation', () => {
  it('rejects a template name containing regex metacharacters', async () => {
    await expect(scaffoldTemplate({ template: '.*', cwd: process.cwd(), yes: true }, spinnerStub)).rejects.toThrow(
      /Invalid template name/,
    )
  })

  it('rejects a template name with path separators', async () => {
    await expect(scaffoldTemplate({ template: '../evil', cwd: process.cwd(), yes: true }, spinnerStub)).rejects.toThrow(
      /Invalid template name/,
    )
  })

  it('rejects a template name with an unbalanced regex group', async () => {
    await expect(scaffoldTemplate({ template: 'acme(', cwd: process.cwd(), yes: true }, spinnerStub)).rejects.toThrow(
      /Invalid template name/,
    )
  })
})
