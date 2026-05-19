function isColorObject(value: unknown): value is { hsl: string; rgb: string; [key: string]: unknown } {
  return typeof value === 'object' && value !== null && 'hsl' in value && 'rgb' in value
}

function withChannels(value: { hsl: string; rgb: string; [key: string]: unknown }) {
  return {
    ...value,
    hslChannel: value.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
    rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
  }
}

/** Enrich color entries with computed HSL and RGB channel values for CSS variable usage. */
export function processRegistryColors(colors: Record<string, unknown>) {
  const result: Record<string, unknown> = {}

  for (const [name, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      result[name] = value
      continue
    }

    if (Array.isArray(value)) {
      result[name] = value.map((entry) => {
        if (!isColorObject(entry)) {
          throw new Error(`Invalid color array entry for "${name}".`)
        }

        return withChannels(entry)
      })
      continue
    }

    if (isColorObject(value)) {
      result[name] = withChannels(value)
      continue
    }

    throw new Error(`Unsupported color payload for "${name}".`)
  }

  return result
}
