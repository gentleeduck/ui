'use client'

import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@gentleduck/registry-ui-duckui/dialog'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'
import { converter, formatHex, parse } from 'culori'
import {
  ArrowRightLeft,
  Copy,
  CreditCard,
  Eye,
  Mail,
  MapPin,
  Moon,
  Palette,
  Phone,
  Pipette,
  Plus,
  Settings,
  Sun,
  Trash2,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CardsDemo } from '~/components/cards'
import { CopyButton } from '@gentleduck/duck-docs'

interface ColorVariable {
  name: string
  value: string
  originalFormat: string
}

interface Theme {
  id: string
  name: string
  lightColors: ColorVariable[]
  darkColors: ColorVariable[]
}

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex' | 'srgb' | 'p3' | 'lab' | 'lch'

export default function ColorThemeManager() {
  const [cssInput, setCssInput] = useState('')
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [themeName, setThemeName] = useState('')
  const [colorFormat, setColorFormat] = useState<ColorFormat>('oklch')
  const [outputFormat, setOutputFormat] = useState<ColorFormat>('oklch')
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null)
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null)
  const [themeChangerOpen, setThemeChangerOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [advancedPickerOpen, setAdvancedPickerOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ColorVariable | null>(null)
  const [selectedColorMode, setSelectedColorMode] = useState<'light' | 'dark'>('light')
  const [tempColorValue, setTempColorValue] = useState('')

  const parseCSSVariables = (css: string): { light: ColorVariable[]; dark: ColorVariable[] } => {
    const light: ColorVariable[] = []
    const dark: ColorVariable[] = []

    const rootMatch = css.match(/:root\s*{([^}]*)}/s)
    if (rootMatch) {
      const rootContent = rootMatch[1]
      const variables = rootContent?.match(/--[\w-]+:\s*[^;]+/g) || []
      variables.forEach((variable) => {
        const [name, value] = variable.split(':').map((s) => s.trim())
        if (
          (name && value && name.includes('color')) ||
          name?.includes('background') ||
          name?.includes('foreground') ||
          name?.includes('primary') ||
          name?.includes('secondary') ||
          name?.includes('accent') ||
          name?.includes('muted') ||
          name?.includes('destructive') ||
          name?.includes('warning') ||
          name?.includes('border') ||
          name?.includes('ring') ||
          name?.includes('chart')
        ) {
          const originalFormat = detectColorFormat(value!)
          const convertedValue = convertColor(value!, originalFormat, outputFormat)
          light.push({ name: name.replace('--', ''), originalFormat: outputFormat, value: convertedValue })
        }
      })
    }

    const darkMatch = css.match(/\.dark\s*{([^}]*)}/s)
    if (darkMatch) {
      const darkContent = darkMatch[1]
      const variables = darkContent?.match(/--[\w-]+:\s*[^;]+/g) || []
      variables.forEach((variable) => {
        const [name, value] = variable.split(':').map((s) => s.trim())
        if (
          (name && value && name.includes('color')) ||
          name?.includes('background') ||
          name?.includes('foreground') ||
          name?.includes('primary') ||
          name?.includes('secondary') ||
          name?.includes('accent') ||
          name?.includes('muted') ||
          name?.includes('destructive') ||
          name?.includes('warning') ||
          name?.includes('border') ||
          name?.includes('ring') ||
          name?.includes('chart')
        ) {
          const originalFormat = detectColorFormat(value!)
          const convertedValue = convertColor(value!, originalFormat, outputFormat)
          dark.push({ name: name.replace('--', ''), originalFormat: outputFormat, value: convertedValue })
        }
      })
    }

    return { dark, light }
  }

  const detectColorFormat = (value: string): string => {
    if (value.includes('oklch')) return 'oklch'
    if (value.includes('hsl')) return 'hsl'
    if (value.includes('rgb')) return 'rgb'
    if (value.startsWith('#')) return 'hex'
    return 'unknown'
  }

  const convertColor = (value: string, fromFormat: string, toFormat: ColorFormat): string => {
    try {
      // Clean the input value first
      const cleanValue = value.trim().replace(/;$/, '')

      if (fromFormat === toFormat) {
        return cleanValue
      }

      // Try to parse the color - be more lenient with parsing
      let parsedColor = parse(cleanValue)

      // If initial parsing fails, try some common variations
      if (!parsedColor) {
        // Try without extra spaces or formatting
        const normalizedValue = cleanValue.replace(/\s+/g, ' ')
        parsedColor = parse(normalizedValue)

        // If still failing, try to extract just the color part for complex CSS values
        if (!parsedColor) {
          const colorMatch = cleanValue.match(/(oklch|hsl|rgb|#[0-9a-fA-F]+|color$$[^)]+$$)/i)
          if (colorMatch) {
            parsedColor = parse(colorMatch[0])
          }
        }
      }

      // If we still can't parse it, return the original value
      if (!parsedColor) {
        console.log('[v0] Could not parse color:', cleanValue)
        return cleanValue
      }

      switch (toFormat) {
        case 'hex':
          const hexResult = formatHex(parsedColor)
          return hexResult || cleanValue
        case 'hsl':
          const hslColor = converter('hsl')(parsedColor)
          if (hslColor) {
            const h = (hslColor.h || 0).toFixed(2)
            const s = ((hslColor.s || 0) * 100).toFixed(2)
            const l = ((hslColor.l || 0) * 100).toFixed(2)
            const alpha =
              hslColor.alpha !== undefined && hslColor.alpha < 1 ? ` / ${(hslColor.alpha * 100).toFixed(1)}%` : ''
            return `hsl(${h} ${s}% ${l}%${alpha})`
          }
          return cleanValue
        case 'rgb':
          const rgbColor = converter('rgb')(parsedColor)
          if (rgbColor) {
            const r = Math.round(rgbColor.r * 255)
            const g = Math.round(rgbColor.g * 255)
            const b = Math.round(rgbColor.b * 255)
            const alpha =
              rgbColor.alpha !== undefined && rgbColor.alpha < 1 ? ` / ${(rgbColor.alpha * 100).toFixed(1)}%` : ''
            return `rgb(${r} ${g} ${b}${alpha})`
          }
          return cleanValue
        case 'srgb':
          const srgbColor = converter('rgb')(parsedColor)
          if (srgbColor) {
            const alpha = srgbColor.alpha !== undefined && srgbColor.alpha < 1 ? ` / ${srgbColor.alpha.toFixed(4)}` : ''
            return `color(srgb ${srgbColor.r.toFixed(4)} ${srgbColor.g.toFixed(4)} ${srgbColor.b.toFixed(4)}${alpha})`
          }
          return cleanValue
        case 'p3':
          const p3Color = converter('p3')(parsedColor)
          if (p3Color) {
            const alpha = p3Color.alpha !== undefined && p3Color.alpha < 1 ? ` / ${p3Color.alpha.toFixed(4)}` : ''
            return `color(display-p3 ${p3Color.r.toFixed(4)} ${p3Color.g.toFixed(4)} ${p3Color.b.toFixed(4)}${alpha})`
          }
          return cleanValue
        case 'lab':
          const labColor = converter('lab')(parsedColor)
          if (labColor) {
            const alpha =
              labColor.alpha !== undefined && labColor.alpha < 1 ? ` / ${(labColor.alpha * 100).toFixed(1)}%` : ''
            return `lab(${(labColor.l || 0).toFixed(3)}% ${(labColor.a || 0).toFixed(4)} ${(labColor.b || 0).toFixed(4)}${alpha})`
          }
          return cleanValue
        case 'lch':
          const lchColor = converter('lch')(parsedColor)
          if (lchColor) {
            const alpha =
              lchColor.alpha !== undefined && lchColor.alpha < 1 ? ` / ${(lchColor.alpha * 100).toFixed(1)}%` : ''
            return `lch(${(lchColor.l || 0).toFixed(3)}% ${(lchColor.c || 0).toFixed(4)} ${(lchColor.h || 0).toFixed(3)}${alpha})`
          }
          return cleanValue
        case 'oklch':
          const oklchColor = converter('oklch')(parsedColor)
          if (oklchColor) {
            const alpha =
              oklchColor.alpha !== undefined && oklchColor.alpha < 1 ? ` / ${(oklchColor.alpha * 100).toFixed(1)}%` : ''
            return `oklch(${(oklchColor.l || 0).toFixed(4)} ${(oklchColor.c || 0).toFixed(4)} ${(oklchColor.h || 0).toFixed(3)}${alpha})`
          }
          return cleanValue
        default:
          return cleanValue
      }
    } catch (error) {
      console.log('[v0] Color conversion error for value:', value, 'Error:', error)
      return value
    }
  }

  const isValidColor = (value: string): boolean => {
    try {
      const cleanValue = value.trim().replace(/;$/, '')
      let parsedColor = parse(cleanValue)

      // Try alternative parsing methods if initial fails
      if (!parsedColor) {
        const normalizedValue = cleanValue.replace(/\s+/g, ' ')
        parsedColor = parse(normalizedValue)

        if (!parsedColor) {
          const colorMatch = cleanValue.match(/(oklch|hsl|rgb|#[0-9a-fA-F]+|color$$[^)]+$$)/i)
          if (colorMatch) {
            parsedColor = parse(colorMatch[0])
          }
        }
      }

      // Check if color is valid and displayable
      return parsedColor !== undefined && parsedColor !== null
    } catch (error) {
      console.log('[v0] Color validation error:', error)
      return false
    }
  }

  const handleParseCss = () => {
    const parsed = parseCSSVariables(cssInput)
    const newTheme: Theme = {
      darkColors: parsed.dark,
      id: Date.now().toString(),
      lightColors: parsed.light,
      name: themeName || `Theme ${themes.length + 1}`,
    }
    setCurrentTheme(newTheme)
  }

  const handleSaveTheme = () => {
    if (currentTheme) {
      setThemes([...themes, currentTheme])
      setCurrentTheme(null)
      setCssInput('')
      setThemeName('')
    }
  }

  const handleColorChange = (colorName: string, newValue: string, isDark: boolean) => {
    if (!currentTheme) return

    const updatedTheme = { ...currentTheme }
    const colors = isDark ? updatedTheme.darkColors : updatedTheme.lightColors
    const colorIndex = colors.findIndex((c) => c.name === colorName)

    if (colorIndex !== -1) {
      colors[colorIndex]!.value = newValue
      setCurrentTheme(updatedTheme)
    }
  }

  const deleteTheme = (themeId: string) => {
    setThemes(themes.filter((t) => t.id !== themeId))
  }

  const openPreviewModal = (theme: Theme) => {
    setPreviewTheme(theme)
    setPreviewModalOpen(true)
  }

  const handlePreviewColorChange = (colorName: string, newValue: string, isDark: boolean) => {
    if (!previewTheme) return

    const updatedTheme = { ...previewTheme }
    const colors = isDark ? updatedTheme.darkColors : updatedTheme.lightColors
    const colorIndex = colors.findIndex((c) => c.name === colorName)

    if (colorIndex !== -1) {
      colors[colorIndex]!.value = newValue
      setPreviewTheme(updatedTheme)
      setThemes(themes.map((t) => (t.id === updatedTheme.id ? updatedTheme : t)))
    }
  }

  const applyTheme = (theme: Theme) => {
    console.log('[v0] Applying theme:', theme.name, 'Dark mode:', isDarkMode)
    setActiveTheme(theme)
    const root = document.documentElement

    // Determine which color set to use based on current mode
    const colorsToApply = isDarkMode ? theme.darkColors : theme.lightColors
    console.log('[v0] Colors to apply:', colorsToApply)

    // Apply all colors from the appropriate set
    colorsToApply.forEach((color) => {
      root.style.setProperty(`--${color.name}`, color.value)
      console.log('[v0] Setting CSS variable:', `--${color.name}`, 'to', color.value)
    })

    // Create dark mode styles that override the light colors when .dark class is present
    const darkStyles = theme.darkColors
      .map((color) => {
        return `--${color.name}: ${color.value};`
      })
      .join(' ')

    // Update or create dark mode styles
    let darkStyleElement = document.getElementById('dynamic-dark-theme')
    if (!darkStyleElement) {
      darkStyleElement = document.createElement('style')
      darkStyleElement.id = 'dynamic-dark-theme'
      document.head.appendChild(darkStyleElement)
    }
    darkStyleElement.textContent = `.dark { ${darkStyles} }`

    // Apply dark class if in dark mode
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Ensure proper contrast for primary button
    const primaryColor = colorsToApply.find((c) => c.name === 'primary')
    const primaryForegroundColor = colorsToApply.find((c) => c.name === 'primary-foreground')

    console.log('[v0] Primary color:', primaryColor?.value)
    console.log('[v0] Primary foreground color:', primaryForegroundColor?.value)

    if (primaryColor && primaryForegroundColor) {
      root.style.setProperty('--primary', primaryColor.value)
      root.style.setProperty('--primary-foreground', primaryForegroundColor.value)
    } else {
      // Fallback to ensure good contrast
      console.log('[v0] Missing primary colors, using fallbacks')
      if (isDarkMode) {
        root.style.setProperty('--primary', 'hsl(210 40% 98%)')
        root.style.setProperty('--primary-foreground', 'hsl(222.2 84% 4.9%)')
      } else {
        root.style.setProperty('--primary', 'hsl(222.2 84% 4.9%)')
        root.style.setProperty('--primary-foreground', 'hsl(210 40% 98%)')
      }
    }

    const backgroundcolor = colorsToApply.find((c) => c.name === 'background')
    const foregroundColor = colorsToApply.find((c) => c.name === 'foreground')

    if (backgroundcolor && foregroundColor) {
      root.style.setProperty('--background', backgroundcolor.value)
      root.style.setProperty('--foreground', foregroundColor.value)
    }
  }

  const resetTheme = () => {
    setActiveTheme(null)
    const root = document.documentElement

    // Remove all custom theme properties to restore defaults
    const propertiesToReset = [
      'background',
      'foreground',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
      'muted',
      'muted-foreground',
      'accent',
      'accent-foreground',
      'destructive',
      'destructive-foreground',
      'warning',
      'warning-foreground',
      'border',
      'input',
      'ring',
      'chart-1',
      'chart-2',
      'chart-3',
      'chart-4',
      'chart-5',
    ]

    propertiesToReset.forEach((prop) => {
      root.style.removeProperty(`--${prop}`)
    })

    // Remove dynamic dark theme styles
    const darkStyleElement = document.getElementById('dynamic-dark-theme')
    if (darkStyleElement) {
      darkStyleElement.remove()
    }
  }

  const convertThemeFormat = (theme: Theme, newFormat: ColorFormat): Theme => {
    return {
      ...theme,
      darkColors: theme.darkColors.map((color) => ({
        ...color,
        originalFormat: newFormat,
        value: convertColor(color.value, color.originalFormat, newFormat),
      })),
      lightColors: theme.lightColors.map((color) => ({
        ...color,
        originalFormat: newFormat,
        value: convertColor(color.value, color.originalFormat, newFormat),
      })),
    }
  }

  const updateThemeFormat = (themeId: string, newFormat: ColorFormat) => {
    setThemes(themes.map((theme) => (theme.id === themeId ? convertThemeFormat(theme, newFormat) : theme)))
    if (activeTheme?.id === themeId) {
      setActiveTheme(convertThemeFormat(activeTheme, newFormat))
    }
  }

  const ColorPreview = ({
    color,
    isDark,
    onColorChange,
    showPicker = false,
  }: {
    color: ColorVariable
    isDark: boolean
    onColorChange: (name: string, value: string) => void
    showPicker?: boolean
  }) => {
    const convertedValue = convertColor(color.value, color.originalFormat, colorFormat)
    const hexValue = convertColor(color.value, color.originalFormat, 'hex')
    const isValid = isValidColor(convertedValue)
    const [localValue, setLocalValue] = useState(convertedValue)

    useEffect(() => {
      setLocalValue(convertedValue)
    }, [convertedValue])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
    }

    const handleInputBlur = () => {
      onColorChange(color.name, localValue)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onColorChange(color.name, localValue)
        e.currentTarget.blur()
      }
    }

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const hexColor = e.target.value
      const convertedColor = convertColor(hexColor, 'hex', color.originalFormat as never)
      setLocalValue(convertedColor)
      onColorChange(color.name, convertedColor)
    }

    const openAdvancedPicker = () => {
      setSelectedColor(color)
      setSelectedColorMode(isDark ? 'dark' : 'light')
      setTempColorValue(convertedValue)
      setAdvancedPickerOpen(true)
    }

    return (
      <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
        <div className="relative">
          <div
            className={`h-12 w-12 cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${!isValid ? 'border-red-300 bg-red-100' : 'border-border'}`}
            onClick={openAdvancedPicker}
            style={{ backgroundColor: isValid ? hexValue : '#f3f4f6' }}
          />
          {showPicker && (
            <input
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleColorPickerChange}
              type="color"
              value={isValid ? hexValue : '#000000'}
            />
          )}
          <Pipette className="-bottom-1 -right-1 absolute h-4 w-4 rounded border bg-background p-0.5" />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="font-medium text-sm capitalize">{color.name.replace(/-/g, ' ')}</Label>
          <Input
            className={`h-8 font-mono text-xs ${!isValid ? 'border-red-300 text-red-600' : ''}`}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            value={localValue}
          />
          {!isValid && <p className="text-red-500 text-xs">Invalid color format</p>}
        </div>
      </div>
    )
  }

  const ThemePreviewCard = ({ theme }: { theme: Theme }) => {
    const isActive = activeTheme?.id === theme.id

    return (
      <Card className={`relative transition-all hover:shadow-lg ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {theme.name}
              {isActive && (
                <Badge className="text-xs" variant="default">
                  Active
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                className="text-primary hover:text-primary"
                onClick={() => applyTheme(theme)}
                size="sm"
                title="Apply Theme"
                variant="ghost">
                <Palette className="h-4 w-4" />
              </Button>
              <Button
                className="text-primary hover:text-primary"
                onClick={() => openPreviewModal(theme)}
                size="sm"
                title="Edit Theme"
                variant="ghost">
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                className="text-destructive hover:text-destructive"
                onClick={() => deleteTheme(theme.id)}
                size="sm"
                title="Delete Theme"
                variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Format:</Label>
            <Select
              onValueChange={((value: ColorFormat) => updateThemeFormat(theme.id, value)) as never}
              value={theme.lightColors[0]?.originalFormat || 'oklch'}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oklch">OKLCH</SelectItem>
                <SelectItem value="hsl">HSL</SelectItem>
                <SelectItem value="rgb">RGB</SelectItem>
                <SelectItem value="hex">HEX</SelectItem>
                <SelectItem value="srgb">sRGB</SelectItem>
                <SelectItem value="p3">Display P3</SelectItem>
                <SelectItem value="lab">LAB</SelectItem>
                <SelectItem value="lch">LCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div>
              <Badge className="mb-2 text-xs" variant="secondary">
                Light Mode ({theme.lightColors.length} colors)
              </Badge>
              <div className="grid grid-cols-8 gap-1.5">
                {theme.lightColors.map((color) => (
                  <div
                    className="group relative aspect-square cursor-pointer rounded-md border-2 border-border/50 transition-colors hover:border-primary/50"
                    key={color.name}
                    style={{ backgroundColor: convertColor(color.value, color.originalFormat, 'hex') }}
                    title={`${color.name}: ${color.value}`}>
                    <div className="absolute inset-0 rounded-md bg-black/0 transition-colors group-hover:bg-black/10" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Badge className="mb-2 text-xs" variant="outline">
                Dark Mode ({theme.darkColors.length} colors)
              </Badge>
              <div className="grid grid-cols-8 gap-1.5">
                {theme.darkColors.map((color) => (
                  <div
                    className="group relative aspect-square cursor-pointer rounded-md border-2 border-border/50 transition-colors hover:border-primary/50"
                    key={color.name}
                    style={{ backgroundColor: convertColor(color.value, color.originalFormat, 'hex') }}
                    title={`${color.name}: ${color.value}`}>
                    <div className="absolute inset-0 rounded-md bg-black/0 transition-colors group-hover:bg-black/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const PreviewModalContent = ({ theme }: { theme: Theme }) => {
    return (
      <div className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Light Mode</Badge>
          </div>
          <div className="space-y-3">
            {theme.lightColors.map((color) => (
              <ColorPreview
                color={color}
                isDark={false}
                key={color.name}
                onColorChange={(name, value) => handlePreviewColorChange(name, value, false)}
                showPicker={true}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Dark Mode</Badge>
          </div>
          <div className="space-y-3">
            {theme.darkColors.map((color) => (
              <ColorPreview
                color={color}
                isDark={true}
                key={color.name}
                onColorChange={(name, value) => handlePreviewColorChange(name, value, true)}
                showPicker={true}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const AdvancedColorPicker = () => {
    if (!selectedColor) return null

    const hexValue = convertColor(tempColorValue, selectedColor.originalFormat, 'hex')
    const hslColor = converter('hsl')(parse(tempColorValue) || ({ b: 0, g: 0, r: 0 } as never))
    const rgbColor = converter('rgb')(parse(tempColorValue) || ({ b: 0, g: 0, r: 0 } as never))

    const updateColorValue = (newValue: string, format: ColorFormat) => {
      const convertedValue = convertColor(newValue, format, selectedColor.originalFormat as never)
      setTempColorValue(convertedValue)
    }

    const applyColorChange = () => {
      handlePreviewColorChange(selectedColor.name, tempColorValue, true)
      setAdvancedPickerOpen(false)
    }

    return (
      <Dialog onOpenChange={setAdvancedPickerOpen} open={advancedPickerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Advanced Color Picker
            </DialogTitle>
            <DialogDescription>
              Editing {selectedColor.name.replace(/-/g, ' ')} ({selectedColorMode} mode)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Color Preview */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border-2 border-border" style={{ backgroundColor: hexValue }} />
              <div className="flex-1">
                <Label className="font-medium text-sm">Preview</Label>
                <p className="text-muted-foreground text-xs">{hexValue}</p>
              </div>
            </div>

            {/* Chrome-like Color Picker */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Color Picker</Label>
                <input
                  className="h-12 w-full cursor-pointer rounded border"
                  onChange={(e) => updateColorValue(e.target.value, 'hex')}
                  type="color"
                  value={hexValue}
                />
              </div>

              {/* HSL Controls */}
              <div className="space-y-2">
                <Label className="text-sm">HSL Values</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">H</Label>
                    <Input
                      className="h-8 text-xs"
                      max="360"
                      min="0"
                      onChange={(e) => {
                        const newHsl = `hsl(${e.currentTarget.value} ${Math.round((hslColor?.s || 0) * 100)}% ${Math.round((hslColor?.l || 0) * 100)}%)`
                        updateColorValue(newHsl, 'hsl')
                      }}
                      type="number"
                      value={Math.round(hslColor?.h || 0)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">S</Label>
                    <Input
                      className="h-8 text-xs"
                      max="100"
                      min="0"
                      onChange={(e) => {
                        const newHsl = `hsl(${Math.round(hslColor?.h || 0)} ${e.currentTarget.value}% ${Math.round((hslColor?.l || 0) * 100)}%)`
                        updateColorValue(newHsl, 'hsl')
                      }}
                      type="number"
                      value={Math.round((hslColor?.s || 0) * 100)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">L</Label>
                    <Input
                      className="h-8 text-xs"
                      max="100"
                      min="0"
                      onChange={(e) => {
                        const newHsl = `hsl(${Math.round(hslColor?.h || 0)} ${Math.round((hslColor?.s || 0) * 100)}% ${e.currentTarget.value}%)`
                        updateColorValue(newHsl, 'hsl')
                      }}
                      type="number"
                      value={Math.round((hslColor?.l || 0) * 100)}
                    />
                  </div>
                </div>
              </div>

              {/* RGB Controls */}
              <div className="space-y-2">
                <Label className="text-sm">RGB Values</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">R</Label>
                    <Input
                      className="h-8 text-xs"
                      max="255"
                      min="0"
                      onChange={(e) => {
                        const newRgb = `rgb(${e.currentTarget.value} ${Math.round((rgbColor?.g || 0) * 255)} ${Math.round((rgbColor?.b || 0) * 255)})`
                        updateColorValue(newRgb, 'rgb')
                      }}
                      type="number"
                      value={Math.round((rgbColor?.r || 0) * 255)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">G</Label>
                    <Input
                      className="h-8 text-xs"
                      max="255"
                      min="0"
                      onChange={(e) => {
                        const newRgb = `rgb(${Math.round((rgbColor?.r || 0) * 255)} ${e.currentTarget.value} ${Math.round((rgbColor?.b || 0) * 255)})`
                        updateColorValue(newRgb, 'rgb')
                      }}
                      type="number"
                      value={Math.round((rgbColor?.g || 0) * 255)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">B</Label>
                    <Input
                      className="h-8 text-xs"
                      max="255"
                      min="0"
                      onChange={(e) => {
                        const newRgb = `rgb(${Math.round((rgbColor?.r || 0) * 255)} ${Math.round((rgbColor?.g || 0) * 255)} ${e.currentTarget.value})`
                        updateColorValue(newRgb, 'rgb')
                      }}
                      type="number"
                      value={Math.round((rgbColor?.b || 0) * 255)}
                    />
                  </div>
                </div>
              </div>

              {/* Direct Value Input */}
              <div>
                <Label className="text-sm">Direct Value</Label>
                <Input
                  className="font-mono text-xs"
                  onChange={(e) => setTempColorValue(e.currentTarget.value)}
                  placeholder="Enter color value..."
                  value={tempColorValue}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={applyColorChange}>
                Apply Changes
              </Button>
              <Button onClick={() => setAdvancedPickerOpen(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const ThemePreviewComponents = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-2xl">Theme Preview</h2>
          <p className="text-muted-foreground">See how your active theme looks on various UI components</p>
        </div>
        <CardsDemo />

        {/* Color Palette Display */}
        {activeTheme && (
          <Card>
            <CardHeader>
              <CardTitle>Active Theme Colors</CardTitle>
              <CardDescription>Current color palette being used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-3 font-medium">Light Mode</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {activeTheme.lightColors.map((color) => (
                      <div className="relative text-center" key={color.name}>
                        <div
                          className="mb-2 h-16 w-full rounded-lg border"
                          style={{ backgroundColor: convertColor(color.value, color.originalFormat, 'hex') }}
                        />
                        <CopyButton
                          className="absolute top-1 right-1 h-6 w-6 border bg-background/80 shadow-sm hover:bg-background"
                          value={color.value}
                        />
                        <p className="font-mono text-xs">{color.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-medium">Dark Mode</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {activeTheme.darkColors.map((color) => (
                      <div className="relative text-center" key={color.name}>
                        <div
                          className="mb-2 h-16 w-full rounded-lg border"
                          style={{ backgroundColor: convertColor(color.value, color.originalFormat, 'hex') }}
                        />
                        <CopyButton
                          className="absolute top-1 right-1 h-6 w-6 border bg-background/80 shadow-sm hover:bg-background"
                          value={color.value}
                        />
                        <p className="font-mono text-xs">{color.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    if (activeTheme) {
      applyTheme(activeTheme)
    }
  }, [isDarkMode, activeTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Color Theme Manager</h1>
            <p className="text-muted-foreground">Create, edit, and manage your color themes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2 bg-transparent"
              onClick={toggleTheme}
              size="sm"
              variant="outline">
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark
                </>
              )}
            </Button>
            <Button className="flex items-center gap-2" onClick={() => setThemeChangerOpen(true)}>
              <Settings className="h-4 w-4" />
              Theme Changer
            </Button>
          </div>
        </div>

        {activeTheme && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary">Active Theme: {activeTheme.name}</h3>
                  <p className="text-muted-foreground text-sm">This theme is currently applied to the page</p>
                </div>
                <Button onClick={resetTheme} size="sm" variant="outline">
                  Reset Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>CSS Input</CardTitle>
              <CardDescription>Paste your CSS variables here to parse and edit colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  onChange={(e) => setThemeName(e.currentTarget.value)}
                  placeholder="Enter theme name"
                  value={themeName}
                />
              </div>

              <div>
                <Label htmlFor="output-format">Output Format (for parsing)</Label>
                <Select onValueChange={((value: ColorFormat) => setOutputFormat(value)) as never} value={outputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oklch">OKLCH</SelectItem>
                    <SelectItem value="hsl">HSL</SelectItem>
                    <SelectItem value="rgb">RGB</SelectItem>
                    <SelectItem value="hex">HEX</SelectItem>
                    <SelectItem value="srgb">sRGB</SelectItem>
                    <SelectItem value="p3">Display P3</SelectItem>
                    <SelectItem value="lab">LAB</SelectItem>
                    <SelectItem value="lch">LCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color-format">Display Format</Label>
                <Select onValueChange={((value: ColorFormat) => setColorFormat(value)) as never} value={colorFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oklch">OKLCH</SelectItem>
                    <SelectItem value="hsl">HSL</SelectItem>
                    <SelectItem value="rgb">RGB</SelectItem>
                    <SelectItem value="hex">HEX</SelectItem>
                    <SelectItem value="srgb">sRGB</SelectItem>
                    <SelectItem value="p3">Display P3</SelectItem>
                    <SelectItem value="lab">LAB</SelectItem>
                    <SelectItem value="lch">LCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="css-input">CSS Variables</Label>
                <Textarea
                  className="min-h-[200px] font-mono text-sm"
                  id="css-input"
                  onChange={(e) => setCssInput(e.currentTarget.value)}
                  placeholder="Paste your CSS variables here..."
                  value={cssInput}
                />
              </div>

              <div className="flex gap-2">
                <Button disabled={!cssInput.trim()} onClick={handleParseCss}>
                  Parse CSS
                </Button>
                {currentTheme && (
                  <Button onClick={handleSaveTheme} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Save Theme
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {currentTheme && (
            <Card>
              <CardHeader>
                <CardTitle>Color Editor</CardTitle>
                <CardDescription>Edit colors for {currentTheme.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">Light Mode</h3>
                    <div className="grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto">
                      {currentTheme.lightColors.map((color) => (
                        <ColorPreview
                          color={color}
                          isDark={false}
                          key={color.name}
                          onColorChange={(name, value) => handleColorChange(name, value, false)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Dark Mode</h3>
                    <div className="grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto">
                      {currentTheme.darkColors.map((color) => (
                        <ColorPreview
                          color={color}
                          isDark={true}
                          key={color.name}
                          onColorChange={(name, value) => handleColorChange(name, value, true)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {themes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Themes</CardTitle>
              <CardDescription>
                Your collection of color themes - click the palette icon to apply a theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {themes.map((theme) => (
                  <ThemePreviewCard key={theme.id} theme={theme} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog onOpenChange={setThemeChangerOpen} open={themeChangerOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Theme Changer
              </DialogTitle>
              <DialogDescription>Select and apply themes to see them in action</DialogDescription>
            </DialogHeader>
            <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
              {themes.map((theme) => (
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${activeTheme?.id === theme.id ? 'ring-2 ring-primary' : ''}`}
                  key={theme.id}
                  onClick={() => applyTheme(theme)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      {theme.name}
                      {activeTheme?.id === theme.id && (
                        <Badge className="text-xs" variant="default">
                          Active
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 grid grid-cols-10 gap-1">
                      {theme.lightColors.slice(0, 10).map((color) => (
                        <div
                          className="aspect-square rounded border"
                          key={color.name}
                          style={{ backgroundColor: convertColor(color.value, color.originalFormat, 'hex') }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {theme.darkColors.slice(0, 10).map((color) => (
                        <div
                          className="aspect-square rounded border"
                          key={color.name}
                          style={{ backgroundColor: convertColor(color.value, color.originalFormat, 'hex') }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog onOpenChange={setPreviewModalOpen} open={previewModalOpen}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {previewTheme?.name} - Theme Preview & Editor
              </DialogTitle>
              <DialogDescription>Preview and edit both light and dark mode colors side by side</DialogDescription>
            </DialogHeader>
            {previewTheme && <PreviewModalContent theme={previewTheme} />}
          </DialogContent>
        </Dialog>

        {activeTheme && (
          <div className="mt-12">
            <ThemePreviewComponents />
          </div>
        )}

        <AdvancedColorPicker />
      </div>
    </div>
  )
}
