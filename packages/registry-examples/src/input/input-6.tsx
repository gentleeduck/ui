import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input placeholder="Email" type="email" />
      <Button type="submit">Subscribe</Button>
    </div>
  )
}
