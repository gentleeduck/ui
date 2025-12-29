import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { THEMES, Theme } from '~/lib/themes'

type ThemesConfig = {
  activeTheme: Theme
}

const configAtom = atomWithStorage<ThemesConfig>('themes:config', {
  activeTheme: THEMES[0] as Theme,
})

export function useThemesConfig() {
  const [themesConfig, setThemesConfig] = useAtom(configAtom)

  return { setThemesConfig, themesConfig }
}
