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
  status: 'pending' | 'streaming' | 'done' | 'error' | 'picking'
}

export interface UseAIChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  isSearching: boolean
  error: string | null
  send: (content: string) => void
  selectSource: (messageId: string, source: ChatSource) => void
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
  const [isSearching, setIsSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)

  const abort = React.useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setIsStreaming(false)
    setIsSearching(false)
  }, [])

  const reset = React.useCallback(() => {
    abort()
    setMessages([])
    setError(null)
  }, [abort])

  // Step 1: User sends question → search for sources → show as options
  const send = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming || isSearching) return

      setError(null)
      const userMsg: ChatMessage = { id: createId(), role: 'user', content: content.trim(), status: 'done' }
      const assistantMsg: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: 'Here are the relevant documentation pages. Pick one to get a detailed answer:',
        sources: [],
        status: 'pending',
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsSearching(true)

      try {
        const response = await fetch('/api/chat/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: content.trim() }),
        })

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Search failed' }))
          throw new Error(err.error || `HTTP ${response.status}`)
        }

        const data = await response.json()
        const sources: ChatSource[] = data.sources || []

        if (sources.length === 0) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: 'No relevant documentation found for that question. Try rephrasing.', status: 'done' as const }
                : m,
            ),
          )
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsg.id ? { ...m, sources, status: 'picking' as const } : m)),
          )
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: message, status: 'error' as const } : m)),
        )
      } finally {
        setIsSearching(false)
      }
    },
    [isStreaming, isSearching],
  )

  // Step 2: User picks a source → call AI with that specific context
  const selectSource = React.useCallback(
    async (messageId: string, source: ChatSource) => {
      if (isStreaming) return

      // Mark the picking message as done and highlight the selected source
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: `Answering based on: ${source.title}`, sources: [source], status: 'done' as const } : m,
        ),
      )

      const aiMsg: ChatMessage = { id: createId(), role: 'assistant', content: '', status: 'pending' }
      setMessages((prev) => [...prev, aiMsg])
      setIsStreaming(true)

      const controller = new AbortController()
      controllerRef.current = controller

      try {
        // Get the last user question
        const lastQuestion = messages.findLast((m) => m.role === 'user')?.content || ''

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: lastQuestion }],
            sourceSlug: source.slug,
          }),
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

        setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, status: 'streaming' as const } : m)))

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
                  prev.map((m) => (m.id === aiMsg.id ? { ...m, content: m.content + event.content } : m)),
                )
              } else if (event.type === 'sources') {
                setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, sources: event.sources } : m)))
              } else if (event.type === 'done') {
                setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, status: 'done' as const } : m)))
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

        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id && m.status === 'streaming' ? { ...m, status: 'done' as const } : m)),
        )
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, status: 'done' as const } : m)))
        } else {
          const message = err instanceof Error ? err.message : 'Something went wrong'
          setError(message)
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsg.id ? { ...m, content: message, status: 'error' as const } : m)),
          )
        }
      } finally {
        controllerRef.current = null
        setIsStreaming(false)
      }
    },
    [isStreaming, messages],
  )

  React.useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return { messages, isStreaming, isSearching, error, send, selectSource, abort, reset }
}
