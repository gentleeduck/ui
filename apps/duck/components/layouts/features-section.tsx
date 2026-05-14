'use client'

import { cn } from '@gentleduck/libs/cn'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { FileCode2, FolderOpen, Upload } from 'lucide-react'
import { useState } from 'react'

const VIM_KEYS = [
  { label: 'Ctrl+K', x: '12%', y: '22%', rotate: -8 },
  { label: 'gg', x: '58%', y: '12%', rotate: 5 },
  { label: 'dd', x: '68%', y: '48%', rotate: -4 },
  { label: 'yy', x: '8%', y: '58%', rotate: 6 },
  { label: 'Ctrl+D', x: '40%', y: '68%', rotate: -3 },
  { label: ':w', x: '72%', y: '74%', rotate: 7 },
]

function VimIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 -left-8 h-48 w-48 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-2xl" />
      </div>
      {VIM_KEYS.map((key) => (
        <div
          key={key.label}
          className="absolute rounded-md border border-border/60 bg-muted/80 px-2.5 py-1 font-medium font-mono text-xs shadow-sm backdrop-blur-sm"
          style={{ left: key.x, top: key.y, rotate: `${key.rotate}deg` }}>
          {key.label}
        </div>
      ))}
    </div>
  )
}

const VARIANT_CONTROLS = [
  { name: 'default', dot: 'bg-primary' },
  { name: 'destructive', dot: 'bg-destructive/85' },
  { name: 'outline', dot: 'border border-border bg-transparent' },
  { name: 'secondary', dot: 'bg-secondary' },
  { name: 'ghost', dot: 'bg-muted' },
  { name: 'link', dot: 'bg-primary/30' },
]

function VariantsIllustration() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-center justify-center bg-muted/10">
        <div className="flex h-9 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground text-sm shadow-md">
          Button
        </div>
      </div>

      <div className="border-border/40 border-t bg-muted/20 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Controls</span>
          <span className="font-mono text-[9px] text-muted-foreground">variant</span>
        </div>
        <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
          {VARIANT_CONTROLS.map((v, i) => (
            <div key={v.name} className="flex items-center gap-1.5">
              <div
                className={cn(
                  'h-2.5 w-2.5 shrink-0 rounded-full',
                  v.dot,
                  i === 0 ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-muted/20' : '',
                )}
              />
              <span className={cn('font-mono text-[9.5px]', i === 0 ? 'text-foreground' : 'text-muted-foreground')}>
                {v.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const UPLOAD_FILES = [
  { name: 'design.figma', ext: 'fig', size: '4.2 MB', pct: 100, done: true },
  { name: 'assets.zip', ext: 'zip', size: '12.8 MB', pct: 67, done: false },
]

function UploadIllustration() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-border/50 border-dashed bg-muted/20">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-muted/60">
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-[11px] text-muted-foreground">Drop files to upload</p>
      </div>

      <div className="flex flex-col gap-2">
        {UPLOAD_FILES.map((f) => (
          <div key={f.name} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono font-semibold text-[9px] text-muted-foreground uppercase">
                {f.ext}
              </span>
              <span className="flex-1 truncate font-medium text-[11px] text-foreground">{f.name}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{f.size}</span>
              {f.done && (
                <svg className="h-3 w-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className={cn('h-full rounded-full', f.done ? 'bg-primary' : 'bg-primary/40')}
                style={{ width: `${f.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PRIMITIVE_ITEMS = [
  { name: 'Dialog', badge: 'WAI-ARIA' },
  { name: 'Popover', badge: 'WAI-ARIA' },
  { name: 'Select', badge: 'keyboard' },
  { name: 'Tooltip', badge: 'a11y' },
]

function PrimitivesIllustration() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-5 py-4">
      <div className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-sm border border-border/50 bg-muted/50" />
          <span className="font-medium text-[11px] text-foreground">{PRIMITIVE_ITEMS[0].name}</span>
        </div>
        <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-border/60 bg-card shadow-xl">
        <div className="px-3 pt-2 pb-1">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Primitives</span>
        </div>
        <div className="px-1.5 pb-1.5">
          {PRIMITIVE_ITEMS.map((item, i) => {
            const isSelected = i === 0
            return (
              <div
                key={item.name}
                className={cn('flex items-center gap-2 rounded-md px-2 py-1.5', isSelected ? 'bg-muted/70' : '')}>
                <span className="flex h-3 w-3 items-center justify-center">
                  {isSelected && (
                    <svg className="h-3 w-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span
                  className={cn('flex-1 text-[11px]', isSelected ? 'font-medium text-foreground' : 'text-foreground')}>
                  {item.name}
                </span>
                <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[8.5px] text-muted-foreground">
                  {item.badge}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const INITIAL_RANGES = [
  { from: new Date(2026, 3, 3), to: new Date(2026, 3, 9) },
  { from: new Date(2026, 3, 14), to: new Date(2026, 3, 19) },
]

function CalendarIllustration() {
  const [ranges, setRanges] = useState(INITIAL_RANGES)
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute inset-x-0 top-3 flex justify-center">
        <div style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
          <Calendar
            className="rounded-md border shadow-sm"
            mode="multi-range"
            selected={ranges}
            onSelect={(v) => v && setRanges(v as typeof INITIAL_RANGES)}
            defaultMonth={new Date(2026, 3, 1)}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent" />
    </div>
  )
}

type TreeNode = { name: string; type: 'folder' | 'file'; isNew?: boolean; children?: TreeNode[] }

const FILE_TREE: TreeNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'ui',
            type: 'folder',
            children: [
              { name: 'button.tsx', type: 'file', isNew: true },
              { name: 'dialog.tsx', type: 'file', isNew: true },
              { name: 'sheet.tsx', type: 'file', isNew: true },
              { name: 'input.tsx', type: 'file' },
            ],
          },
        ],
      },
      { name: 'app.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
]

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  return (
    <>
      <div className="flex items-center gap-1.5 rounded px-1.5 py-0.75" style={{ paddingLeft: `${8 + depth * 14}px` }}>
        {node.type === 'folder' ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <FileCode2
            className={cn(
              'h-3.5 w-3.5 shrink-0',
              node.isNew ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground',
            )}
          />
        )}
        <span
          className={cn(
            'font-mono text-[10.5px]',
            node.isNew ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground',
          )}>
          {node.name}
        </span>
        {node.isNew && (
          <span className="ml-auto rounded-sm bg-emerald-500/15 px-1 py-px font-mono text-[8px] text-emerald-700 dark:text-emerald-400">
            NEW
          </span>
        )}
      </div>
      {node.children?.map((child) => (
        <TreeRow key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

function CliIllustration() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5 py-4">
      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
        <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] text-primary">bunx</span>
        <span className="font-mono text-[10px] text-muted-foreground">@gentleduck/cli add</span>
        <span className="font-mono text-[10px] text-foreground">button dialog sheet</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/50 py-2">
        {FILE_TREE.map((node) => (
          <TreeRow key={node.name} node={node} depth={0} />
        ))}
      </div>

      <div className="flex items-center gap-1.5 font-mono text-[10px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-emerald-700 dark:text-emerald-400">3 components added</span>
        <span className="ml-auto text-muted-foreground">381ms</span>
      </div>
    </div>
  )
}

const CARDS = [
  {
    pkg: '@gentleduck/vim',
    title: 'Keyboard-first editing',
    description:
      'Bind any key sequence to any action. Vim-style modes, chord bindings, and command palette support — with custom keymap layers.',
    Illustration: VimIllustration,
  },
  {
    pkg: '@gentleduck/variants',
    title: 'Type-safe variants',
    description:
      'CVA-powered variant system with full TypeScript inference. Compound variants, default variants, and VariantProps — zero runtime overhead.',
    Illustration: VariantsIllustration,
  },
  {
    pkg: '@gentleduck/upload',
    title: 'Smart file uploads',
    description:
      'Drag-and-drop, multipart, and presigned URL uploads with progress tracking. File validation, size limits, and custom storage adapters included.',
    Illustration: UploadIllustration,
  },
  {
    pkg: '@gentleduck/primitives',
    title: 'Headless primitives',
    description:
      'Unstyled WAI-ARIA components — bring your own styles, own everything. Dialog, Popover, Select, Tooltip with full keyboard navigation.',
    Illustration: PrimitivesIllustration,
  },
  {
    pkg: '@gentleduck/calendar',
    title: 'Headless date engine',
    description:
      'Single, range, multi, and multi-range selection modes out of the box. Locale support, disabled dates, custom renderers, and pluggable adapters.',
    Illustration: CalendarIllustration,
  },
  {
    pkg: '@gentleduck/cli',
    title: 'CLI scaffolding',
    description:
      'Add, update, diff, and merge components straight into your codebase. Framework detection, config generation, full source ownership — no lock-in.',
    Illustration: CliIllustration,
  },
]

export function FeaturesSection({ className }: { className?: string }) {
  return (
    <section className={cn('container-wrapper', className)}>
      <div className="container">
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
