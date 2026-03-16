'use client'

import { cn } from '@gentleduck/libs/cn'
import { ArrowLeft, Loader2, Send, Square, Sparkles } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { useAIChat, type ChatMessage } from '@duck-docs/hooks'

interface AIChatPanelProps {
  initialQuery?: string
  onBack: () => void
}

export function AIChatPanel({ initialQuery, onBack }: AIChatPanelProps) {
  const { messages, isStreaming, error, send, abort, reset } = useAIChat()
  const [input, setInput] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const sentInitial = React.useRef(false)

  // Send initial query from search auto-switch
  React.useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true
      send(initialQuery)
    }
  }, [initialQuery, send])

  // Auto-scroll to bottom
  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  // Focus input
  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    send(input)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      if (messages.length === 0) {
        onBack()
      }
    }
  }

  return (
    <div className="flex h-[420px] flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <button
          type="button"
          onClick={() => {
            reset()
            onBack()
          }}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>
        <Sparkles aria-hidden="true" className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm">Ask about gentleduck/ui</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        {messages.length === 0 && !isStreaming && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground text-sm">
            <Sparkles aria-hidden="true" className="size-8 opacity-20" />
            <p>Ask anything about gentleduck/ui components, installation, or usage.</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && messages[messages.length - 1]?.status === 'pending' && (
          <div className="flex items-center gap-1.5 py-2 text-muted-foreground text-sm">
            <Loader2 aria-hidden="true" className="size-3 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t px-3 py-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={isStreaming}
          className="h-8 flex-1 rounded-md border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring disabled:opacity-50"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={abort}
            className="flex size-8 items-center justify-center rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <Square aria-hidden="true" className="size-3" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <Send aria-hidden="true" className="size-3" />
          </button>
        )}
      </form>

      {/* Footer */}
      <div className="flex items-center justify-center border-t px-3 py-1.5">
        <span className="text-muted-foreground text-xs">Powered by Gemini</span>
      </div>

      {error && (
        <div className="px-3 pb-2 text-destructive text-xs">{error}</div>
      )}
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('mb-3', isUser ? 'text-right' : 'text-left')}>
      <div
        className={cn(
          'inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
          message.status === 'error' && 'bg-destructive/10 text-destructive',
        )}>
        {message.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>
            {paragraph}
          </p>
        ))}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {message.sources.map((source) => (
            <Link
              key={source.slug}
              href={`/docs/${source.slug}`}
              className="inline-flex items-center rounded-md border px-2 py-0.5 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground">
              {source.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
