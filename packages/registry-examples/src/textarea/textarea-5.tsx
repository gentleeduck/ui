import { Label } from '@gentleduck/registry-ui/label'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-5">Your message</Label>
      <Textarea id="message-5" placeholder="Type your message here." />
      <p className="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
    </div>
  )
}
