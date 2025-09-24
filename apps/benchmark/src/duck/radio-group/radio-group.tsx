import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r1" value="default" />
        <label htmlFor="r1">Default</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r2" value="comfortable" />
        <label htmlFor="r2">Comfortable</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="r3" value="compact" />
        <label htmlFor="r3">Compact</label>
      </div>
    </RadioGroup>
  )
}
