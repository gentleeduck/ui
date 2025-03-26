import { Toggle } from '@gentelduck/registry-ui-duckui/toggle'
import { Italic } from 'lucide-react'

export default function Toggle1Demo() {
  return (
    <Toggle aria-label='Toggle italic'>
      <Italic />
      Italic
    </Toggle>
  )
}
