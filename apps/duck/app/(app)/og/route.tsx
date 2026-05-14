import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

async function loadAssets(): Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> {
  const [{ base64Font: normal }, { base64Font: semibold }] = await Promise.all([
    import('./source-sans-3-regular-woff2.json').then((mod) => mod.default || mod),
    import('./source-sans-3-semibold-woff2.json').then((mod) => mod.default || mod),
  ])

  return [
    {
      data: Buffer.from(normal, 'base64'),
      name: 'Source Sans 3',
      style: 'normal' as const,
      weight: 400 as const,
    },
    {
      data: Buffer.from(semibold, 'base64'),
      name: 'Source Sans 3',
      style: 'normal' as const,
      weight: 600 as const,
    },
  ]
}

async function loadLogo(): Promise<string> {
  const { base64Logo } = await import('./logo-base64.json').then((mod) => mod.default || mod)
  return base64Logo
}

function DuckLogo({ logoSrc, opacity, size }: { logoSrc: string; opacity: number; size: number }) {
  return (
    // biome-ignore lint/performance/noImgElement: ImageResponse markup does not support next/image.
    <img alt="" height={size} src={logoSrc} style={{ opacity }} width={size} />
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description')

  const [fonts, logoSrc] = await Promise.all([loadAssets(), loadLogo()])

  const titleLen = title?.length ?? 0
  const titleSize = titleLen > 40 ? 54 : titleLen > 25 ? 64 : 76

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        background: '#09090b',
        fontFamily: 'Source Sans 3, Source Sans Pro, ui-sans-serif, system-ui, sans-serif',
      }}
      tw="h-full w-full text-white relative overflow-hidden">
      {/* Decorations layer */}
      <div style={{ display: 'flex' }} tw="absolute inset-0">
        <div
          tw="absolute -top-20 -right-20 rounded-full"
          style={{
            display: 'flex',
            width: 520,
            height: 520,
            background: 'radial-gradient(circle, rgba(250,204,21,0.14) 0%, rgba(250,204,21,0.03) 50%, transparent 70%)',
          }}
        />

        <div
          tw="absolute -bottom-20 -left-20 rounded-full"
          style={{
            display: 'flex',
            width: 420,
            height: 420,
            background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, rgba(168,85,247,0.02) 50%, transparent 70%)',
          }}
        />

        <div
          tw="absolute rounded-full"
          style={{
            display: 'flex',
            top: '25%',
            left: '30%',
            width: 500,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(250,204,21,0.03) 0%, transparent 70%)',
          }}
        />

        <div
          tw="absolute inset-y-0 left-16 w-px"
          style={{
            display: 'flex',
            background:
              'linear-gradient(to bottom, transparent, rgba(250,204,21,0.12) 30%, rgba(168,85,247,0.08) 70%, transparent)',
          }}
        />
        <div
          tw="absolute inset-y-0 right-16 w-px"
          style={{
            display: 'flex',
            background:
              'linear-gradient(to bottom, transparent, rgba(168,85,247,0.08) 30%, rgba(250,204,21,0.12) 70%, transparent)',
          }}
        />
        <div
          tw="absolute inset-x-0 top-16 h-px"
          style={{
            display: 'flex',
            background:
              'linear-gradient(to right, transparent, rgba(250,204,21,0.12) 30%, rgba(168,85,247,0.08) 70%, transparent)',
          }}
        />
        <div
          tw="absolute inset-x-0 bottom-16 h-px"
          style={{
            display: 'flex',
            background:
              'linear-gradient(to right, transparent, rgba(168,85,247,0.08) 30%, rgba(250,204,21,0.12) 70%, transparent)',
          }}
        />

        <div
          tw="absolute"
          style={{
            display: 'flex',
            top: 12,
            left: 12,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: 'rgba(250,204,21,0.25)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: 'rgba(250,204,21,0.18)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            bottom: 12,
            left: 12,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: 'rgba(168,85,247,0.18)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            bottom: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: 'rgba(168,85,247,0.25)',
          }}
        />

        <div tw="absolute" style={{ display: 'flex', top: 30, right: 140 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.07} size={28} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 80, right: 320 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.05} size={20} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 50, right: 500 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.04} size={16} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 40, left: 350 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.05} size={22} />
        </div>

        <div tw="absolute" style={{ display: 'flex', top: 180, right: 40 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.06} size={24} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 300, right: 80 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.08} size={32} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 240, right: 200 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.04} size={18} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 320, left: 30 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.06} size={26} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 200, left: 40 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.04} size={18} />
        </div>

        <div tw="absolute" style={{ display: 'flex', top: 400, right: 160 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.07} size={30} />
        </div>
        <div tw="absolute" style={{ display: 'flex', top: 140, right: 100 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.05} size={14} />
        </div>

        <div tw="absolute" style={{ display: 'flex', bottom: 30, left: 100 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.12} size={36} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 50, left: 250 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.07} size={22} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 25, left: 420 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.09} size={28} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 60, left: 600 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.05} size={18} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 30, left: 750 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.08} size={24} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 45, right: 400 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.06} size={20} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 25, right: 200 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.1} size={34} />
        </div>
        <div tw="absolute" style={{ display: 'flex', bottom: 55, right: 80 }}>
          <DuckLogo logoSrc={logoSrc} opacity={0.07} size={26} />
        </div>

        <div
          tw="absolute"
          style={{
            display: 'flex',
            top: 120,
            right: 240,
            width: 5,
            height: 5,
            borderRadius: 3,
            background: 'rgba(250,204,21,0.10)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            top: 350,
            right: 130,
            width: 4,
            height: 4,
            borderRadius: 2,
            background: 'rgba(168,85,247,0.12)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            top: 260,
            left: 70,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: 'rgba(250,204,21,0.08)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            bottom: 80,
            left: 350,
            width: 5,
            height: 5,
            borderRadius: 3,
            background: 'rgba(168,85,247,0.10)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            bottom: 70,
            right: 320,
            width: 4,
            height: 4,
            borderRadius: 2,
            background: 'rgba(250,204,21,0.12)',
          }}
        />
        <div
          tw="absolute"
          style={{
            display: 'flex',
            top: 70,
            left: 500,
            width: 4,
            height: 4,
            borderRadius: 2,
            background: 'rgba(168,85,247,0.08)',
          }}
        />
      </div>

      {/* Content layer */}
      <div tw="flex flex-col absolute left-24 right-24 top-24 bottom-24">
        <div tw="flex items-center">
          {/* biome-ignore lint/performance/noImgElement: ImageResponse markup does not support next/image. */}
          <img alt="" height="56" src={logoSrc} width="56" />
          <div tw="flex flex-col ml-4">
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}>
              gentleduck/ui
            </span>
            <span style={{ fontSize: 14 }} tw="text-zinc-500 mt-1">
              gentleduck.org
            </span>
          </div>
        </div>

        <div
          tw="w-full mt-6"
          style={{
            display: 'flex',
            height: 1,
            background:
              'linear-gradient(to right, rgba(250,204,21,0.15), rgba(63,63,70,0.3) 50%, rgba(168,85,247,0.1) 80%, transparent)',
          }}
        />

        <div tw="flex flex-col flex-1 justify-center" style={{ alignItems: 'flex-start' }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              textAlign: 'left',
            }}>
            {title}
          </div>

          {description && (
            <div
              tw="text-zinc-400 mt-4"
              style={{
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.5,
                textAlign: 'left',
              }}>
              {description}
            </div>
          )}
        </div>

        <div
          tw="w-full mt-5"
          style={{
            display: 'flex',
            height: 2,
            borderRadius: 2,
            background: 'linear-gradient(to right, rgba(250,204,21,0.5), rgba(168,85,247,0.4) 60%, transparent)',
          }}
        />
      </div>
    </div>,
    {
      fonts,
      height: 628,
      width: 1400,
    },
  )
}
