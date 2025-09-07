import { converter, formatCss } from 'culori'

const hslToOklch = converter('oklch')

// Helper: turn "0 0% 45.1%" → "hsl(0 0% 45.1%)"
function normalizeHslString(hsl) {
  if (hsl.includes('hsl')) return hsl
  return `hsl(${hsl})`
}

// Recursively convert all HSL strings in an object to OKLCH
function convertObjectToOklch(obj) {
  if (typeof obj === 'string') {
    try {
      const oklch = hslToOklch(normalizeHslString(obj))
      if (!oklch) return obj
      return formatCss(oklch) // → "oklch(0.61 0.23 16.4)"
    } catch {
      return obj
    }
  } else if (Array.isArray(obj)) {
    return obj.map((v) => convertObjectToOklch(v))
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, convertObjectToOklch(v)]))
  }
  return obj
}

// Example input
const theme = {
  name: 'neutral',
  label: 'Neutral',
  activeColor: {
    light: '0 0% 45.1%',
    dark: '0 0% 32.2%',
  },
  cssVars: {
    light: {
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      'card-foreground': '0 0% 3.9%',
      popover: '0 0% 100%',
      'popover-foreground': '0 0% 3.9%',
      primary: '0 0% 9%',
      'primary-foreground': '0 0% 98%',
      secondary: '0 0% 96.1%',
      'secondary-foreground': '0 0% 9%',
      muted: '0 0% 96.1%',
      'muted-foreground': '0 0% 45.1%',
      accent: '0 0% 96.1%',
      'accent-foreground': '0 0% 9%',
      destructive: '355.33deg 89.11% 51.9%',
      'destructive-foreground': '0deg 0.37% 97.38%',
      warning: '39.13deg 91.14% 53.8%',
      'warning-foreground': '0deg 0.37% 97.38%',
      border: '0 0% 89.8%',
      input: '0 0% 89.8%',
      ring: '0 0% 3.9%',
      'chart-1': '12 76% 61%',
      'chart-2': '173 58% 39%',
      'chart-3': '197 37% 24%',
      'chart-4': '43 74% 66%',
      'chart-5': '27 87% 67%',
    },
    dark: {
      background: '0 0% 3.9%',
      foreground: '0 0% 98%',
      card: '0 0% 3.9%',
      'card-foreground': '0 0% 98%',
      popover: '0 0% 3.9%',
      'popover-foreground': '0 0% 98%',
      primary: '0 0% 98%',
      'primary-foreground': '0 0% 9%',
      secondary: '0 0% 14.9%',
      'secondary-foreground': '0 0% 98%',
      muted: '0 0% 14.9%',
      'muted-foreground': '0 0% 63.9%',
      accent: '0 0% 14.9%',
      'accent-foreground': '0 0% 98%',
      destructive: '0deg 65.6% 50.98%',
      'destructive-foreground': '0deg 0.37% 97.38%',
      warning: '39.66deg 88.68% 51.57%',
      'warning-foreground': '0deg 0.37% 97.38%',
      border: '0 0% 14.9%',
      input: '0 0% 14.9%',
      ring: '0 0% 83.1%',
      'chart-1': '220 70% 50%',
      'chart-2': '160 60% 45%',
      'chart-3': '30 80% 55%',
      'chart-4': '280 65% 60%',
      'chart-5': '340 75% 55%',
    },
  },
}

// Convert whole object
const converted = convertObjectToOklch(theme)

console.log(JSON.stringify(converted, null, 2))
