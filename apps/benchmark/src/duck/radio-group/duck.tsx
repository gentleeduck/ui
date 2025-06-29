import { Radio, RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" name="1" />
        <Radio value="default" id="r1x" name="3" />
        <label htmlFor="r1">Default</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" name="1" />
        <Radio value="comfortable" id="r2x" name="3" />
        <label htmlFor="r2">Comfortable</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" name="1" />
        <Radio value="compact" id="r3x" name="3" />
        <label htmlFor="r3">Compact</label>
      </div>
    </RadioGroup>
  )
}
