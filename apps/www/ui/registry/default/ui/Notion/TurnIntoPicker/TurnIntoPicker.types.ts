import { useTextmenuCommands, useTextmenuStates } from '@/hooks'

export type TurnIntoPickerProps = {
  onChange: (value: string) => void
  value: string
  commands: ReturnType<typeof useTextmenuCommands>
  states: ReturnType<typeof useTextmenuStates>
}
