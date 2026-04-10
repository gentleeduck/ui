import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email-2">Email</Label>
      <Input id="email-2" placeholder="you@example.com" type="email" />
    </div>
  )
}
