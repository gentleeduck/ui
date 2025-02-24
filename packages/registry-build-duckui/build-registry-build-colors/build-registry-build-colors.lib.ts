import fs from 'node:fs/promises'
import path from 'node:path'
import {
  registry_base_colors,
  registry_color_mapping,
  registry_colors,
} from '@duck/registers'
import template from 'lodash.template'
import {
  BASE_STYLES,
  BASE_STYLES_WITH_VARIABLES,
  THEME_STYLES_WITH_VARIABLES,
} from './build-registry-build-colors.constants'
import { REGISTRY_PATH } from '../main'

// ----------------------------------------------------------------------------
export async function registry_build_colors_index(
  colors_data: Record<string, any>,
  colors_target_path: string,
): Promise<void> {
  for (const [color, value] of Object.entries(registry_colors)) {
    if (typeof value === 'string') {
      colors_data[color] = value
      continue
    }

    if (Array.isArray(value)) {
      colors_data[color] = value.map((item) => ({
        ...item,
        rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
        hslChannel: item.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          '$1 $2 $3',
        ),
      }))
      continue
    }

    if (typeof value === 'object') {
      colors_data[color] = {
        ...value,
        rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
        hslChannel: value.hsl.replace(
          /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
          '$1 $2 $3',
        ),
      }
      continue
    }
  }

  await fs.writeFile(
    path.join(colors_target_path, 'index.json'),
    JSON.stringify(colors_data, null, 2),
    'utf8',
  )
}

// ----------------------------------------------------------------------------
export async function build_registry_colors_base(
  colors_data: Record<string, any>,
): Promise<void> {
  for (const base_color of ['slate', 'gray', 'zinc', 'neutral', 'stone']) {
    const base: Record<string, any> = {
      inlineColors: {},
      cssVars: {},
    }
    for (const [mode, values] of Object.entries(registry_color_mapping)) {
      base['inlineColors'][mode] = {}
      base['cssVars'][mode] = {}
      for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'string') {
          // Chart colors do not have a 1-to-1 mapping with tailwind colors.
          if (key.startsWith('chart-')) {
            base['cssVars'][mode][key] = value
            continue
          }

          const resolved_color = value.replace(/{{base}}-/g, `${base_color}-`)
          base['inlineColors'][mode][key] = resolved_color

          const [resolved_base, scale] = resolved_color.split('-')
          const color = scale
            ? colors_data[resolved_base].find(
                (item: any) => item.scale === parseInt(scale),
              )
            : colors_data[resolved_base]
          if (color) {
            base['cssVars'][mode][key] = color.hslChannel
          }
        }
      }
    }

    // Build css vars.
    base['inlineColorsTemplate'] = template(BASE_STYLES)({})
    base['cssVarsTemplate'] = template(BASE_STYLES_WITH_VARIABLES)({
      colors: base['cssVars'],
    })
  }
}

// ----------------------------------------------------------------------------
export async function build_registry_colors_themes() {
  const theme_css = []
  for (const theme of registry_base_colors) {
    theme_css.push(
      template(THEME_STYLES_WITH_VARIABLES)({
        colors: theme.cssVars,
        theme: theme.name,
      }),
    )
  }

  await fs.writeFile(
    path.join(REGISTRY_PATH, `themes.css`),
    theme_css.join('\n'),
    'utf8',
  )
}
