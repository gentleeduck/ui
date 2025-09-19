import { AspectRatio } from '@gentleduck/registry-ui-duckui/aspect-ratio'
import Image from 'next/image'

export default function AspectRatioDemo() {
  return (
    <AspectRatio className="rounded-lg bg-muted" ratio={'16/9'}>
      <Image
        alt="Photo by Drew Beamer"
        className="rounded-lg object-cover dark:grayscale"
        height={450}
        src="https://plus.unsplash.com/premium_photo-1672116453000-c31b150f48ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        width={800}
      />
    </AspectRatio>
  )
}
