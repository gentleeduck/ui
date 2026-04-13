import { describe, expect, it } from 'vitest'
import { addCommand } from '~/commands/add'
import { diffCommand } from '~/commands/diff'
import { initCommand } from '~/commands/init'
import { removeCommand } from '~/commands/remove'
import { updateCommand } from '~/commands/update'

function normalizeHelpOutput(help: string): string {
  return help.replace(/(default:\s*\n\s*")([^"]+)(")/g, '$1<CWD>$3')
}

describe('command help output', () => {
  it('includes workspace option in all relevant commands', () => {
    const helps = {
      add: normalizeHelpOutput(addCommand().helpInformation()),
      diff: normalizeHelpOutput(diffCommand().helpInformation()),
      init: normalizeHelpOutput(initCommand().helpInformation()),
      remove: normalizeHelpOutput(removeCommand().helpInformation()),
      update: normalizeHelpOutput(updateCommand().helpInformation()),
    }

    expect(helps).toMatchSnapshot()

    expect(helps.init).toContain('-w, --workspace <path>')
    expect(helps.add).toContain('-w, --workspace <path>')
    expect(helps.update).toContain('-w, --workspace <path>')
    expect(helps.remove).toContain('-w, --workspace <path>')
    expect(helps.diff).toContain('-w, --workspace <path>')
  })
})
