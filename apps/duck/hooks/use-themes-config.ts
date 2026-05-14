import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { THEMES, type Theme } from '~/lib'

interface IThemesConfig {
  activeTheme: Theme
}

const configAtom = atomWithStorage<IThemesConfig>('themes:config', {
  activeTheme: THEMES[0] as Theme,
})

export function useThemesConfig() {
  const [themesConfig, setThemesConfig] = useAtom(configAtom)

  return { setThemesConfig, themesConfig }
}
