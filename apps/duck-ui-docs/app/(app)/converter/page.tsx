'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'
import { ArrowRightLeft, Copy, Download, Palette } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

interface ThemeObject {
  light: Record<string, string>
  dark: Record<string, string>
}

export default function ConverterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isJsToCSS, setIsJsToCSS] = useState(true)

  const convertJsToCSS = (jsObject: ThemeObject): string => {
    let css = ':root {\n'

    // Add light theme variables
    Object.entries(jsObject.light).forEach(([key, value]) => {
      const cleanValue = value.split('//')[0]?.trim().replace(/['"]/g, '')
      css += `  --${key}: ${cleanValue};\n`
    })

    css += '}\n\n.dark {\n'

    // Add dark theme variables
    Object.entries(jsObject.dark).forEach(([key, value]) => {
      const cleanValue = value.split('//')[0]?.trim().replace(/['"]/g, '')
      css += `  --${key}: ${cleanValue};\n`
    })

    css += '}'

    return css
  }

  const convertCSSToJs = (cssString: string): string => {
    const lines = cssString.split('\n')
    const lightTheme: Record<string, string> = {}
    const darkTheme: Record<string, string> = {}

    let currentMode: 'light' | 'dark' | null = null

    lines.forEach((line) => {
      const trimmed = line.trim()

      if (trimmed === ':root {') {
        currentMode = 'light'
      } else if (trimmed === '.dark {') {
        currentMode = 'dark'
      } else if (trimmed === '}') {
        currentMode = null
      } else if (trimmed.startsWith('--') && currentMode) {
        const match = trimmed.match(/--([^:]+):\s*([^;]+);/)
        if (match) {
          const [, key, value] = match
          const cleanKey = key?.trim()
          const cleanValue = value?.trim()

          if (currentMode === 'light') {
            lightTheme[cleanKey!] = `'${cleanValue}'`
          } else {
            darkTheme[cleanKey!] = `'${cleanValue}'`
          }
        }
      }
    })

    const jsObject = {
      dark: darkTheme,
      light: lightTheme,
    }

    return JSON.stringify(jsObject, null, 2)
  }

  const handleConvert = () => {
    try {
      if (isJsToCSS) {
        // Convert JS object to CSS
        const parsed = eval(`(${input})`) as ThemeObject
        const cssOutput = convertJsToCSS(parsed)
        setOutput(cssOutput)
      } else {
        // Convert CSS to JS object
        const jsOutput = convertCSSToJs(input)
        setOutput(jsOutput)
      }
      toast(`Successfully converted ${isJsToCSS ? 'JS to CSS' : 'CSS to JS'}`)
    } catch (error) {
      toast('Please check your input format and try again.')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast('Output copied to clipboard')
    } catch (error) {
      toast('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const extension = isJsToCSS ? 'css' : 'js'
    const mimeType = isJsToCSS ? 'text/css' : 'application/javascript'
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast(`File saved as theme.${extension}`)
  }

  const toggleDirection = () => {
    setIsJsToCSS(!isJsToCSS)
    setInput('')
    setOutput('')
  }

  const exampleJsInput = `{
  light: {
    background: 'oklch(1 0 0)', // --color-zinc-50
    foreground: 'oklch(0.141 0.005 285.823)', // --color-zinc-950
    primary: 'oklch(0.21 0.006 285.885)', // --color-zinc-900
    'primary-foreground': 'oklch(0.985 0 0)', // --color-zinc-50
  },
  dark: {
    background: 'oklch(0.141 0.005 285.823)', // --color-zinc-950
    foreground: 'oklch(0.985 0 0)', // --color-zinc-50
    primary: 'oklch(0.92 0.004 286.32)', // --color-zinc-200
    'primary-foreground': 'oklch(0.21 0.006 285.885)', // --color-zinc-900
  }
}`

  const exampleCssInput = `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
}`

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl">Theme Format Converter</h1>
            <p className="text-muted-foreground">Convert between JavaScript theme objects and CSS custom properties</p>
          </div>
          <Link href="/color-editor">
            <Button className="flex items-center gap-2 bg-transparent" variant="outline">
              <Palette className="h-4 w-4" />
              Theme Manager
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Button className="flex items-center gap-2 bg-transparent" onClick={toggleDirection} variant="outline">
          <ArrowRightLeft className="h-4 w-4" />
          {isJsToCSS ? 'JS → CSS' : 'CSS → JS'}
        </Button>
        <span className="text-muted-foreground text-sm">
          Currently converting from {isJsToCSS ? 'JavaScript Object' : 'CSS'} to{' '}
          {isJsToCSS ? 'CSS' : 'JavaScript Object'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input ({isJsToCSS ? 'JavaScript Object' : 'CSS'})</CardTitle>
            <CardDescription>
              Paste your {isJsToCSS ? 'JavaScript theme object' : 'CSS custom properties'} here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[400px] font-mono text-sm"
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder={isJsToCSS ? exampleJsInput : exampleCssInput}
              value={input}
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleConvert}>
                Convert
              </Button>
              <Button onClick={() => setInput(isJsToCSS ? exampleJsInput : exampleCssInput)} variant="outline">
                Load Example
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Output ({isJsToCSS ? 'CSS' : 'JavaScript Object'})</CardTitle>
            <CardDescription>
              Your converted {isJsToCSS ? 'CSS custom properties' : 'JavaScript theme object'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[400px] bg-muted font-mono text-sm"
              placeholder={`Converted ${isJsToCSS ? 'CSS' : 'JavaScript'} will appear here...`}
              readOnly
              value={output}
            />
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 bg-transparent"
                disabled={!output}
                onClick={handleCopy}
                variant="outline">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                className="flex items-center gap-2 bg-transparent"
                disabled={!output}
                onClick={handleDownload}
                variant="outline">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Format Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Format Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">JavaScript Object Format:</h4>
            <p className="mb-2 text-muted-foreground text-sm">
              Should contain `light` and `dark` objects with color properties:
            </p>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`{
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.141 0.005 285.823)',
    // ... more properties
  },
  dark: {
    background: 'oklch(0.141 0.005 285.823)',
    foreground: 'oklch(0.985 0 0)',
    // ... more properties
  }
}`}
            </pre>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">CSS Format:</h4>
            <p className="mb-2 text-muted-foreground text-sm">
              Uses `:root` for light theme and `.dark` for dark theme:
            </p>
            <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
              {`:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
