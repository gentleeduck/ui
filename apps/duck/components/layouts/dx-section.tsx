import { cn } from '@gentleduck/libs/cn'
import { codeToHtml } from 'shiki'

const SHIKI_OPTIONS = {
  theme: 'catppuccin-macchiato',
  transformers: [
    {
      pre(node: { properties: Record<string, unknown> }) {
        node.properties['class'] = 'overflow-x-auto p-5 text-[12px] leading-[1.75]'
        node.properties['style'] = 'background:transparent'
      },
    },
  ],
} as const

const FEATURES: {
  label: string
  body: string
  pkg: string
  color: string
  lang: string
  filename?: string
  code: string
}[] = [
  {
    label: 'One command, ship components',
    body: 'The CLI fetches from the registry, resolves peers, and drops files directly into your project.',
    pkg: '@gentleduck/cli',
    color: '#4ade80',
    lang: 'bash',
    code: `
$ bunx @gentleduck/cli add button dialog sheet

  ✓ fetching registry...
  ✓ resolving peer dependencies
  ✓ button.tsx   → components/ui/button.tsx
  ✓ dialog.tsx   → components/ui/dialog.tsx
  ✓ sheet.tsx    → components/ui/sheet.tsx

  3 components installed in 381ms
`.trim(),
  },
  {
    label: 'Variants with full inference',
    body: 'cva() builds a type-safe variant system. Every valid prop combination is known at edit time.',
    pkg: '@gentleduck/variants',
    color: '#f472b6',
    lang: 'tsx',
    filename: 'button.tsx',
    code: `
import { cva, type VariantProps } from '@gentleduck/variants'

const button = cva(
  'inline-flex items-center gap-2 rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        ghost:   'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-transparent',
      },
      size: { sm: 'h-8 px-3 text-xs', md: 'h-9 px-4', lg: 'h-11 px-6' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

type Props = VariantProps<typeof button>
`.trim(),
  },
  {
    label: 'Headless, accessible primitives',
    body: 'Composable building blocks with full a11y built in. Bring your own styles, own every pixel.',
    pkg: '@gentleduck/primitives',
    color: '#a78bfa',
    lang: 'tsx',
    filename: 'confirm-dialog.tsx',
    code: `
import { Dialog } from '@gentleduck/primitives'

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <button>Delete account</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2 rounded-lg p-6">
      <Dialog.Title>Are you sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone.
      </Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
`.trim(),
  },
  {
    label: 'Keyboard-first, zero lock-in',
    body: 'Bind commands in one call. Works in Next.js, Remix, and Vite — same API, same types.',
    pkg: '@gentleduck/vim',
    color: '#f87171',
    lang: 'tsx',
    filename: 'app.tsx',
    code: `
import { useVim } from '@gentleduck/vim'

useVim(
  {
    'mod+k':       () => setCommandOpen(true),
    'mod+shift+p': () => setPaletteOpen(true),
    'mod+s':       () => save(),
    'escape':      () => closeAll(),
  },
  { enabled: !isInputFocused },
)
`.trim(),
  },
  {
    label: 'File uploads, every strategy',
    body: 'Multipart, chunked, presigned URL — one hook, one API surface, swappable at config time.',
    pkg: '@gentleduck/upload',
    color: '#3b82f6',
    lang: 'tsx',
    filename: 'upload.tsx',
    code: `
import { useUpload } from '@gentleduck/upload'

const { upload, progress, status } = useUpload({
  strategy: 'multipart',
  chunkSize: 5 * 1024 * 1024,
  onProgress: (pct) => setProgress(pct),
  onComplete: (url)  => setValue(url),
})

const { upload: uploadS3 } = useUpload({
  strategy: 'presigned',
  getUrl:   (file) => fetchPresignedUrl(file.name),
})
`.trim(),
  },
  {
    label: 'Headless calendar engine',
    body: 'Date-adapter architecture — swap date-fns, Temporal, or Luxon without changing your tree.',
    pkg: '@gentleduck/calendar',
    color: '#fb923c',
    lang: 'tsx',
    filename: 'calendar.tsx',
    code: `
import { createCalendar }  from '@gentleduck/calendar'
import { dateFnsAdapter } from '@gentleduck/calendar/date-fns'

const cal = createCalendar({
  adapter: dateFnsAdapter,
  mode:    'range',
  locale:  'en-US',
})

function DatePicker() {
  const { days, navigate, selected } = cal.useCalendar()

  return (
    <div className="grid grid-cols-7">
      {days.map((day) => (
        <button key={day.iso} onClick={() => day.select()}
          data-selected={day.isSelected}>
          {day.label}
        </button>
      ))}
    </div>
  )
}
`.trim(),
  },
  {
    label: 'Roles, permissions, policies',
    body: 'Declarative access control that lives next to your UI. No middleware maze, no context drilling.',
    pkg: '@gentleduck/iam',
    color: '#ef4444',
    lang: 'tsx',
    filename: 'policy.ts',
    code: `
import { createPolicy, usePermission } from '@gentleduck/iam'

export const policy = createPolicy({
  roles: {
    admin:  ['*'],
    editor: ['content:read', 'content:write'],
    viewer: ['content:read'],
  },
})

function EditButton() {
  const can = usePermission('content:write')
  return can ? <button>Edit</button> : null
}
`.trim(),
  },
  {
    label: 'Enter/exit animations',
    body: 'Animate mount and unmount without fighting the DOM. Composable with any trigger — state, route, or event.',
    pkg: '@gentleduck/motion',
    color: '#c084fc',
    lang: 'tsx',
    filename: 'tooltip.tsx',
    code: `
import { AnimatePresence, Motion } from '@gentleduck/motion'

function Tooltip({ open, children }) {
  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          enter={{ opacity: 1, y: 0,   scale: 1    }}
          exit={  { opacity: 0, y: -4,  scale: 0.97 }}
          duration={120}
          className="rounded-md bg-popover px-3 py-1.5
            text-sm shadow-md">
          {children}
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
`.trim(),
  },
]

export async function DxSection({ className }: { className?: string }) {
  const highlighted = await Promise.all(FEATURES.map((f) => codeToHtml(f.code, { lang: f.lang, ...SHIKI_OPTIONS })))

  return (
    <section className={cn('container-wrapper', className)}>
      <div className="container border-x">
        {/* Headline */}
        <div className="border-b py-16 text-center md:py-24">
          <p className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-widest">developer experience</p>
          <h2 className="mx-auto max-w-2xl text-balance font-semibold text-3xl leading-tight tracking-tight sm:text-4xl xl:text-5xl">
            Redefining developer experience
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            gentleduck makes web development enjoyable again
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-y-0">
          {FEATURES.map((f, i) => {
            const isRight = i % 2 === 1
            const rowStart = Math.floor(i / 2) * 2
            const isNewRow = i >= 2

            return (
              <div
                key={f.label}
                className={cn('group flex flex-col', isRight && 'md:border-l', isNewRow && 'md:border-t')}>
                {/* Text */}
                <div className="px-8 pt-8 pb-6 md:px-10 md:pt-10">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: f.color }}>
                    {f.pkg}
                  </p>
                  <h3 className="mb-1.5 font-semibold text-base text-foreground">{f.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
                </div>

                {/* Code visual */}
                <div className="relative mx-6 mb-6 overflow-hidden rounded-lg border border-border/50 md:mx-8 md:mb-8">
                  {/* Titlebar */}
                  <div className="flex items-center gap-3 border-white/[0.06] border-b px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    {f.filename && <span className="font-mono text-[10px] text-white/30">{f.filename}</span>}
                  </div>

                  {/* Highlighted code */}
                  {/* biome-ignore lint/security/noDangerouslySetInnerHtml: shiki server-rendered */}
                  <div className="relative" dangerouslySetInnerHTML={{ __html: highlighted[i] }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t" />
      </div>
    </section>
  )
}
