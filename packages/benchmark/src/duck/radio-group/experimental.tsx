import { Radio } from '@gentelduck/registry-ui-duckui/experimental/radio'

export default function RadioGroupDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Radio value="default" name="r1c" id="r1c" />
      <label htmlFor="r1c">Default</label>
      <Radio value="comfortable" name="r1c" id="r2c" />
      <label htmlFor="r2c">Comfortable</label>
      <Radio value="compact" name="r1c" id="r3c" />
      <label htmlFor="r3c">Compact</label>
    </div>
  )
}
