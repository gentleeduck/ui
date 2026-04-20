'use client'

import { Fit, Layout, useRive } from '@rive-app/react-canvas'

export function RiveAnimation() {
  const { RiveComponent } = useRive({
    src: '/voidzero-homepage.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain }),
  })

  return (
    <div className="mx-auto w-full max-w-[60rem] pt-6 md:pt-0" style={{ height: '435px' }}>
      <RiveComponent />
    </div>
  )
}
