import chalk from 'chalk'
import fs from 'fs-extra'
import { loadConfig } from 'tsconfig-paths'
import { default_js_config, explorer } from './get-project-config.constants'
import { resolve_import } from '../resolve-import'
import {
  config_cchema,
  raw_config_schema,
  RawConfigType,
} from './get-project-config.dto'
import path from 'node:path'
import {
  get_tailwindcss_file,
  get_ts_config_alias_prefix,
} from '../get-project-info'
import { highlighter, logger } from '../text-styling'
// import { checkTypeScriptInstalled } from '../pref-light-typescript'

export async function get_raw_config(
  cwd: string,
): Promise<RawConfigType | null> {
  try {
    const rawConfig = await explorer.search(cwd)
    if (!rawConfig) {
      return null
    }

    return raw_config_schema.parse(rawConfig.config)
  } catch (error) {
    logger.error({
      args: [`Invalid configuration found in ${cwd}/components.json.`],
    })
    process.exit(1)
  }
}

export async function get_config(cwd: string) {
  const config = await get_raw_config(cwd)

  if (!config) {
    return null
  }

  return await resolve_config_paths(cwd, config)
}

// Resolve Config Paths
export async function resolve_config_paths(
  cwd: string,
  config: RawConfigType,
): Promise<RawConfigType> {
  const ts_config = loadConfig(cwd)

  if (ts_config.resultType === 'failed') {
    return logger.error({
      args: [
        `Failed to leaod ${config.tsx ? 'tsconfig' : 'jsconfig'}.json. ${ts_config.message ?? ''}`.trim(),
      ],
    })
  }

  return config_cchema.parse({
    ...config,
    resolvedPaths: {
      tailwindConfig: path.resolve(cwd, config.tailwind.config),
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      utils: await resolve_import(config.aliases.utils, ts_config),
      components: await resolve_import(config.aliases.components, ts_config),
      ui: config.aliases.ui
        ? await resolve_import(config.aliases.ui, ts_config)
        : await resolve_import(config.aliases.components, ts_config),
    },
  })
}

export async function get_project_config(cwd: string) {
  const project_config = await get_config(cwd)

  if (project_config) {
    return project_config
  }

  const project_type = '' //await get_project_type(cwd)
  const tailwindcss_file = await get_tailwindcss_file(cwd)
  const ts_config_alias_prefix = await get_ts_config_alias_prefix(cwd)

  if (!project_type || !tailwindcss_file || !ts_config_alias_prefix) {
    logger.error({
      args: [
        `Failed to get project config!, ${chalk.bgRed.white('TailwindCss')} is required`,
      ],
    })
    return null
  }

  const is_tsx = false // await checkTypeScriptInstalled(cwd)

  const config: RawConfigType = {
    $schema: 'https://duckui.vercel.app/schema.json',
    rsc: ['NEXT_JS'].includes(project_type),
    tsx: is_tsx,
    style: 'default',
    tailwind: {
      config: is_tsx ? 'tailwind.config.ts' : 'tailwind.config.js',
      baseColor: 'zinc',
      css: tailwindcss_file,
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      utils: `${ts_config_alias_prefix}/lib/utils`,
      components: `${ts_config_alias_prefix}/components`,
    },
  }

  // Convert config to a string based on the file type
  const configString = config?.tsx
    ? `export const config = ${JSON.stringify(config, null, 2)};`
    : default_js_config(config)

  try {
    await fs.writeFile(
      path.join(cwd, `duck-ui.config.${is_tsx ? 'ts' : 'js'}`),
      configString,
      'utf8',
    )
  } catch (error) {
    console.log(error)
    logger.error({
      args: [`Failed to create duck-ui.config.${is_tsx ? 'ts' : 'js'}`],
    })
    process.exit(1)
  }

  return resolve_config_paths(cwd, config)
}
