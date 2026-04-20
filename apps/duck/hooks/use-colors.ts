import * as jotai from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { ColorFormat } from '~/lib'
import { useMounted } from './use-mounted'

/** @internal */
interface IConfig {
  format: ColorFormat
  lastCopied: string
}

const colorsAtom = atomWithStorage<IConfig>('colors', {
  format: 'hsl',
  lastCopied: '',
})

export function useColors() {
  const [colors, setColors] = jotai.useAtom(colorsAtom)
  const mounted = useMounted()

  return {
    format: colors.format,
    isLoading: !mounted,
    lastCopied: colors.lastCopied,
    setFormat: (format: ColorFormat) => setColors({ ...colors, format }),
    setLastCopied: (lastCopied: string) => setColors({ ...colors, lastCopied }),
  }
}
