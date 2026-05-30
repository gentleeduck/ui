import type { IChartConfig } from './chart.types'

/**
 * Allowed structured CSS color/value forms for chart `--color-*` custom
 * properties: hex literals, `rgb(...)`/`hsl(...)` (+ a-variants), and
 * `var(--name)` references. Named-keyword colors are checked separately
 * against `CSS_NAMED_COLORS` so we never accept an arbitrary bare ident
 * like `revert-layer` or whatever the next CSS spec ships.
 */
const SAFE_CSS_COLOR_STRUCTURED = /^(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla)\([\d.,%\s/]+\)|var\(--[a-zA-Z0-9_-]+\))$/

/**
 * Finite allowlist of CSS named colors permitted as bare identifiers. Sourced
 * from CSS Color Module Level 4 (incl. `currentColor` / `transparent`). New
 * named colors require an explicit addition — no `[a-zA-Z]+` catch-all.
 */
const CSS_NAMED_COLORS = new Set<string>([
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
  'transparent',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
])

/** Allowed CSS identifier form for chart config keys and the chart `id`. */
const SAFE_CSS_IDENT = /^[a-zA-Z0-9_-]+$/

/**
 * Returns `true` when `value` is a CSS color that cannot break out of a
 * declaration inside a `<style>` block (no `;`, `}`, `{`, `(`-injection, etc).
 *
 * Accepts:
 *   - hex literals (#fff / #ffffff / #ffffffff)
 *   - rgb/rgba/hsl/hsla() with digits + commas/spaces/percent/slash
 *   - var(--foo)
 *   - finite allowlist of CSS named colors (see `CSS_NAMED_COLORS`)
 *
 * Bare unknown identifiers are rejected — this is intentionally stricter than
 * the previous `[a-zA-Z]+` catch-all so future CSS-wide keywords cannot ship
 * an injection path.
 */
export function isSafeCssColor(value: string): boolean {
  if (typeof value !== 'string') return false
  if (SAFE_CSS_COLOR_STRUCTURED.test(value)) return true
  return CSS_NAMED_COLORS.has(value.toLowerCase())
}

/**
 * Returns `true` when `value` is a safe CSS identifier (used for config keys
 * and the chart `id` interpolated into selectors).
 */
export function isSafeCssIdent(value: string): boolean {
  return typeof value === 'string' && SAFE_CSS_IDENT.test(value)
}

export function getPayloadConfigFromPayload(config: IChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}
