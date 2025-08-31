import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import { Gem, Minus } from 'lucide-react'

export default function Example() {
  return <Checkbox indicator={<Minus className="h-3 w-3" />} checkedIndicator={<Gem className="h-3 w-3" />} />
}
