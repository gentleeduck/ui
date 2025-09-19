import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Input } from '@gentleduck/registry-ui-duckui/input'

export default function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input placeholder="Email" type="email" />
      <Button type="submit">Subscribe</Button>
    </div>
  )
}
