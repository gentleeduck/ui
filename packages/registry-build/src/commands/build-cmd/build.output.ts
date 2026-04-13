import kleur from 'kleur'
import type { IBuildResult } from '../../pipeline'

type RegistryBuildSerializableResult = Pick<
  IBuildResult,
  'artifacts' | 'configPath' | 'outputPaths' | 'outputs' | 'paths' | 'phaseResults'
>

/**
 * Drop runtime-only objects from the build result for JSON CLI output. The
 * serialized shape stays local to this module because nothing else should
 * depend on the CLI JSON contract.
 */
export function toSerializableResult(result: IBuildResult) {
  return {
    artifacts: result.artifacts,
    configPath: result.configPath,
    outputs: result.outputs,
    outputPaths: result.outputPaths,
    paths: result.paths,
    phaseResults: result.phaseResults,
  } satisfies RegistryBuildSerializableResult
}

function stripAnsi(value: string) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI escape sequences requires control characters
  return value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, '')
}

function padCell(value: string, width: number, align: 'left' | 'right' = 'left') {
  const plainValue = stripAnsi(value)

  return align === 'right'
    ? `${' '.repeat(Math.max(0, width - plainValue.length))}${value}`
    : `${value}${' '.repeat(Math.max(0, width - plainValue.length))}`
}

function createTable(headers: string[], rows: string[][]) {
  const plainRows = rows.map((row) => row.map((value) => stripAnsi(value)))
  const widths = headers.map((header, index) => {
    return Math.max(header.length, ...plainRows.map((row) => row[index]?.length ?? 0))
  })

  const border = {
    bottom: `└─${widths.map((width) => '─'.repeat(width)).join('─┴─')}─┘`,
    header: `├─${widths.map((width) => '─'.repeat(width)).join('─┼─')}─┤`,
    top: `┌─${widths.map((width) => '─'.repeat(width)).join('─┬─')}─┐`,
  }

  const renderRow = (row: string[], alignments: Array<'left' | 'right'>) => {
    return `│ ${row.map((value, index) => padCell(value, widths[index] ?? 0, alignments[index] ?? 'left')).join(' │ ')} │`
  }

  return [
    border.top,
    renderRow(headers, ['left', 'left', 'right', 'right']),
    border.header,
    ...rows.map((row) => renderRow(row, ['left', 'left', 'right', 'right'])),
    border.bottom,
  ].join('\n')
}

/**
 * Render a compact phase summary that stays readable in a terminal.
 */
export function formatPhaseSummary(result: IBuildResult) {
  const rows = result.phaseResults.map((phase) => {
    const status = phase.skipped ? kleur.yellow('skipped') : kleur.green('done')
    const items = typeof phase.itemCount === 'number' ? String(phase.itemCount) : '-'
    const files = (phase.outputFiles?.length ?? 0) > 0 ? String(phase.outputFiles?.length ?? 0) : '-'

    return [phase.name, status, items, files]
  })

  const table = createTable(['Phase', 'Status', 'Items', 'Files'], rows)

  return [
    kleur.bold('Registry build complete'),
    `${kleur.dim('Config')}  ${result.configPath}`,
    `${kleur.dim('Output')}  ${result.outputPaths.baseDir}`,
    '',
    table,
  ].join('\n')
}

/**
 * Keep default CLI errors concise while still supporting verbose stack traces.
 */
export function formatError(error: unknown, verbose: boolean) {
  if (verbose && error instanceof Error && error.stack) {
    return error.stack
  }

  return error instanceof Error ? error.message : String(error)
}
