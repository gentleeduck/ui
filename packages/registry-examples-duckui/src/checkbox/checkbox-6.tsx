import { CheckboxGroup, type CheckboxGroupSubtasks } from '@gentleduck/registry-ui-duckui/checkbox'
import { toast } from 'sonner'

export default function Example() {
  const subtasks: CheckboxGroupSubtasks[] = [
    { id: 'subtask-1', title: 'Design wireframes' },
    { id: 'subtask-2', title: 'Build UI components' },
    { id: 'subtask-3', title: 'Write documentation' },
  ]

  return (
    <CheckboxGroup
      subtasks={subtasks}
      subtasks_default_values={{
        _checkbox: { onCheckedChange: (state) => toast.info(`Checkbox ${state ? 'checked' : 'unchecked'}`) },
        _label: { className: 'text-sm text-muted-foreground' },
      }}
    />
  )
}
