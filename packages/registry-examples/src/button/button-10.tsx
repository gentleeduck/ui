'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { ArrowRight, Mail, PanelLeftClose, RefreshCw, Send } from 'lucide-react'
import * as React from 'react'

export default function Demo() {
  const [loading1, setLoading1] = React.useState(false)
  const [loading2, setLoading2] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const handleLoad = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <MotionButton>Default</MotionButton>
      <MotionButton variant="outline" icon={<Mail />}>
        Email
      </MotionButton>
      <MotionButton variant="ghost" secondIcon={<ArrowRight />}>
        Next
      </MotionButton>
      <MotionButton variant="default" icon={<Send />} loading={loading1} onClick={() => handleLoad(setLoading1)}>
        Submit
      </MotionButton>
      <MotionButton
        variant="secondary"
        icon={<RefreshCw />}
        secondIcon={<ArrowRight />}
        loading={loading2}
        onClick={() => handleLoad(setLoading2)}>
        Sync
      </MotionButton>
      <MotionButton
        variant="outline"
        icon={<PanelLeftClose />}
        isCollapsed={collapsed}
        onClick={() => setCollapsed((c) => !c)}>
        Sidebar
      </MotionButton>
    </div>
  )
}
