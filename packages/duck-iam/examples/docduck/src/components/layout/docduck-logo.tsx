import Image from 'next/image'

interface DocDuckLogoProps {
  size?: number
  className?: string
}

export function DocDuckLogo({ size = 24, className }: DocDuckLogoProps) {
  return <Image src="/logo.png" alt="DocDuck" width={size} height={size} className={className} />
}
