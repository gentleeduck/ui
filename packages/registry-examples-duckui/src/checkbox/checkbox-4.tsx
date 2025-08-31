import { CheckboxWithLabel } from '@gentleduck/registry-ui-duckui/checkbox'
import { toast } from 'sonner'

export default function Example() {
  return (
    <CheckboxWithLabel
      id="termss"
      _checkbox={{
        defaultChecked: false,
        onCheckedChange: (state) => toast.info(`Checkbox ${state ? 'checked' : 'unchecked'}`),
      }}
      _label={{ children: 'I agree to the terms and conditions' }}
    />
  )
}
