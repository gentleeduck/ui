'use client'

import { AspectRatio } from '../../../packages/_oldstuff_refactor/ui/ShadcnUI'

export function PromoVideo() {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border bg-white shadow-xl">
      <video autoPlay muted playsInline>
        <source src="video goes here" type="video/mp4" />
      </video>
    </AspectRatio>
  )
}
