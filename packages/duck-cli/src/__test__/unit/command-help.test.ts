import { describe, expect, it } from 'vitest'
import { add_command } from '~/commands/add'
import { diff_command } from '~/commands/diff'
import { init_command } from '~/commands/init'
import { remove_command } from '~/commands/remove'
import { update_command } from '~/commands/update'

function normalize_help_output(help: string): string {
  return help.replace(/(default:\s*\n\s*")([^"]+)(")/g, '$1<CWD>$3')
}

describe('command help output', () => {
  it('includes workspace option in all relevant commands', () => {
    const helps = {
      add: normalize_help_output(add_command().helpInformation()),
      diff: normalize_help_output(diff_command().helpInformation()),
      init: normalize_help_output(init_command().helpInformation()),
      remove: normalize_help_output(remove_command().helpInformation()),
      update: normalize_help_output(update_command().helpInformation()),
    }

    expect(helps).toMatchSnapshot()

    expect(helps.init).toContain('-w, --workspace <path>')
    expect(helps.add).toContain('-w, --workspace <path>')
    expect(helps.update).toContain('-w, --workspace <path>')
    expect(helps.remove).toContain('-w, --workspace <path>')
    expect(helps.diff).toContain('-w, --workspace <path>')
  })
})
