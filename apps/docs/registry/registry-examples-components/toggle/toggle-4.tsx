import { Toggle } from '@/registry/registry-ui-components/toggle'
import { Italic } from 'lucide-react'

export default function Toggle1Demo() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  )
}
