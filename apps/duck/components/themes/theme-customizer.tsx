'use client'

import { cn } from '@gentleduck/libs/cn'
import type { ThemeName } from '@gentleduck/registers'
import { THEME_NAMES, themeRegistry } from '@gentleduck/registers'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@gentleduck/registry-ui/drawer'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Skeleton } from '@gentleduck/registry-ui/skeleton'
import { CheckIcon, MoonIcon, RotateCcwIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { useConfig } from '~/hooks/use-config'
import { CopyButton } from '../copy-button'

export function ThemeCustomizer() {
  return (
    <div className="flex items-center gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="md:hidden" size="sm">
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6 pt-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Customize theme</DrawerTitle>
          </DrawerHeader>
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden items-center md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">Customize</Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="z-40 w-auto max-w-93.75 rounded-xl bg-white p-6 dark:bg-zinc-950">
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
      <CopyCodeButton className="[&_svg]:hidden" size="sm" variant="ghost" />
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

  return (
    <div className="flex flex-col space-y-4 md:space-y-6">
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">Customize</div>
          <div className="text-muted-foreground text-xs">Pick a style and color for your components.</div>
        </div>
        <Button
          className="ml-auto rounded-lg"
          onClick={() => {
            setConfig({
              ...config,
              radius: 0.5,
              theme: 'zinc',
            })
          }}
          size="icon"
          variant="ghost">
          <RotateCcwIcon aria-hidden="true" />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {THEME_NAMES.map((name) => {
              const entry = themeRegistry[name]
              const isActive = config.theme === name
              const previewColor = mode === 'dark' ? entry.dark.primary : entry.light.primary

              return mounted ? (
                <Button
                  className={cn('justify-start', isActive && 'border-2 border-primary')}
                  key={name}
                  onClick={() => {
                    setConfig({
                      ...config,
                      theme: name,
                    })
                  }}
                  size="sm"
                  style={
                    {
                      '--theme-primary': previewColor,
                    } as React.CSSProperties
                  }
                  variant={'outline'}>
                  <span
                    className={cn(
                      'mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-(--theme-primary)',
                    )}>
                    {isActive && <CheckIcon aria-hidden="true" className="size-3! text-white" />}
                  </span>
                  {entry.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={name} />
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
                  className={cn(config.radius === parseFloat(value) && 'border-2 border-primary')}
                  key={value}
                  onClick={() => {
                    setConfig({
                      ...config,
                      radius: parseFloat(value),
                    })
                  }}
                  size="sm"
                  variant={'outline'}>
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
                  className={cn(mode === 'light' && 'border-2 border-primary')}
                  onClick={() => setMode('light')}
                  size="sm"
                  variant={'outline'}>
                  <SunIcon aria-hidden="true" className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  className={cn(mode === 'dark' && 'border-2 border-primary')}
                  onClick={() => setMode('dark')}
                  size="sm"
                  variant={'outline'}>
                  <MoonIcon aria-hidden="true" className="mr-1 -translate-x-1" />
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
        <DialogContent className="w-75 outline-none md:w-125 lg:w-150">
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
  const activeTheme = React.useMemo(
    () => themeRegistry[config.theme as ThemeName] ?? themeRegistry.zinc,
    [config.theme],
  )

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  }, [hasCopied])

  return (
    <div className="relative">
      <CopyButton className="absolute top-4 right-4" value={getThemeCode(activeTheme, config.radius)} />
      <div data-rehype-pretty-code-fragment="">
        <pre className="relative max-h-112.5 overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
          <code className="relative flex flex-col rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
            <span className="line text-white">&nbsp;:root &#123;</span>
            <span className="line text-white">&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;</span>
            {Object.entries(activeTheme.light).map(([key, value]) => (
              <span className="line text-white" key={key}>
                &nbsp;&nbsp;&nbsp;--{key}: {`${value};`}
              </span>
            ))}
            <span className="line text-white">&nbsp;&#125;</span>
            <span className="line text-white">&nbsp;</span>
            <span className="line text-white">&nbsp;.dark &#123;</span>
            {Object.entries(activeTheme.dark).map(([key, value]) => (
              <span className="line text-white" key={key}>
                &nbsp;&nbsp;&nbsp;--{key}: {`${value};`}
              </span>
            ))}
            <span className="line text-white">&nbsp;&#125;</span>
          </code>
        </pre>
      </div>
    </div>
  )
}

function getThemeCode(theme: { light: Record<string, string>; dark: Record<string, string> }, radius: number) {
  const rootSection =
    ':root {\n  --radius: ' +
    radius +
    'rem;\n' +
    Object.entries(theme.light)
      .map((entry) => `  --${entry[0]}: ${entry[1]};`)
      .join('\n') +
    '\n}\n\n.dark {\n' +
    Object.entries(theme.dark)
      .map((entry) => `  --${entry[0]}: ${entry[1]};`)
      .join('\n') +
    '\n}\n'

  return rootSection
}
