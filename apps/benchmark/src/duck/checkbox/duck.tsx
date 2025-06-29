import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import { Check } from 'lucide-react'

export default function CheckboxDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox indicator={<Check />} className="text-blue-400" id="terms" />
      </div>
    </div>
  )
}
