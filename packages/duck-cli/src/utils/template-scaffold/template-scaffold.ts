import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { extract } from 'tar'
import { getPackageManager } from '~/utils/get-package-manager'
import { highlighter } from '~/utils/text-styling'
import { TEMPLATE_SCAFFOLD_CONFIG } from './template-scaffold.constants'

export interface IScaffoldTemplateOptions {
  template: string
  cwd: string
  yes?: boolean
}

/** Template names are simple identifiers; reject anything else to avoid regex injection. */
const TEMPLATE_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/

export async function scaffoldTemplate(options: IScaffoldTemplateOptions, spinner: Ora) {
  const { template, cwd, yes } = options
  const { repo, branch, tarballUrl, templatesDir, ignoreSegments } = TEMPLATE_SCAFFOLD_CONFIG

  if (!TEMPLATE_NAME_PATTERN.test(template)) {
    throw new Error(
      `Invalid template name "${template}". Template names may only contain letters, numbers, "-" and "_".`,
    )
  }

  const targetDir = path.resolve(cwd)

  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir)
    if (files.length > 0) {
      if (!yes) {
        spinner.stop()
        const { proceed } = await prompts({
          type: 'confirm',
          name: 'proceed',
          message: `Directory ${highlighter.warn(targetDir)} is not empty. Continue?`,
          initial: false,
        })
        if (!proceed) {
          process.exit(0)
        }
        spinner.start()
      }
    }
  }

  await fs.ensureDir(targetDir)

  spinner.text = `Downloading template ${highlighter.info(template)}...`
  const url = tarballUrl(repo, branch)
  const response = await fetch(url)

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download template archive: ${response.status} ${response.statusText}`)
  }

  // GitHub tarball root dir name varies (e.g. `duck-ui-master/`), so regex around it.
  const templatePathPattern = new RegExp(`^[^/]+/${templatesDir}/${template}/`)
  // Strips `<root>/<templatesDir>/<template>/` so the template contents land at the target root.
  const stripCount = 3

  spinner.text = `Extracting template ${highlighter.info(template)}...`

  const readable = Readable.fromWeb(response.body as import('node:stream/web').ReadableStream)

  await pipeline(
    readable,
    createGunzip(),
    extract({
      cwd: targetDir,
      strip: stripCount,
      preservePaths: false,
      filter: (entryPath: string, entry) => {
        // Reject symlink/hardlink entries: a malicious archive could plant a link then write through it.
        const entryType = (entry as { type?: string }).type
        if (entryType === 'SymbolicLink' || entryType === 'Link') return false
        // Reject absolute paths and `..` traversal segments.
        if (path.isAbsolute(entryPath)) return false
        const segments = entryPath.split(/[\\/]+/)
        if (segments.some((s) => s === '..')) return false
        if (!templatePathPattern.test(entryPath)) return false
        return !segments.some((s) => ignoreSegments.has(s))
      },
    }),
  )

  const extracted = await fs.readdir(targetDir)
  if (extracted.length === 0) {
    throw new Error(
      `Template "${template}" not found. Check available templates at https://github.com/${repo}/tree/${branch}/${templatesDir}`,
    )
  }

  spinner.text = 'Installing dependencies...'
  try {
    const pm = await getPackageManager(targetDir)
    await execa(pm, ['install'], { cwd: targetDir, stdio: 'ignore' })
    spinner.info(`Dependencies installed with ${highlighter.info(pm)}.`)
  } catch {
    spinner.warn('Could not install dependencies automatically. Run install manually.')
  }
}
