import { Switch } from '@gentleduck/registry-ui-duckui/switch'
import { Moon, Sun } from 'lucide-react'

export default function SwitchDemo() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Switch id="terms" />
        <Switch checkedIndicator={<Sun />} id="terms" indicator={<Moon />} />
      </div>
    </div>
  )
}
