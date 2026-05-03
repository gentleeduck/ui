import {
  docs,
  duckCalendar,
  duckCli,
  duckGen,
  duckHooks,
  duckIam,
  duckLazy,
  duckLibs,
  duckMotion,
  duckPrimitives,
  duckQuery,
  duckRegistryBuild,
  duckShortcut,
  duckState,
  duckTemplate,
  duckTtest,
  duckTtlog,
  duckUi,
  duckUpload,
  duckVariants,
  duckVim,
  www,
} from '../../../.velite'

export const dynamic = 'force-static'
export const dynamicParams = false

const allDocs = [
  ...docs,
  ...duckCalendar,
  ...duckCli,
  ...duckGen,
  ...duckHooks,
  ...duckIam,
  ...duckLazy,
  ...duckLibs,
  ...duckMotion,
  ...duckPrimitives,
  ...duckQuery,
  ...duckRegistryBuild,
  ...duckShortcut,
  ...duckState,
  ...duckTemplate,
  ...duckTtest,
  ...duckTtlog,
  ...duckUi,
  ...duckUpload,
  ...duckVariants,
  ...duckVim,
  ...www,
]

function findDoc(slug: string[]): string | null {
  const path = slug.join('/')
  const candidates = [path, `${path}/index`]
  const doc = allDocs.find((d) => candidates.includes(d.permalink)) as
    | { raw?: string; content?: string }
    | undefined
  // `raw` is the original mdx source. Fall back to `content` (compiled
  // markdown HTML) if a collection predates the raw field.
  return doc?.raw ?? doc?.content ?? null
}

export async function generateStaticParams() {
  return allDocs.map((doc) => ({ slug: doc.permalink.replace(/\/index$/, '').split('/') }))
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  const content = findDoc(slug)

  if (!content) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
    status: 200,
  })
}
