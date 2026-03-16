import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildChatContext } from './context'

const SYSTEM_PROMPT = `You are a documentation assistant for gentleduck/ui, a React component library at ui.gentleduck.org.

RULES:
- ONLY answer about gentleduck packages: ui, primitives, variants, motion, vim, state, hooks, libs, lazy, cli, docs.
- If a question is unrelated to gentleduck, respond exactly with: "I can only help with gentleduck documentation. Please ask about components, installation, or usage."
- Answer in organized plain-text paragraphs. Do not use markdown formatting, bullet points, or code fences.
- When referencing a documentation page, mention it naturally in the text so the user knows where to look.
- Base your answers on the provided documentation context. If the context does not have enough information, say so honestly.
- Keep responses concise: 2 to 4 paragraphs.
- Always mention the correct import path when discussing a component or package.

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

// Clean stale entries every 5 minutes
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

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'AI chat is not configured' }, { status: 503, headers: CORS_HEADERS })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429, headers: { ...CORS_HEADERS, 'Retry-After': '60' } },
    )
  }

  let body: { messages?: { role: string; content: string }[] }
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
    const { contextText, sources } = await buildChatContext(lastUserMessage.content)

    const genAI = new GoogleGenerativeAI(apiKey)
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite'
    const model = genAI.getGenerativeModel({ model: modelName })

    const history = messages.slice(-10).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }],
    }))

    // Remove the last user message from history since we send it via sendMessageStream
    const lastMsg = history.pop()
    if (!lastMsg) {
      return Response.json({ error: 'No message to send' }, { status: 400, headers: CORS_HEADERS })
    }

    const chat = model.startChat({
      history,
      systemInstruction: {
        role: 'user' as const,
        parts: [{ text: SYSTEM_PROMPT + contextText }],
      },
    })

    const result = await chat.sendMessageStream(lastMsg.parts[0].text)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send sources first
        if (sources.length > 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`))
        }

        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`))
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
