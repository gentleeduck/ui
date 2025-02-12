import React from 'react'
import { Button } from '@/registry/default/ui'
import { Inbox } from 'lucide-react'
import { useAtom } from 'jotai'
import { buttonVarieties } from '@/hooks/use-varieties'

export default function ButtonSimpleDemo() {
  const [variety] = useAtom(buttonVarieties)
  const { size, open, label, variant, title } = variety.default.variety!

  return (
    <>
      <Button
        isCollapsed={open}
        icon={<Inbox />}
        title={title}
        label={{
          children: label,
        }}
        variant={variant}
        size={size}
      />
    </>
  )
}
