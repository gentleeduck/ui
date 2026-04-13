'use client'

import * as React from 'react'

export interface IChatSource {
  slug: string
  title: string
  href: string
}

export interface IChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: IChatSource[]
  status: 'pending' | 'streaming' | 'done' | 'error' | 'picking'
}

export interface IUseAIChatReturn {
  messages: IChatMessage[]
  isStreaming: boolean
  isSearching: boolean
  error: string | null
  send: (content: string) => void
  selectSource: (messageId: string, source: IChatSource) => void
  abort: () => void
  reset: () => void
}

let messageCounter = 0
function createId(): string {
  return `msg_${Date.now()}_${++messageCounter}`
}

function updateMessage(prev: IChatMessage[], id: string, patch: Partial<IChatMessage>): IChatMessage[] {
  const idx = prev.findIndex((m) => m.id === id)
  if (idx === -1) return prev
  const msg = prev[idx]
  if (!msg) return prev
  const updated = [...prev]
  updated[idx] = { ...msg, ...patch }
  return updated
}

export function useAIChat(): IUseAIChatReturn {
  const [messages, setMessages] = React.useState<IChatMessage[]>([])
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [isSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)
  // Use ref to avoid stale closures in send  -  no need for messages in deps
  const messagesRef = React.useRef(messages)
  messagesRef.current = messages

  const abort = React.useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setIsStreaming(false)
  }, [])

  const reset = React.useCallback(() => {
    abort()
    setMessages([])
    setError(null)
  }, [abort])

  const send = React.useCallback(
    async (content: string) => {
      if (!content.trim() || controllerRef.current) return

      setError(null)
      const assistantId = createId()

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'user', content: content.trim(), status: 'done' },
        { id: assistantId, role: 'assistant', content: '', status: 'streaming' },
      ])
      setIsStreaming(true)

      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const history = messagesRef.current
          .filter((m) => m.status === 'done')
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }))
        history.push({ role: 'user', content: content.trim() })

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Request failed' }))
          throw new Error(err.error || `HTTP ${response.status}`)
        }

        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        // Batch text chunks  -  accumulate then flush via rAF
        let pendingText = ''
        let rafId = 0

        function flushText() {
          if (!pendingText) return
          const text = pendingText
          pendingText = ''
          setMessages((prev) => {
            const msg = prev.find((m) => m.id === assistantId)
            if (!msg) return prev
            return updateMessage(prev, assistantId, { content: msg.content + text })
          })
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue

            try {
              const event = JSON.parse(jsonStr)
              if (event.type === 'text') {
                pendingText += event.content
                cancelAnimationFrame(rafId)
                rafId = requestAnimationFrame(flushText)
              } else if (event.type === 'sources') {
                setMessages((prev) => updateMessage(prev, assistantId, { sources: event.sources }))
              } else if (event.type === 'done') {
                cancelAnimationFrame(rafId)
                flushText()
                setMessages((prev) => updateMessage(prev, assistantId, { status: 'done' }))
              } else if (event.type === 'error') {
                throw new Error(event.message)
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
                throw parseErr
              }
            }
          }
        }

        // Flush any remaining text
        cancelAnimationFrame(rafId)
        flushText()

        setMessages((prev) => {
          const msg = prev.find((m) => m.id === assistantId)
          if (!msg || msg.status !== 'streaming') return prev
          return updateMessage(prev, assistantId, { status: 'done' })
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setMessages((prev) => updateMessage(prev, assistantId, { status: 'done' }))
        } else {
          const message = err instanceof Error ? err.message : 'Something went wrong'
          setError(message)
          setMessages((prev) => updateMessage(prev, assistantId, { content: message, status: 'error' }))
        }
      } finally {
        controllerRef.current = null
        setIsStreaming(false)
      }
    },
    [], // No deps  -  uses refs for current state
  )

  const selectSource = React.useCallback(
    (_messageId: string, source: IChatSource) => {
      send(`Tell me about ${source.title}`)
    },
    [send],
  )

  React.useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return { messages, isStreaming, isSearching, error, send, selectSource, abort, reset }
}
