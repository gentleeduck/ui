import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Theme, THEMES } from '~/lib/themes'

type ThemesConfig = {
  activeTheme: Theme
}

const configAtom = atomWithStorage<ThemesConfig>('themes:config', {
  // ! FIX:
  // @ts-expect-errorType '{ cssVars: { light: Record<string, string>; dark: Record<string, string>; }; name: "Default"; id: "default-duckui"; colors: { readonly background: "0 0% 100%"; readonly foreground: "240 10% 3.9%"; ... 21 more ...; readonly 'chart-5': "27 87% 67%"; }; colorsDark: { ...; }; fontFamily: { ...; }; radius: 0.5; } | ... 6...' is not assignable to type '{ cssVars: { light: Record<string, string>; dark: Record<string, string>; }; name: "Default"; id: "default-duckui"; colors: { readonly background: "0 0% 100%"; readonly foreground: "240 10% 3.9%"; ... 21 more ...; readonly 'chart-5': "27 87% 67%"; }; colorsDark: { ...; }; fontFamily: { ...; }; radius: 0.5; } | ... 5...'. Type 'undefined' is not assignable to type '{ cssVars: { light: Record<string, string>; dark: Record<string, string>; }; name: "Default"; id: "default-duckui"; colors: { readonly background: "0 0% 100%"; readonly foreground: "240 10% 3.9%"; ... 21 more ...; readonly 'chart-5': "27 87% 67%"; }; colorsDark: { ...; }; fontFamily: { ...; }; radius: 0.5; } | ... 5...'.ts(2322)
  activeTheme: THEMES[0],
})

export function useThemesConfig() {
  const [themesConfig, setThemesConfig] = useAtom(configAtom)

  return { themesConfig, setThemesConfig }
}
