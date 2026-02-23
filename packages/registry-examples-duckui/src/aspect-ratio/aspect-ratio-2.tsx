import { AspectRatio } from '@gentleduck/registry-ui-duckui/aspect-ratio'
import Image from 'next/image'

export default function AspectRatioRtlDemo() {
  return (
    <div dir="rtl">
      <AspectRatio className="rounded-lg bg-muted" ratio={'16/9'}>
        <Image
          alt="\u0635\u0648\u0631\u0629 \u0628\u0648\u0627\u0633\u0637\u0629 Drew Beamer"
          className="rounded-lg object-cover dark:grayscale"
          height={450}
          src="https://plus.unsplash.com/premium_photo-1672116453000-c31b150f48ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={800}
        />
      </AspectRatio>
    </div>
  )
}
