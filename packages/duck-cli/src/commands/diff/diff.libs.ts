import path from 'node:path'
import kleur from 'kleur'
import prompts from 'prompts'
import { diffComponents, resolveWriteTypePath, scanInstalledComponents } from '~/services/component.service'
import { resolveInstallPath } from '~/services/install.service'
import { printBanner } from '~/utils/banner'
import { buildDisplayLines, type Diff, formatLineNumber, getMaxLineNumber } from '~/utils/diff-format'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { isVerbose } from '~/utils/verbose'
import { prepareCommand } from '../shared.libs'
import { type DiffOptions, diffArgumentsSchema, diffOptionsSchema } from './diff.dto'

/** Table-drive the per-line diff formatting so the inner render loop stays linear. */
type DiffLineKind = 'add' | 'remove' | 'context'
const DIFF_LINE_PREFIX: Record<DiffLineKind, string> = {
  add: '+',
  remove: '-',
  context: ' ',
}
const DIFF_LINE_PREFIX_FORMAT: Record<DiffLineKind, (s: string) => string> = {
  add: kleur.green,
  remove: kleur.red,
  context: kleur.gray,
}
const DIFF_LINE_FG_FORMAT: Record<DiffLineKind, (s: string) => string> = {
  add: kleur.green,
  remove: kleur.red,
  context: kleur.gray,
}
const DIFF_LINE_HIGHLIGHT_FORMAT: Record<DiffLineKind, (s: string) => string> = {
  add: (s) => kleur.bgGreen().black(s),
  remove: (s) => kleur.bgRed().white(s),
  context: (s) => s,
}

function lineKind(type: Diff.DisplayLine['type']): DiffLineKind {
  if (type === 'add') return 'add'
  if (type === 'remove') return 'remove'
  return 'context'
}

function formatDiffLine(line: Diff.DisplayLine, numWidth: number): string {
  if (line.type === 'file-header') return kleur.bold(line.rawText)
  if (line.type === 'hunk-header') return kleur.cyan(line.rawText)

  const oldNum = formatLineNumber(line.oldLineNum, numWidth)
  const newNum = formatLineNumber(line.newLineNum, numWidth)
  const kind = lineKind(line.type)
  const prefix = DIFF_LINE_PREFIX[kind]
  const fg = DIFF_LINE_FG_FORMAT[kind]
  const bg = DIFF_LINE_HIGHLIGHT_FORMAT[kind]

  const content = line.segments.map((seg) => (seg.highlight ? bg(seg.text) : fg(seg.text))).join('')
  const lineNums = kleur.gray(`${oldNum} ${newNum}`)
  const prefixColored = DIFF_LINE_PREFIX_FORMAT[kind](prefix)

  return `${lineNums} ${prefixColored} ${content}`
}

export async function diffCommandAction(args: string[], opt: DiffOptions) {
  const options = diffOptionsSchema.parse(opt)
  const componentNames = diffArgumentsSchema.parse(args)

  if (options.gui) {
    const { launchGui } = await import('~/gui')
    launchGui({ initialArgs: componentNames })
    return
  }

  printBanner()
  const spinner = Spinner('initializing...').start()
  try {
    const { projectCwd, duckuiConfig, tsConfig } = await prepareCommand(
      { cwd: options.cwd, workspace: options.workspace },
      spinner,
    )

    const pathResult = resolveInstallPath(duckuiConfig, tsConfig)
    if (!pathResult.ok) {
      spinner.fail(pathResult.error)
      process.exit(1)
    }

    const writeTypePath = resolveWriteTypePath(duckuiConfig, path.resolve(projectCwd, pathResult.data))

    spinner.text = 'Scanning installed components...'
    const scanResult = await scanInstalledComponents(writeTypePath)
    if (!scanResult.ok) {
      spinner.fail(scanResult.error)
      process.exit(1)
    }

    if (scanResult.data.length === 0) {
      spinner.fail('No installed components found.')
      process.exit(1)
    }

    let selected = scanResult.data

    if (componentNames.length === 0) {
      spinner.stop()
      const { picked } = await prompts({
        type: 'autocompleteMultiselect',
        name: 'picked',
        message: 'Select components to diff',
        choices: scanResult.data.map((c) => ({ title: c.name, value: c.name })),
      })
      spinner.start()

      if (!picked || picked.length === 0) {
        spinner.info('No components selected.')
        process.exit(0)
      }

      selected = scanResult.data.filter((c) => picked.includes(c.name))
    } else {
      selected = scanResult.data.filter((c) => componentNames.some((n) => n.toLowerCase() === c.name.toLowerCase()))

      if (selected.length === 0) {
        spinner.fail(
          `None of the specified components are installed: ${componentNames.map((n) => highlighter.info(n)).join(', ')}`,
        )
        process.exit(1)
      }
    }

    spinner.text = 'Comparing with registry...'
    const diffResult = await diffComponents(selected, (msg) => {
      spinner.text = msg
    })

    if (!diffResult.ok) {
      spinner.fail(diffResult.error)
      process.exit(1)
    }

    spinner.stop()

    let hasDiffs = false
    for (const compDiff of diffResult.data) {
      if (compDiff.isIdentical) {
        console.log(`\n${highlighter.info(compDiff.name)}: ${kleur.green('identical')}`)
        continue
      }

      hasDiffs = true
      console.log(`\n${highlighter.info(compDiff.name)}: ${kleur.yellow('modified')}`)

      for (const fileDiff of compDiff.diffs) {
        const lines = buildDisplayLines(fileDiff.filePath, fileDiff.localContent, fileDiff.registryContent)
        const maxNum = getMaxLineNumber(lines)
        const numWidth = Math.max(String(maxNum).length, 3)

        for (const line of lines) {
          console.log(formatDiffLine(line, numWidth))
        }
        console.log()
      }
    }

    process.exit(hasDiffs ? 1 : 0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
