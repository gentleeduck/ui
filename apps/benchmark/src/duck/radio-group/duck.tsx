import { Radio, RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'
import { Circle, CircleAlertIcon } from 'lucide-react'

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r1" name="1" value="default" />
        <Radio id="r1x" indicator={<Circle />} name="3" value="default" />
        <label htmlFor="r1">Default</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r2" name="1" value="comfortable" />
        <Radio id="r2x" name="3" value="comfortable" />
        <label htmlFor="r2">Comfortable</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r3" name="1" value="compact" />
        <Radio id="r3x" name="3" value="compact" />
        <label htmlFor="r3">Compact</label>
      </div>
    </RadioGroup>
  )
}
