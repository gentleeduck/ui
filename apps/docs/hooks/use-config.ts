import { BaseColor, Style } from '@gentleduck/registers'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type Config = {
  style: Style['name']
  theme: BaseColor['name']
  radius: number
}

const configAtom = atomWithStorage<Config>('config', {
  radius: 0.5,
  style: 'default',
  theme: 'zinc',
})

export function useConfig() {
  return useAtom(configAtom)
}
