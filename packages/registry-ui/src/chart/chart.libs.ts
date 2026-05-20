import type { IChartConfig } from './chart.types'

/** Allowed CSS color/value forms for chart `--color-*` custom properties. */
const SAFE_CSS_COLOR = /^(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla)\([\d.,%\s/]+\)|var\(--[a-zA-Z0-9_-]+\)|[a-zA-Z]+)$/
/** Allowed CSS identifier form for chart config keys and the chart `id`. */
const SAFE_CSS_IDENT = /^[a-zA-Z0-9_-]+$/

/**
 * Returns `true` when `value` is a CSS color that cannot break out of a
 * declaration inside a `<style>` block (no `;`, `}`, `{`, `(`-injection, etc).
 */
export function isSafeCssColor(value: string): boolean {
  return typeof value === 'string' && SAFE_CSS_COLOR.test(value)
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
