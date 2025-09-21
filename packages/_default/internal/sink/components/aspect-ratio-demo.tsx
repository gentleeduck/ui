import Image from 'next/image'

import { AspectRatio } from '@/registry/default/ui/aspect-ratio'

export function AspectRatioDemo() {
  return (
    <AspectRatio className="bg-muted" ratio={16 / 9}>
      <Image
        alt="Photo by Drew Beamer"
        className="h-full w-full rounded-md object-cover"
        fill
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      />
    </AspectRatio>
  )
}
