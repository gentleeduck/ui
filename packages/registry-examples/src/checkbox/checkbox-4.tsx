import { CheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <CheckboxWithLabel
      checkbox={{
        defaultChecked: false,
        onCheckedChange: (state) => toast.info(`Checkbox ${state ? 'checked' : 'unchecked'}`),
      }}
      label={{ children: 'I agree to the terms and conditions' }}
      id="termss"
    />
  )
}
