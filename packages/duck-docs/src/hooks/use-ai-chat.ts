'use client'

import * as React from 'react'

export interface ChatSource {
  slug: string
  title: string
  href: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  status: 'pending' | 'streaming' | 'done' | 'error'
}

export interface UseAIChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  send: (content: string) => void
  abort: () => void
  reset: () => void
}

let messageCounter = 0
function createId(): string {
  return `msg_${Date.now()}_${++messageCounter}`
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)

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
      if (!content.trim() || isStreaming) return

      setError(null)
      const userMsg: ChatMessage = { id: createId(), role: 'user', content: content.trim(), status: 'done' }
      const assistantMsg: ChatMessage = { id: createId(), role: 'assistant', content: '', status: 'pending' }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsStreaming(true)

      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const history = messages
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

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsg.id ? { ...m, status: 'streaming' as const } : m)),
        )

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
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: m.content + event.content } : m,
                  ),
                )
              } else if (event.type === 'sources') {
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsg.id ? { ...m, sources: event.sources } : m)),
                )
              } else if (event.type === 'done') {
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsg.id ? { ...m, status: 'done' as const } : m)),
                )
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

        // Mark done if stream ended without a done event
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id && m.status === 'streaming' ? { ...m, status: 'done' as const } : m,
          ),
        )
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, status: 'done' as const } : m,
            ),
          )
        } else {
          const message = err instanceof Error ? err.message : 'Something went wrong'
          setError(message)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: message, status: 'error' as const }
                : m,
            ),
          )
        }
      } finally {
        controllerRef.current = null
        setIsStreaming(false)
      }
    },
    [isStreaming, messages],
  )

  // Abort on unmount
  React.useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return { messages, isStreaming, error, send, abort, reset }
}
