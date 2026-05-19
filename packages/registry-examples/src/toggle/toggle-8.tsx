import { Toggle } from '@gentleduck/registry-ui/toggle'
import { Bold } from 'lucide-react'

export default function Demo() {
  return (
    <Toggle aria-label="تبديل الخط العريض" dir="rtl">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}
