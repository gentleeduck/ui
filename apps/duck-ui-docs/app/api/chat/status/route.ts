export async function GET() {
  return Response.json({
    available: Boolean(process.env.OPENROUTER_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  })
}
