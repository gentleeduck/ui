export async function GET() {
  return Response.json({
    available: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  })
}
