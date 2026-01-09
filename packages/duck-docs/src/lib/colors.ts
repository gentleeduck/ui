import { z } from 'zod'
import { registry_colors } from './registry-colors-data'

const colorSchema = z.object({
  className: z.string(),
  foreground: z.string(),
  hex: z.string(),
  hsl: z.string(),
  id: z.string(),
  name: z.string(),
  oklch: z.string(),
  rgb: z.string(),
  scale: z.number(),
  var: z.string(),
})

const colorPaletteSchema = z.object({
  colors: z.array(colorSchema),
  name: z.string(),
})

export type ColorPalette = z.infer<typeof colorPaletteSchema>

export function getColorFormat(color: Color) {
  return {
    className: `bg-${color.name}-100`,
    hex: color.hex,
    hsl: color.hsl,
    oklch: color.oklch,
    rgb: color.rgb,
    var: `--color-${color.name}-${color.scale}`,
  }
}

export type ColorFormat = keyof ReturnType<typeof getColorFormat>

export function getColors() {
  const tailwindColors = colorPaletteSchema.array().parse(
    Object.entries(registry_colors)
      .map(([name, color]) => {
        if (!Array.isArray(color)) {
          return null
        }

        return {
          colors: color.map((color) => {
            const rgb = color.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3')

            return {
              ...color,
              className: `${name}-${color.scale}`,
              foreground: getForegroundFromBackground(rgb),
              hsl: color.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
              id: `${name}-${color.scale}`,
              name,
              oklch: `oklch(${color.oklch.replace(/^oklch\(([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\)$/, '$1 $2 $3')})`,
              rgb,
              var: `--color-${name}-${color.scale}`,
            }
          }),
          name,
        }
      })
      .filter(Boolean),
  )

  return tailwindColors
}

export type Color = ReturnType<typeof getColors>[number]['colors'][number]

function getForegroundFromBackground(rgb: string) {
  const [r, g, b] = rgb.split(' ').map(Number)

  function toLinear(number: number): number {
    const base = number / 255
    return base <= 0.04045 ? base / 12.92 : Math.pow((base + 0.055) / 1.055, 2.4)
  }

  if (!r || !g || !b) {
    throw new Error(`Invalid RGB value: ${rgb}`)
  }
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  return luminance > 0.179 ? '#000' : '#fff'
}
