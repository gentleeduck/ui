import { CheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <CheckboxWithLabel
      _checkbox={{
        defaultChecked: false,
        onCheckedChange: (state) => toast.info(`Checkbox ${state ? 'checked' : 'unchecked'}`),
      }}
      _label={{ children: 'I agree to the terms and conditions' }}
      id="termss"
    />
  )
}
