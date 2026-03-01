import { describe, expect, it } from 'vitest'
import { add_command } from '~/commands/add'
import { diff_command } from '~/commands/diff'
import { init_command } from '~/commands/init'
import { remove_command } from '~/commands/remove'
import { update_command } from '~/commands/update'

describe('command help output', () => {
  it('includes workspace option in all relevant commands', () => {
    const helps = {
      add: add_command().helpInformation(),
      diff: diff_command().helpInformation(),
      init: init_command().helpInformation(),
      remove: remove_command().helpInformation(),
      update: update_command().helpInformation(),
    }

    expect(helps).toMatchSnapshot()

    expect(helps.init).toContain('-w, --workspace <path>')
    expect(helps.add).toContain('-w, --workspace <path>')
    expect(helps.update).toContain('-w, --workspace <path>')
    expect(helps.remove).toContain('-w, --workspace <path>')
    expect(helps.diff).toContain('-w, --workspace <path>')
  })
})
