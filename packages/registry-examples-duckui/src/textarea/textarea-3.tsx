import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'

export default function Textarea4Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  )
}
