import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { extract } from 'tar'
import { get_package_manager } from '~/utils/get-package-manager'
import { highlighter } from '~/utils/text-styling'
import { TEMPLATE_SCAFFOLD_CONFIG } from './template-scaffold.constants'

export interface ScaffoldTemplateOptions {
  template: string
  cwd: string
  yes?: boolean
}

export async function scaffold_template(options: ScaffoldTemplateOptions, spinner: Ora) {
  const { template, cwd, yes } = options
  const { repo, branch, tarball_url, templates_dir, ignore_segments } = TEMPLATE_SCAFFOLD_CONFIG

  const target_dir = path.resolve(cwd)

  // Validate target directory
  if (await fs.pathExists(target_dir)) {
    const files = await fs.readdir(target_dir)
    if (files.length > 0) {
      if (!yes) {
        spinner.stop()
        const { proceed } = await prompts({
          type: 'confirm',
          name: 'proceed',
          message: `Directory ${highlighter.warn(target_dir)} is not empty. Continue?`,
          initial: false,
        })
        if (!proceed) {
          process.exit(0)
        }
        spinner.start()
      }
    }
  }

  await fs.ensureDir(target_dir)

  // Download tarball
  spinner.text = `Downloading template ${highlighter.info(template)}...`
  const url = tarball_url(repo, branch)
  const response = await fetch(url)

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download template archive: ${response.status} ${response.statusText}`)
  }

  // Extract matching entries
  // The tarball root dir name varies (e.g., "duck-ui-master/"), so match with a pattern
  const template_path_pattern = new RegExp(`^[^/]+/${templates_dir}/${template}/`)
  // strip: 3 removes "<root>/<templates_dir>/<template>/" prefix
  const strip_count = 3

  spinner.text = `Extracting template ${highlighter.info(template)}...`

  const readable = Readable.fromWeb(response.body as import('node:stream/web').ReadableStream)

  await pipeline(
    readable,
    createGunzip(),
    extract({
      cwd: target_dir,
      strip: strip_count,
      filter: (entry_path: string) => {
        if (!template_path_pattern.test(entry_path)) return false
        const segments = entry_path.split('/')
        return !segments.some((s) => ignore_segments.has(s))
      },
    }),
  )

  // Verify extraction
  const extracted = await fs.readdir(target_dir)
  if (extracted.length === 0) {
    throw new Error(
      `Template "${template}" not found. Check available templates at https://github.com/${repo}/tree/${branch}/${templates_dir}`,
    )
  }

  // Install dependencies
  spinner.text = 'Installing dependencies...'
  try {
    const pm = await get_package_manager(target_dir)
    await execa(pm, ['install'], { cwd: target_dir, stdio: 'ignore' })
    spinner.info(`Dependencies installed with ${highlighter.info(pm)}.`)
  } catch {
    spinner.warn('Could not install dependencies automatically. Run install manually.')
  }
}
