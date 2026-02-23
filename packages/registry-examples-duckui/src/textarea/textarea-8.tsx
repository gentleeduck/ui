import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'

export default function TextareaRtlDemo() {
  return (
    <div dir="rtl">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message">{'\u0631\u0633\u0627\u0644\u062A\u0643'}</Label>
        <Textarea id="message" placeholder="\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u062A\u0643 \u0647\u0646\u0627." />
      </div>
    </div>
  )
}
