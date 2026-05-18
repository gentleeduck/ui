'use client'

import { useAtom } from 'jotai'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { themeAtom } from '@/lib/theme'

export function ThemeSwitcher() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(theme === 'bun' ? 'light' : 'bun')}
      aria-label={`Switch to ${theme === 'bun' ? 'light' : 'bun'} theme`}>
      {theme === 'bun' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </Button>
  )
}
