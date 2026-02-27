import { ImageResponse } from 'next/og'

export const runtime = 'edge'

async function loadAssets(): Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> {
  const [{ base64Font: normal }, { base64Font: mono }, { base64Font: semibold }] = await Promise.all([
    import('./geist-regular-otf.json').then((mod) => mod.default || mod),
    import('./geistmono-regular-otf.json').then((mod) => mod.default || mod),
    import('./geist-semibold-otf.json').then((mod) => mod.default || mod),
  ])

  return [
    {
      data: Buffer.from(normal, 'base64'),
      name: 'Geist',
      style: 'normal' as const,
      weight: 400 as const,
    },
    {
      data: Buffer.from(mono, 'base64'),
      name: 'Geist Mono',
      style: 'normal' as const,
      weight: 400 as const,
    },
    {
      data: Buffer.from(semibold, 'base64'),
      name: 'Geist',
      style: 'normal' as const,
      weight: 600 as const,
    },
  ]
}

async function loadLogo(): Promise<string> {
  const { base64Logo } = await import('./logo-base64.json').then((mod) => mod.default || mod)
  return base64Logo
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description')

  const [fonts, logoSrc] = await Promise.all([loadAssets(), loadLogo()])

  return new ImageResponse(
    <div
      style={{
        background: '#09090b',
        fontFamily: 'Geist',
      }}
      tw="flex h-full w-full text-white relative overflow-hidden">
      {/* -- Grid lines -- */}
      <div
        tw="absolute inset-y-0 left-20 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, #27272a, transparent)' }}
      />
      <div
        tw="absolute inset-y-0 right-20 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, #27272a, transparent)' }}
      />
      <div
        tw="absolute inset-x-0 top-20 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #27272a, transparent)' }}
      />
      <div
        tw="absolute inset-x-0 bottom-20 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #27272a, transparent)' }}
      />

      {/* -- Blue glow - top right -- */}
      <div
        tw="absolute -top-32 -right-32 h-96 w-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
      />

      {/* -- Blue glow - bottom left -- */}
      <div
        tw="absolute -bottom-24 -left-24 h-72 w-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
      />

      {/* -- Bottom accent line -- */}
      <div
        tw="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(to right, transparent, #3b82f6, transparent)' }}
      />

      {/* -- Content container -- */}
      <div tw="flex flex-col absolute left-28 right-28 top-28 bottom-28">
        {/* -- Top: Logo + brand -- */}
        <div tw="flex flex-row items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" height="48" src={logoSrc} width="48" />
          <div tw="flex flex-col ml-4">
            <span
              style={{
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
              tw="text-2xl text-white">
              duck-ui
            </span>
            <span
              style={{
                fontFamily: 'Geist Mono',
                fontWeight: 400,
              }}
              tw="text-sm text-zinc-500">
              gentleduck.org
            </span>
          </div>
        </div>

        {/* -- Middle: Title -- */}
        <div tw="flex flex-col flex-1 justify-center">
          <div
            style={{
              fontSize: title && title.length > 30 ? 56 : title && title.length > 20 ? 64 : 80,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
            }}>
            {title}
          </div>
        </div>

        {/* -- Bottom: Description -- */}
        {description && (
          <div
            style={{
              fontWeight: 400,
              lineHeight: 1.5,
            }}
            tw="text-[28px] text-zinc-400">
            {description}
          </div>
        )}
      </div>
    </div>,
    {
      fonts,
      height: 628,
      width: 1400,
    },
  )
}
