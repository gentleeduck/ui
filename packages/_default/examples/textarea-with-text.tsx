import { Label } from '@/registry/default/ui/label'
import { Textarea } from '@/registry/default/ui/textarea'

export default function TextareaWithText() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea id="message-2" placeholder="Type your message here." />
      <p className="text-sm text-muted-foreground">Your message will be copied to the support team.</p>
    </div>
  )
}
