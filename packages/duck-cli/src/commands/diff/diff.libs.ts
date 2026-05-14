import path from 'node:path'
import kleur from 'kleur'
import prompts from 'prompts'
import { diffComponents, resolveWriteTypePath, scanInstalledComponents } from '~/services/component.service'
import { resolveInstallPath } from '~/services/install.service'
import { printBanner } from '~/utils/banner'
import { buildDisplayLines, formatLineNumber, getMaxLineNumber } from '~/utils/diff-format'
import { getDuckuiConfig, getTsConfig } from '~/utils/get-project-info'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { isVerbose } from '~/utils/verbose'
import { resolveProjectCwd, validateWorkspaceTarget } from '~/utils/workspace'
import { type DiffOptions, diffArgumentsSchema, diffOptionsSchema } from './diff.dto'

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
    const cwd = path.resolve(options.cwd)

    // In monorepo mode, config lives in the workspace directory
    const configCwd = options.workspace ? path.resolve(cwd, options.workspace) : cwd
    const duckuiConfig = await getDuckuiConfig(configCwd, spinner)
    const projectCwd = resolveProjectCwd(configCwd, duckuiConfig)
    const workspaceError = validateWorkspaceTarget(projectCwd, true)
    if (workspaceError) {
      spinner.fail(workspaceError)
      process.exit(1)
    }
    spinner.info(`Using workspace: ${projectCwd}`)
    const tsConfig = await getTsConfig(projectCwd, spinner)

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
          if (line.type === 'file-header') {
            console.log(kleur.bold(line.rawText))
            continue
          }

          if (line.type === 'hunk-header') {
            console.log(kleur.cyan(line.rawText))
            continue
          }

          const oldNum = formatLineNumber(line.oldLineNum, numWidth)
          const newNum = formatLineNumber(line.newLineNum, numWidth)
          const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '

          let content = ''
          for (const seg of line.segments) {
            if (seg.highlight) {
              if (line.type === 'remove') {
                content += kleur.bgRed().white(seg.text)
              } else if (line.type === 'add') {
                content += kleur.bgGreen().black(seg.text)
              } else {
                content += seg.text
              }
            } else {
              if (line.type === 'remove') {
                content += kleur.red(seg.text)
              } else if (line.type === 'add') {
                content += kleur.green(seg.text)
              } else {
                content += kleur.gray(seg.text)
              }
            }
          }

          const lineNums = kleur.gray(`${oldNum} ${newNum}`)
          const prefixColored =
            line.type === 'add' ? kleur.green(prefix) : line.type === 'remove' ? kleur.red(prefix) : kleur.gray(prefix)

          console.log(`${lineNums} ${prefixColored} ${content}`)
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
