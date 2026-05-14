'use client'

import { cn } from '@gentleduck/libs/cn'
import { ArrowLeft, ArrowUp, Check, Copy, FileText, Loader, Sparkles, Square, X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import Markdown from 'react-markdown'
import { type IChatMessage, type IChatSource, useAIChat } from '~/hooks/use-ai-chat'

let shikiPromise: Promise<typeof import('shiki') | null> | null = null
function getShiki() {
  if (!shikiPromise) shikiPromise = import('shiki').catch(() => null)
  return shikiPromise
}

interface IAIChatPanelProps {
  initialQuery?: string
  onBack: () => void
  onClose?: () => void
  title?: string
  placeholder?: string
  emptyMessage?: string
}

export function AIChatPanel({
  initialQuery,
  onBack,
  onClose,
  title = 'Ask about gentleduck/ui',
  placeholder = 'Ask a question...',
  emptyMessage = 'Ask anything about components, installation, or usage.',
}: IAIChatPanelProps) {
  const { messages, isStreaming, isSearching, error, send, selectSource, abort, reset } = useAIChat()
  const [input, setInput] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const sentInitial = React.useRef(false)

  React.useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true
      send(initialQuery)
    }
  }, [initialQuery, send])

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        const val = (e.target as HTMLInputElement).value
        if (val.trim()) {
          send(val)
          ;(e.target as HTMLInputElement).value = ''
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        if (onClose) {
          reset()
          onClose()
        }
      }
    },
    [send, reset, onClose],
  )

  const lastMsg = messages[messages.length - 1]
  const showCrafting = isStreaming && lastMsg?.status === 'streaming' && !lastMsg?.content

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b px-3">
        <button
          type="button"
          onClick={() => {
            reset()
            onBack()
          }}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>
        <Sparkles aria-hidden="true" className="size-3.5 text-muted-foreground" />
        <span className="flex-1 font-medium text-sm">{title}</span>
        {onClose && (
          <button
            type="button"
            onClick={() => {
              reset()
              onClose()
            }}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !isSearching && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Sparkles aria-hidden="true" className="size-5 text-muted-foreground" />
            </div>
            <p className="max-w-60 text-muted-foreground text-sm leading-relaxed">{emptyMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => {
            if (msg.status === 'streaming' && !msg.content) return null
            return <MemoMessageBubble key={msg.id} message={msg} onSelectSource={selectSource} />
          })}
        </div>

        {isSearching && (
          <div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-xs">
            <Loader aria-hidden="true" className="size-3 animate-spin" />
            <span>Searching...</span>
          </div>
        )}
        {showCrafting && (
          <div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-xs">
            <Sparkles aria-hidden="true" className="size-3 animate-[pulse_1.5s_ease-in-out_infinite]" />
            <span>Crafting your answer...</span>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isStreaming || isSearching}
            className="h-9 flex-1 rounded-lg border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={abort}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Square aria-hidden="true" className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!input.trim() || isSearching}
              onClick={() => {
                if (input.trim()) {
                  send(input)
                  setInput('')
                }
              }}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30">
              <ArrowUp aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-destructive text-xs">{error}</p>}
      </div>
    </div>
  )
}

const ShikiCodeBlock = React.memo(function ShikiCodeBlock({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => {
    // Debounce shiki — streaming chunks would otherwise re-highlight per token.
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      let cancelled = false
      getShiki()
        .then((shiki) => {
          if (!shiki || cancelled) return null
          const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
          return shiki.codeToHtml(code, {
            lang: language || 'text',
            theme: isDark ? 'catppuccin-mocha' : 'github-light',
            transformers: [
              {
                pre(node) {
                  node.properties['class'] =
                    'no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 !bg-transparent text-[13px] leading-relaxed'
                },
              },
            ],
          })
        })
        .then((result) => {
          if (!cancelled && result) setHtml(result)
        })
        .catch(() => {})
      return () => {
        cancelled = true
      }
    }, 150)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [code, language])

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="group/code relative my-4 overflow-hidden rounded-lg border bg-muted/30">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="font-mono text-muted-foreground text-xs">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground">
          {copied ? <Check aria-hidden="true" className="size-3" /> : <Copy aria-hidden="true" className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {html ? (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-sanitized HTML from syntax highlighter
        <div className="[&_pre]:m-0!" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
})

const markdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-2 scroll-m-20 font-bold text-xl" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-6 scroll-m-20 border-b pb-2 font-semibold text-lg tracking-tight first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-4 scroll-m-20 font-semibold text-base tracking-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-4 font-semibold text-sm tracking-tight" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="not-first:mt-3 leading-7" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('/') || href?.includes('gentleduck.org')) {
      return (
        <Link href={href} className="font-medium text-primary underline underline-offset-4" {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        target="_blank"
        rel="noreferrer"
        {...props}>
        {children}
      </a>
    )
  },
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-3 ml-6 flex list-disc flex-col gap-1.5" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-3 ml-6 flex list-decimal flex-col gap-1.5" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className="mt-4 border-l-2 pl-4 text-muted-foreground italic" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-4" {...props} />,
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
    const match = /language-(\w+)/.exec(className || '')
    const text = String(children).replace(/\n$/, '')
    if (match) return <ShikiCodeBlock code={text} language={match[1] ?? 'text'} />
    return (
      <code className="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props}>
        {children}
      </code>
    )
  },
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-auto">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border px-4 py-2 text-left font-semibold [[align=center]]:text-center [[align=right]]:text-right"
      {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right" {...props}>
      {children}
    </td>
  ),
}

function MessageBubble({
  message,
  onSelectSource,
}: {
  message: IChatMessage
  onSelectSource: (messageId: string, source: IChatSource) => void
}) {
  const isUser = message.role === 'user'
  const isPicking = message.status === 'picking'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[85%]', !isUser && 'w-full')}>
        {isUser ? (
          <div className="rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-primary-foreground text-sm">
            {message.content}
          </div>
        ) : (
          <div className={cn('text-foreground text-sm', message.status === 'error' && 'text-destructive')}>
            <Markdown components={markdownComponents}>{message.content}</Markdown>
            {message.status === 'streaming' && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
            )}
          </div>
        )}

        {isPicking && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((source) => (
              <button
                key={source.slug}
                type="button"
                onClick={() => onSelectSource(message.id, source)}
                className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-foreground text-xs transition-colors hover:bg-accent">
                <FileText aria-hidden="true" className="size-3 text-muted-foreground" />
                {source.title}
              </button>
            ))}
          </div>
        )}

        {!isPicking && message.sources && message.sources.length > 0 && message.status === 'done' && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.sources.map((source) => (
              <Link
                key={source.slug}
                href={source.href}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-muted-foreground text-xs transition-colors hover:text-foreground hover:underline">
                <FileText aria-hidden="true" className="size-3" />
                {source.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const MemoMessageBubble = React.memo(MessageBubble, (prev, next) => {
  return (
    prev.message.content === next.message.content &&
    prev.message.status === next.message.status &&
    prev.message.sources === next.message.sources
  )
})
