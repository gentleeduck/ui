import { buildChatContext, buildChatContextFromSlug } from './context'

const SYSTEM_PROMPT = `You are a documentation assistant for gentleduck/ui, a React component library at gentleduck.org.

RULES:
- ONLY answer about gentleduck packages: ui, primitives, variants, motion, vim, state, hooks, libs, lazy, cli, docs.
- If a question is unrelated to gentleduck, respond exactly with: "I can only help with gentleduck documentation. Please ask about components, installation, or usage."
- Always answer the question directly. Do not just list pages or suggest the user go read docs. Give the actual answer with explanations, code examples, and details.
- Use full markdown formatting: headings (##, ###), bullet points, bold, inline code, fenced code blocks with language tags (tsx, bash, ts), and markdown links.
- When referencing a documentation page, use a real markdown link like [Button docs](https://gentleduck.org/duck-ui/components/button). Never just mention a URL as plain text.
- Include working code examples with correct import paths like \`import { Button } from '@gentleduck/registry-ui/button'\`.
- Base your answers on the provided documentation context. If the context does not have enough information, say so honestly but still try to answer with what you know.
- Keep responses thorough but focused.

DOCUMENTATION CONTEXT:
`

const RATE_LIMIT = 20
const RATE_WINDOW = 60_000
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(ip)
    }
  }, 300_000)
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

function getApiConfig(): { apiKey: string; baseUrl: string; model: string } | null {
  const openrouterKey = process.env.OPENROUTER_API_KEY
  if (openrouterKey) {
    return {
      apiKey: openrouterKey,
      baseUrl: 'https://openrouter.ai/api/v1',
      model: process.env.CHAT_MODEL || 'openrouter/auto',
    }
  }

  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (geminiKey) {
    return {
      apiKey: geminiKey,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      model: process.env.CHAT_MODEL || 'gemini-2.0-flash-lite',
    }
  }

  return null
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: Request) {
  const config = getApiConfig()
  if (!config) {
    return Response.json({ error: 'AI chat is not configured' }, { status: 503, headers: CORS_HEADERS })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429, headers: { ...CORS_HEADERS, 'Retry-After': '60' } },
    )
  }

  let body: { messages?: { role: string; content: string }[]; sourceSlug?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS_HEADERS })
  }

  const messages = body.messages
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
    return Response.json({ error: 'Invalid messages array' }, { status: 400, headers: CORS_HEADERS })
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content || typeof msg.content !== 'string' || msg.content.length > 4000) {
      return Response.json({ error: 'Invalid message format' }, { status: 400, headers: CORS_HEADERS })
    }
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUserMessage) {
    return Response.json({ error: 'No user message found' }, { status: 400, headers: CORS_HEADERS })
  }

  try {
    const { contextText, sources } = body.sourceSlug
      ? await buildChatContextFromSlug(lastUserMessage.content, body.sourceSlug)
      : await buildChatContext(lastUserMessage.content)

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT + contextText },
      ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    ]

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        ...(config.baseUrl.includes('openrouter') ? { 'HTTP-Referer': 'https://gentleduck.org' } : {}),
      },
      body: JSON.stringify({
        model: config.model,
        messages: chatMessages,
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      const errText = await response.text().catch(() => 'Unknown error')
      throw new Error(errText)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        if (sources.length > 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`))
        }

        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`))
                }
              } catch {}
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: err instanceof Error ? err.message : 'Stream error' })}\n\n`,
            ),
          )
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}
