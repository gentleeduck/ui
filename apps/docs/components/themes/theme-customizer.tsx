'use client'

import { cn } from '@gentleduck/libs/cn'
import { BaseColor, baseColors, baseColorsOKLCH } from '@gentleduck/registers'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui-duckui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@gentleduck/registry-ui-duckui/drawer'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { Skeleton } from '@gentleduck/registry-ui-duckui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { ResetIcon } from '@radix-ui/react-icons'
import template from 'lodash.template'
import { CheckIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { CopyButton } from '~/components/copy-button'
import { useConfig } from '~/hooks/use-config'

interface BaseColorOKLCH {
  light: Record<string, string>
  dark: Record<string, string>
}

export function ThemeCustomizer() {
  return (
    <div className="flex items-center gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="sm" className="md:hidden">
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6 pt-0">
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden items-center md:flex">
        <Popover placement="bottom">
          <PopoverTrigger asChild>
            <Button size="sm">Customize</Button>
          </PopoverTrigger>
          <PopoverContent className="z-40 max-w-[325px] rounded-[12px] bg-white p-6 dark:bg-zinc-950">
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
      <CopyCodeButton variant="ghost" size="sm" className="[&_svg]:hidden" />
    </div>
  )
}

export function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme: setMode, resolvedTheme: mode } = useTheme()
  const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col space-y-4 md:space-y-6">
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">Customize</div>
          <div className="text-xs text-muted-foreground">Pick a style and color for your components.</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setConfig({
              ...config,
              theme: 'zinc',
              radius: 0.5,
            })
          }}>
          <ResetIcon />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {baseColors.map((theme) => {
              const isActive = config.theme === theme.name

              return mounted ? (
                <Button
                  variant={'outline'}
                  size="sm"
                  key={theme.name}
                  onClick={() => {
                    setConfig({
                      ...config,
                      theme: theme.name,
                    })
                  }}
                  className={cn('justify-start', isActive && 'border-2 border-primary')}
                  style={
                    {
                      '--theme-primary': `hsl(${theme?.activeColor[mode === 'dark' ? 'dark' : 'light']})`,
                    } as React.CSSProperties
                  }>
                  <span
                    className={cn(
                      'mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[var(--theme-primary)]',
                    )}>
                    {isActive && <CheckIcon className="!size-3 text-white" />}
                  </span>
                  {theme.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={theme.name} />
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Radius</Label>
          <div className="grid grid-cols-5 gap-2">
            {['0', '0.3', '0.5', '0.75', '1.0'].map((value) => {
              return (
                <Button
                  variant={'outline'}
                  size="sm"
                  key={value}
                  onClick={() => {
                    setConfig({
                      ...config,
                      radius: parseFloat(value),
                    })
                  }}
                  className={cn(config.radius === parseFloat(value) && 'border-2 border-primary')}>
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={'outline'}
                  size="sm"
                  onClick={() => setMode('light')}
                  className={cn(mode === 'light' && 'border-2 border-primary')}>
                  <SunIcon className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  variant={'outline'}
                  size="sm"
                  onClick={() => setMode('dark')}
                  className={cn(mode === 'dark' && 'border-2 border-primary')}>
                  <MoonIcon className="mr-1 -translate-x-1" />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CopyCodeButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className={cn('h-8 rounded-lg shadow-none sm:hidden', className)} {...props}>
            Copy
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Theme</DrawerTitle>
            <DrawerDescription>Copy and paste the following code into your CSS file.</DrawerDescription>
          </DrawerHeader>
          <CustomizerCode />
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={cn('hidden h-8 rounded-lg shadow-none sm:flex', className)} {...props}>
            Copy code
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl outline-none">
          <DialogHeader>
            <DialogTitle>Theme</DialogTitle>
            <DialogDescription>Copy and paste the following code into your CSS file.</DialogDescription>
          </DialogHeader>
          <CustomizerCode />
        </DialogContent>
      </Dialog>
    </>
  )
}

function CustomizerCode() {
  const [config] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)
  const [themeVersion, setThemeVersion] = React.useState('v4')
  const activeTheme = React.useMemo(() => baseColors.find((theme) => theme.name === config.theme), [config.theme])
  const activeThemeOKLCH = React.useMemo(
    () => baseColorsOKLCH[config.theme as keyof typeof baseColorsOKLCH],
    [config.theme],
  )

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  }, [hasCopied])

  const Button = () => {
    return (
      <CopyButton
        className="top-2 right-2 absolute"
        value={
          themeVersion === 'v3'
            ? getThemeCode(activeTheme, config.radius)
            : getThemeCodeOKLCH(activeThemeOKLCH, config.radius)
        }
      />
    )
  }

  return (
    <Tabs value={themeVersion} onValueChange={setThemeVersion}>
      <div className="flex items-center justify-between">
        <TabsList className="bg-zinc-950 dark:bg-zinc-900">
          <TabsTrigger value="v4" className="w-full">
            Tailwind v4
          </TabsTrigger>
          <TabsTrigger value="v3" className="w-full">
            v3
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="v4">
        <div data-rehype-pretty-code-fragment="" className="">
          <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative">
            <Button />
            <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm flex flex-col">
              <span className="line text-white">&nbsp;:root &#123;</span>
              <span className="line text-white">&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;</span>
              {Object.entries(activeThemeOKLCH?.light).map(([key, value]) => (
                <span className="line text-white" key={key}>
                  &nbsp;&nbsp;&nbsp;--{key}: {value};
                </span>
              ))}
              <span className="line text-white">&nbsp;&#125;</span>
              <span className="line text-white">&nbsp;</span>
              <span className="line text-white">&nbsp;.dark &#123;</span>
              {Object.entries(activeThemeOKLCH?.dark).map(([key, value]) => (
                <span className="line text-white" key={key}>
                  &nbsp;&nbsp;&nbsp;--{key}: {value};
                </span>
              ))}
              <span className="line text-white">&nbsp;&#125;</span>
            </code>
          </pre>
        </div>
      </TabsContent>
      <TabsContent value="v3">
        <div data-rehype-pretty-code-fragment="">
          <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative">
            <Button />
            <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm flex flex-col">
              <span className="line text-white">@layer base &#123;</span>
              <span className="line text-white">&nbsp;&nbsp;:root &#123;</span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--background: {activeTheme?.cssVars.light['background']};
              </span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {activeTheme?.cssVars.light['foreground']};
              </span>
              {['card', 'popover', 'primary', 'secondary', 'muted', 'accent', 'destructive'].map((prefix) => (
                <>
                  <span className="line text-white">
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{' '}
                    {activeTheme?.cssVars.light[prefix as keyof typeof activeTheme.cssVars.light]};
                  </span>
                  <span className="line text-white">
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{' '}
                    {activeTheme?.cssVars.light[`${prefix}-foreground` as keyof typeof activeTheme.cssVars.light]};
                  </span>
                </>
              ))}
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--border: {activeTheme?.cssVars.light['border']};
              </span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--input: {activeTheme?.cssVars.light['input']};
              </span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--ring: {activeTheme?.cssVars.light['ring']};
              </span>
              <span className="line text-white">&nbsp;&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;</span>
              {['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'].map((prefix) => (
                <>
                  <span className="line text-white">
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{' '}
                    {activeTheme?.cssVars.light[prefix as keyof typeof activeTheme.cssVars.light]};
                  </span>
                </>
              ))}
              <span className="line text-white">&nbsp;&nbsp;&#125;</span>
              <span className="line text-white">&nbsp;</span>
              <span className="line text-white">&nbsp;&nbsp;.dark &#123;</span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--background: {activeTheme?.cssVars.dark['background']};
              </span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {activeTheme?.cssVars.dark['foreground']};
              </span>
              {['card', 'popover', 'primary', 'secondary', 'muted', 'accent', 'destructive'].map((prefix) => (
                <>
                  <span className="line text-white">
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{' '}
                    {activeTheme?.cssVars.dark[prefix as keyof typeof activeTheme.cssVars.dark]};
                  </span>
                  <span className="line text-white">
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{' '}
                    {activeTheme?.cssVars.dark[`${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark]};
                  </span>
                </>
              ))}
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--border: {activeTheme?.cssVars.dark['border']};
              </span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--input: {activeTheme?.cssVars.dark['input']};
              </span>
              <span className="line text-white">
                &nbsp;&nbsp;&nbsp;&nbsp;--ring: {activeTheme?.cssVars.dark['ring']};
              </span>
              {['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'].map((prefix) => (
                <>
                  <span className="line text-white">
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{' '}
                    {activeTheme?.cssVars.dark[prefix as keyof typeof activeTheme.cssVars.dark]};
                  </span>
                </>
              ))}
              <span className="line text-white">&nbsp;&nbsp;&#125;</span>
              <span className="line text-white">&#125;</span>
            </code>
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function getThemeCodeOKLCH(theme: BaseColorOKLCH | undefined, radius: number) {
  if (!theme) {
    return ''
  }

  const rootSection =
    ':root {\n  --radius: ' +
    radius +
    'rem;\n' +
    Object.entries(theme.light)
      .map((entry) => '  --' + entry[0] + ': ' + entry[1] + ';')
      .join('\n') +
    '\n}\n\n.dark {\n' +
    Object.entries(theme.dark)
      .map((entry) => '  --' + entry[0] + ': ' + entry[1] + ';')
      .join('\n') +
    '\n}\n'

  return rootSection
}

function getThemeCode(theme: BaseColor | undefined, radius: number) {
  if (!theme) {
    return ''
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    radius: radius.toString(),
  })
}

const BASE_STYLES_WITH_VARIABLES = `
@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: <%- radius %>rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}
`
