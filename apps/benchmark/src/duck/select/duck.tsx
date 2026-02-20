import { CommandShortcut } from '@gentleduck/registry-ui-duckui/command'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import React from 'react'

export default function SelectDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      <CommandShortcut
        className="bg-secondary"
        keys={'ctrl+k'}
        onKeysPressed={() => {
          setOpen((prev) => !prev)
        }}>
        <span className="text-md">K</span>
      </CommandShortcut>

      <Select open={open} onOpenChange={setOpen}>
        <SelectTrigger className="w-[180px]" onClick={() => setOpen(!open)}>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}
