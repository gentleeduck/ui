'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { FileCode2, FolderOpen, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

/* ── 1. Vim ─────────────────────────────────────────────────── */
const VIM_KEYS = [
  { label: 'Ctrl+K', x: '12%', y: '22%', rotate: -8, delay: 0, dur: 2.8 },
  { label: 'gg', x: '58%', y: '12%', rotate: 5, delay: 0.4, dur: 2.4 },
  { label: 'dd', x: '68%', y: '48%', rotate: -4, delay: 0.8, dur: 3.1 },
  { label: 'yy', x: '8%', y: '58%', rotate: 6, delay: 0.2, dur: 2.6 },
  { label: 'Ctrl+D', x: '40%', y: '68%', rotate: -3, delay: 1.0, dur: 2.2 },
  { label: ':w', x: '72%', y: '74%', rotate: 7, delay: 0.6, dur: 3.4 },
]

function VimIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 -left-8 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-2xl" />
      </div>
      {VIM_KEYS.map((key) => (
        <motion.div
          key={key.label}
          className="absolute rounded-md border border-border/60 bg-muted/80 px-2.5 py-1 font-medium font-mono text-xs shadow-sm backdrop-blur-sm"
          style={{ left: key.x, top: key.y, rotate: key.rotate }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: key.dur, repeat: Infinity, ease: 'easeInOut', delay: key.delay }}>
          {key.label}
        </motion.div>
      ))}
    </div>
  )
}

import { codeToHtml } from 'shiki'

async function VariantsIllustration() {
  const html = await codeToHtml(
    `const buttonVariants = cva('...', { ... })

<Button variant='default'>
`,
    {
      lang: 'tsx',
      theme: 'catppuccin-mocha',
    },
  )

  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5 py-4">
      {/* <div className="flex flex-1 items-center justify-center rounded-xl border border-border/40 bg-muted/10"></div> */}
      <div className="flex flex-col gap-12">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Button variant="default" className="w-fit place-self-end">
          Button
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-1.5"></div>
    </div>
  )
}

/* ── 3. Upload ──────────────────────────────────────────────── */
const UPLOAD_FILES = [
  { name: 'design.figma', ext: 'fig', size: '4.2 MB', pct: 100, done: true },
  { name: 'assets.zip', ext: 'zip', size: '12.8 MB', pct: 67, done: false },
]

function UploadIllustration() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-border/50 border-dashed bg-muted/20">
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-muted/60"
          animate={{ y: [0, -5, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        <p className="text-[11px] text-muted-foreground">Drop files to upload</p>
      </div>

      <div className="flex flex-col gap-2">
        {UPLOAD_FILES.map((f, i) => (
          <motion.div
            key={f.name}
            className="flex flex-col gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut', delay: i * 0.15 + 0.1 }}>
            <div className="flex items-center gap-2">
              <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono font-semibold text-[9px] text-muted-foreground uppercase">
                {f.ext}
              </span>
              <span className="flex-1 truncate font-medium text-[11px] text-foreground/80">{f.name}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{f.size}</span>
              {f.done && (
                <motion.svg
                  className="h-3 w-3 text-foreground/60"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: [0.6, 1.1, 1] }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className={cn('h-full rounded-full', f.done ? 'bg-primary' : 'bg-primary/40')}
                style={{
                  width: mounted ? `${f.pct}%` : '0%',
                  transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.3}s`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 4. Primitives ──────────────────────────────────────────── */
const PRIMITIVE_ITEMS = [
  { name: 'Dialog', badge: 'WAI-ARIA' },
  { name: 'Popover', badge: 'WAI-ARIA' },
  { name: 'Select', badge: 'keyboard' },
  { name: 'Tooltip', badge: 'a11y' },
]

function PrimitivesIllustration() {
  const [selectedIdx, setSelectedIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSelectedIdx((i) => (i + 1) % PRIMITIVE_ITEMS.length), 1600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-5 py-4">
      <div className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-sm border border-border/50 bg-muted/50" />
          <AnimatePresence mode="wait">
            <motion.span
              key={PRIMITIVE_ITEMS[selectedIdx].name}
              className="font-medium text-[11px] text-foreground/70"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}>
              {PRIMITIVE_ITEMS[selectedIdx].name}
            </motion.span>
          </AnimatePresence>
        </div>
        <svg className="h-3.5 w-3.5 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-border/60 bg-card shadow-xl">
        <div className="px-3 pt-2 pb-1">
          <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">Primitives</span>
        </div>
        <div className="px-1.5 pb-1.5">
          {PRIMITIVE_ITEMS.map((item, i) => {
            const isSelected = i === selectedIdx
            return (
              <motion.div
                key={item.name}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-300',
                  isSelected ? 'bg-muted/70' : '',
                )}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut', delay: i * 0.06 }}>
                <span className="flex h-3 w-3 items-center justify-center">
                  <AnimatePresence>
                    {isSelected && (
                      <motion.svg
                        className="h-3 w-3 text-foreground/70"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: [0.6, 1.15, 1] }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className={cn(
                    'flex-1 text-[11px] transition-colors duration-300',
                    isSelected ? 'font-medium text-foreground/90' : 'text-foreground/50',
                  )}>
                  {item.name}
                </span>
                <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[8.5px] text-muted-foreground/50">
                  {item.badge}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── 5. Calendar ────────────────────────────────────────────── */
function CalendarIllustration() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="absolute inset-x-0 top-3 flex justify-center"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <div style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
          <Calendar className="rounded-md border shadow-sm" mode="single" onSelect={setDate} selected={date} />
        </div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
    </div>
  )
}

/* ── 6. CLI ─────────────────────────────────────────────────── */
type TreeNode = { name: string; type: 'folder' | 'file'; isNew?: boolean; children?: TreeNode[]; delay?: number }

const FILE_TREE: TreeNode[] = [
  {
    name: 'src',
    type: 'folder',
    delay: 0,
    children: [
      {
        name: 'components',
        type: 'folder',
        delay: 1,
        children: [
          {
            name: 'ui',
            type: 'folder',
            delay: 2,
            children: [
              { name: 'button.tsx', type: 'file', isNew: true, delay: 3 },
              { name: 'dialog.tsx', type: 'file', isNew: true, delay: 4 },
              { name: 'sheet.tsx', type: 'file', isNew: true, delay: 5 },
              { name: 'input.tsx', type: 'file', delay: 6 },
            ],
          },
        ],
      },
      { name: 'app.tsx', type: 'file', delay: 7 },
      { name: 'main.tsx', type: 'file', delay: 8 },
    ],
  },
  { name: 'package.json', type: 'file', delay: 9 },
]

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const d = (node.delay ?? 0) * 0.06
  return (
    <>
      <motion.div
        className="flex items-center gap-1.5 rounded px-1.5 py-[3px]"
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut', delay: d }}>
        {node.type === 'folder' ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        ) : (
          <FileCode2
            className={cn('h-3.5 w-3.5 shrink-0', node.isNew ? 'text-emerald-500' : 'text-muted-foreground/35')}
          />
        )}
        <span className={cn('font-mono text-[10.5px]', node.isNew ? 'text-emerald-400' : 'text-muted-foreground/60')}>
          {node.name}
        </span>
        {node.isNew && (
          <motion.span
            className="ml-auto rounded-sm bg-emerald-500/15 px-1 py-px font-mono text-[8px] text-emerald-500"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: [0.6, 1.1, 1] }}
            transition={{ duration: 0.35, ease: 'easeInOut', delay: d + 0.2 }}>
            NEW
          </motion.span>
        )}
      </motion.div>
      {node.children?.map((child) => (
        <TreeRow key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

function CliIllustration() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5 py-4">
      <motion.div
        className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] text-primary">bunx</span>
        <span className="font-mono text-[10px] text-muted-foreground/60">@gentleduck/cli add</span>
        <span className="font-mono text-[10px] text-foreground/70">button dialog sheet</span>
      </motion.div>

      <div className="overflow-hidden rounded-lg border border-border/50 py-2">
        {FILE_TREE.map((node) => (
          <TreeRow key={node.name} node={node} depth={0} />
        ))}
      </div>

      <motion.div
        className="flex items-center gap-1.5 font-mono text-[10px]"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.6 }}>
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-emerald-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-emerald-500">3 components added</span>
        <span className="ml-auto text-muted-foreground/40">381ms</span>
      </motion.div>
    </div>
  )
}

/* ── Cards ──────────────────────────────────────────────────── */
const CARDS = [
  {
    pkg: '@gentleduck/vim',
    title: 'Keyboard-first editing',
    description: 'Bind any key sequence to any action. Vim-style modes, motions, and command palette support.',
    Illustration: VimIllustration,
  },
  {
    pkg: '@gentleduck/variants',
    title: 'Type-safe variants',
    description: 'CVA-powered variant system with full TypeScript inference. Zero runtime overhead.',
    Illustration: VariantsIllustration,
  },
  {
    pkg: '@gentleduck/upload',
    title: 'Smart file uploads',
    description: 'Drag-and-drop, multipart, presigned URLs, and progress tracking — batteries included.',
    Illustration: UploadIllustration,
  },
  {
    pkg: '@gentleduck/primitives',
    title: 'Headless primitives',
    description: 'Unstyled, accessible components built on WAI-ARIA. Bring your own styles, own everything.',
    Illustration: PrimitivesIllustration,
  },
  {
    pkg: '@gentleduck/calendar',
    title: 'Headless date engine',
    description: 'Adapter-based calendar with range selection, locale support, and custom renderers.',
    Illustration: CalendarIllustration,
  },
  {
    pkg: '@gentleduck/cli',
    title: 'CLI scaffolding',
    description:
      'Add, update, remove, diff, and merge components directly into your codebase. No lock-in, full source ownership.',
    Illustration: CliIllustration,
  },
]

export function FeaturesSection({ className }: { className?: string }) {
  return (
    <section className={cn('container-wrapper', className)}>
      <div className="container border-x">
        <div className="py-16 md:py-24">
          <div className="mb-10 text-center">
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Everything your stack needs
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Composable packages that work together or standalone. Each ships with full source — no black boxes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map(({ pkg, title, description, Illustration }) => (
              <div
                key={pkg}
                className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-colors hover:border-border">
                <div className="pointer-events-none relative h-52 select-none">
                  <Illustration />
                </div>
                <div className="border-border/50 border-t p-5">
                  <p className="mb-1 font-mono text-[11px] text-muted-foreground">{pkg}</p>
                  <h3 className="mb-1.5 font-semibold text-sm">{title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
