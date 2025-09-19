'use client'

import { Progress } from '@gentleduck/registry-ui-duckui/progress'
import * as React from 'react'

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress className="w-[60%]" value={progress} />
}
