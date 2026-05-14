import type { Style } from '@gentleduck/registers'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

interface IConfig {
  style: Style['name']
  theme: string
  radius: number
}

const configAtom = atomWithStorage<IConfig>('config', {
  radius: 0.5,
  style: 'default',
  theme: 'zinc',
})

export function useConfig() {
  return useAtom(configAtom)
}
