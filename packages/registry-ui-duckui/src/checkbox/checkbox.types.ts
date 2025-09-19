import type { Label } from '../label'
import type { Checkbox } from './checkbox'

export type CheckedState = boolean | 'indeterminate'

export interface CheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'checked' | 'onChange' | 'defaultChecked'> {
  indicator?: React.ReactElement
  checkedIndicator?: React.ReactElement
  checked?: CheckedState
  defaultChecked?: CheckedState
  onCheckedChange?: (checked: CheckedState) => void
}

export interface CheckboxWithLabelProps extends React.HTMLProps<HTMLDivElement> {
  _checkbox: React.ComponentPropsWithoutRef<typeof Checkbox>
  _label: React.ComponentPropsWithoutRef<typeof Label>
}

export type CheckboxGroupSubtasks = { id: string; title: string; checked?: CheckedState }
export type CheckboxGroupProps = React.HTMLProps<HTMLDivElement> & {
  subtasks: CheckboxGroupSubtasks[]
  subtasks_default_values?: CheckboxWithLabelProps
}
