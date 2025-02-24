import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { existsSync } from 'node:fs'
import { REGISTRY_PATH } from '../main/main.constants'
import { registry_color_mapping as registry_color_mapping } from '@/registry'
import {
  build_registry_colors_base,
  build_registry_colors_themes,
  registry_build_colors_index,
} from './build-registry-build-colors.lib'

// ----------------------------------------------------------------------------
export async function registry_build_colors() {
  // 1- check for the dir and remove it, and make another new one
  const colors_target_path = path.join(REGISTRY_PATH, 'colors')
  rimraf.sync(colors_target_path)
  if (!existsSync(colors_target_path)) {
    await fs.mkdir(colors_target_path, { recursive: true })
  }

  const colors_data: Record<string, unknown> = {}

  // 2- build index.json
  registry_build_colors_index(colors_data, colors_target_path)

  // 3- build base colors
  build_registry_colors_base(colors_data)

  // 4- build themes
  build_registry_colors_themes()

  // 5- build theme item
  build_registry_themes_item(colors_data)
}

export async function build_registry_themes_item(
  colors_data: Record<string, any>,
): Promise<void> {
  rimraf.sync(path.join(REGISTRY_PATH, 'themes'))
  for (const base_color of ['slate', 'gray', 'zinc', 'neutral', 'stone']) {
    const payload: Record<string, any> = {
      name: base_color,
      label: base_color.charAt(0).toUpperCase() + base_color.slice(1),
      cssVars: {},
    }
    for (const [mode, values] of Object.entries(registry_color_mapping)) {
      payload.cssVars[mode] = {}
      for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'string') {
          const resolved_color = value.replace(/{{base}}-/g, `${base_color}-`)
          payload.cssVars[mode][key] = resolved_color

          const [resolved_base, scale] = resolved_color.split('-')
          const color = scale
            ? colors_data[resolved_base].find(
                (item: any) => item.scale === parseInt(scale),
              )
            : colors_data[resolved_base]
          if (color) {
            payload['cssVars'][mode][key] = color.hslChannel
          }
        }
      }
    }

    const target_path = path.join(REGISTRY_PATH, 'themes')

    // Create directory if it doesn't exist.
    if (!existsSync(target_path)) {
      await fs.mkdir(target_path, { recursive: true })
    }

    await fs.writeFile(
      path.join(target_path, `${payload.name}.json`),
      JSON.stringify(payload, null, 2),
      'utf8',
    )
  }
}
