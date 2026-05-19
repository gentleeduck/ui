import { Label } from '@gentleduck/registry-ui/label'
import { Textarea } from '@gentleduck/registry-ui/textarea'

export default function Demo() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message" dir="rtl">
        {'رسالتك'}
      </Label>
      <Textarea id="message" placeholder="اكتب رسالتك هنا." dir="rtl" />
    </div>
  )
}
