'use client'

import { Progress } from '@gentleduck/registry-ui/progress'
import * as React from 'react'

export default function Demo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress className="w-[60%]" value={progress} />
}
