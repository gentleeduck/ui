import { Label } from '@/registry/default/ui'
import { Textarea } from '@/registry/registry-ui-components/textarea'

export default function Textarea4Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea
        placeholder="Type your message here."
        id="message"
      />
    </div>
  )
}
