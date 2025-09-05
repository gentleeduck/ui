import { BaseColor, Style } from '@gentleduck/registers'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type Config = {
  style: Style['name']
  theme: BaseColor['name']
  radius: number
}

const configAtom = atomWithStorage<Config>('config', {
  style: 'default',
  theme: 'zinc',
  radius: 0.5,
})

export function useConfig() {
  return useAtom(configAtom)
}
