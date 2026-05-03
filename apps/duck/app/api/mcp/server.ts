/**
 * MCP server for @gentleduck/ui documentation.
 *
 * This file wires the tool handlers. Domain logic lives in:
 * - text.ts         -  frontmatter parsing, MDX stripping, section extraction
 * - tokenize.ts     -  stemming, tokenization, synonym expansion
 * - tfidf.ts        -  TF-IDF vectors, cosine similarity
 * - fuzzy.ts        -  edit distance, fuzzy matching, keyword scoring
 * - docs-index.ts   -  doc types, file system, index building, caching
 * - rate-limit.ts   -  rate limiting, slug validation, request logging
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  getCandidateDocs,
  getDoc,
  getDocsForCategory,
  getDocsIndex,
  type ICachedDoc,
  sortChangelogDocs,
  truncate,
} from './docs-index'
import { editDistance, fuzzyMatch, scoreKeywordQuery } from './fuzzy'
import { logRequest, validateSlug } from './rate-limit'
import { extractSection, extractSummary } from './text'
import { computeTf, computeTfidfVector, cosineSimilarity } from './tfidf'
import { expandSearchTerms, expandSearchText, stem, tokenize } from './tokenize'

// -- Re-exports for consumers (chat API, tests, etc.) ------------------------

export {
  getDocsIndexStats,
  // docs-index.ts
  isContainedPath,
  resetDocsIndexStateForTests,
} from './docs-index'
export {
  // fuzzy.ts
  editDistance,
  fuzzyMatch,
  fuzzyScore,
  scoreKeywordQuery,
} from './fuzzy'
export {
  // rate-limit.ts
  getRateLimitResponse,
  validateSlug,
} from './rate-limit'
export {
  extractSection,
  extractSummary,
  // text.ts
  parseFrontmatter,
  stripMdxSyntax,
} from './text'
export {
  computeIdf,
  // tfidf.ts
  computeTf,
  computeTfidfVector,
  cosineSimilarity,
} from './tfidf'
export {
  expandSearchTerms,
  // tokenize.ts
  stem,
  tokenize,
} from './tokenize'

// -- Constants ---------------------------------------------------------------

export const MCP_TOOL_NAMES = [
  'list_docs',
  'read_doc',
  'search_docs',
  'get_component_api',
  'get_examples',
  'get_changelog',
  'get_installation',
  'suggest_components',
  'semantic_search',
] as const
export const MCP_TOOL_COUNT = MCP_TOOL_NAMES.length

const CATEGORY_ENUM = z.enum(['components', 'installation', 'packages', 'changelog', 'dark-theme', 'general', 'all'])

// -- Server ------------------------------------------------------------------

export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: 'duck-ui-docs', version: '1.0.0' },
    {
      capabilities: { tools: {} },
      instructions: [
        'MCP server for @gentleduck/ui documentation (gentleduck.org).',
        'Tools: list_docs -> browse catalog, search_docs -> keyword search (fuzzy), semantic_search -> natural language search (TF-IDF), read_doc -> full page, get_component_api -> props only, get_examples -> code only, get_changelog -> version history, get_installation -> setup guide, suggest_components -> find the right component.',
        'Tip: use semantic_search for conceptual queries ("how to handle forms"), search_docs for specific keywords. Use list_docs to browse, then read_doc for details.',
        'Categories: components, installation, packages, changelog, dark-theme, general.',
      ].join(' '),
    },
  )

  // -- list_docs --------------------------------------------------------------

  server.tool(
    'list_docs',
    'List documentation pages with pagination. Optionally filter by category.',
    {
      category: CATEGORY_ENUM.default('all').describe('Filter by category. Use "all" for everything.'),
      page: z.number().min(1).default(1).describe('Page number (1-based). Each page returns up to 20 items.'),
    },
    async ({ category, page }) => {
      logRequest('list_docs', { category, page })
      const index = await getDocsIndex()
      const filtered = getDocsForCategory(index, category)

      const pageSize = 20
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
      const safePage = Math.min(page, totalPages)
      const start = (safePage - 1) * pageSize
      const slice = filtered.slice(start, start + pageSize)

      const lines = slice.map((d) => `- **${d.title}** \`${d.slug}\`  -  ${d.description || '(no description)'}`)
      const pagination =
        totalPages > 1
          ? `\n\n*Page ${safePage}/${totalPages} (${filtered.length} total). Use page=${safePage + 1} for more.*`
          : ''

      return {
        content: [
          {
            type: 'text' as const,
            text: `${filtered.length} docs${category !== 'all' ? ` in "${category}"` : ''}:\n\n${lines.join('\n')}${pagination}`,
          },
        ],
      }
    },
  )

  // -- read_doc ---------------------------------------------------------------

  server.tool(
    'read_doc',
    'Read a documentation page. Returns clean markdown (MDX syntax stripped).',
    {
      slug: z.string().describe('Doc page slug, e.g. "components/button"'),
      mode: z.enum(['full', 'summary']).default('full').describe('"full" or "summary" (headings only).'),
      section: z.string().optional().describe('Optional heading to extract a single section.'),
    },
    async ({ slug, mode, section }) => {
      logRequest('read_doc', { slug, mode, section })
      const check = validateSlug(slug)
      if (!check.valid)
        return { content: [{ type: 'text' as const, text: check.error ?? 'Invalid slug.' }], isError: true }

      const index = await getDocsIndex()
      const doc = getDoc(index, check.sanitized)
      if (!doc)
        return {
          content: [{ type: 'text' as const, text: `Not found: "${slug}". Use list_docs to browse.` }],
          isError: true,
        }

      let output: string
      if (section) {
        const result = extractSection(doc.cleanBody, section)
        output = result.found
          ? result.content
          : `No section "${section}" found. Available:\n${result.headings.join('\n')}`
      } else if (mode === 'summary') {
        output = extractSummary(doc.cleanBody)
      } else {
        output = doc.cleanBody
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(`# ${doc.title}${doc.description ? `\n> ${doc.description}` : ''}\n\n${output}`),
          },
        ],
      }
    },
  )

  // -- search_docs ------------------------------------------------------------

  server.tool(
    'search_docs',
    'Search documentation by keyword with typo tolerance.',
    {
      query: z.string().describe('Search keyword or phrase'),
      category: CATEGORY_ENUM.default('all'),
      limit: z.number().min(1).max(20).default(10),
    },
    async ({ query, category, limit }) => {
      logRequest('search_docs', { query, category, limit })
      const index = await getDocsIndex()
      const queryLower = query.toLowerCase()
      const queryTerms = expandSearchTerms(query)
      const stemmedTerms = queryTerms.map((t) => stem(t))

      const scoreDocs = (docs: ICachedDoc[]) => {
        const results: { slug: string; title: string; score: number; snippet: string }[] = []
        for (const doc of docs) {
          const score = scoreKeywordQuery({
            terms: queryTerms,
            stemmedTerms,
            fields: [
              { text: doc.title.toLowerCase(), exactWeight: 10, fuzzyWeight: 3, stemmedExactWeight: 8 },
              { text: doc.slug.toLowerCase(), exactWeight: 8, fuzzyWeight: 2, stemmedExactWeight: 6 },
              { text: doc.description.toLowerCase(), exactWeight: 5, fuzzyWeight: 1, stemmedExactWeight: 4 },
            ],
            body: { text: doc.cleanBodyLower, exactCap: 5, stemmedExactCap: 3 },
          })
          if (score === 0) continue

          let snippet = ''
          const lines = doc.cleanBody.split('\n')
          for (let i = 0; i < lines.length; i++) {
            if (lines[i]?.toLowerCase().includes(queryLower)) {
              snippet = lines
                .slice(Math.max(0, i - 1), Math.min(lines.length, i + 2))
                .map((l) => l.trim())
                .filter(Boolean)
                .join(' ')
                .slice(0, 200)
              break
            }
          }
          results.push({ slug: doc.slug, title: doc.title, score, snippet })
        }
        return results
      }

      const fallbackDocs = getDocsForCategory(index, category)
      const candidateDocs = getCandidateDocs(index, query, category)
      const results =
        candidateDocs.length === fallbackDocs.length ? scoreDocs(candidateDocs) : scoreDocs(candidateDocs).concat()
      const rescoredResults =
        results.length > 0 || candidateDocs.length === fallbackDocs.length ? results : scoreDocs(fallbackDocs)

      rescoredResults.sort((a, b) => b.score - a.score)
      const top = rescoredResults.slice(0, limit)

      if (top.length === 0) {
        return { content: [{ type: 'text' as const, text: `No results for "${query}". Try semantic_search.` }] }
      }

      const output = top.map((r) => `- **${r.title}** \`${r.slug}\`${r.snippet ? `\n  > ${r.snippet}` : ''}`).join('\n')
      return { content: [{ type: 'text' as const, text: `${top.length} result(s) for "${query}":\n\n${output}` }] }
    },
  )

  // -- get_component_api ------------------------------------------------------

  server.tool(
    'get_component_api',
    'Get the API reference / props table for a component.',
    { component: z.string().describe('Component name, e.g. "button", "dialog"') },
    async ({ component }) => {
      logRequest('get_component_api', { component })
      const index = await getDocsIndex()
      const slug = `components/${component.toLowerCase().replace(/[^a-z0-9-]/g, '')}`
      const doc = getDoc(index, slug)
      if (!doc) {
        const components = getDocsForCategory(index, 'components')
        const suggestions = components
          .map((d) => ({
            name: d.slug.replace('components/', ''),
            dist: editDistance(component.toLowerCase(), d.slug.replace('components/', '')),
          }))
          .filter((s) => s.dist <= 3)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)
          .map((s) => `\`${s.name}\``)
        const hint =
          suggestions.length > 0
            ? ` Did you mean: ${suggestions.join(', ')}?`
            : ' Use list_docs with category="components".'
        return {
          content: [{ type: 'text' as const, text: `Component "${component}" not found.${hint}` }],
          isError: true,
        }
      }

      const lines = doc.cleanBody.split('\n')
      const apiLines: string[] = []
      let capturing = false
      for (const line of lines) {
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
        if (headingMatch) {
          const text = headingMatch[2]?.toLowerCase() ?? ''
          if (text.includes('api') || text.includes('props') || text.includes('parameters')) {
            capturing = true
          } else if (capturing && (headingMatch[1]?.length ?? 0) <= 2) {
            if (!text.includes('api') && !text.includes('props')) break
          }
        }
        if (capturing) apiLines.push(line)
      }

      if (apiLines.length === 0) {
        return {
          content: [
            { type: 'text' as const, text: `No API section found for "${doc.title}". Try read_doc slug="${slug}".` },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(`# ${doc.title}  -  API Reference\n\n${apiLines.join('\n').trim()}`),
          },
        ],
      }
    },
  )

  // -- get_examples -----------------------------------------------------------

  server.tool(
    'get_examples',
    'Get only the code examples from a documentation page.',
    { slug: z.string().describe('Doc page slug') },
    async ({ slug }) => {
      logRequest('get_examples', { slug })
      const check = validateSlug(slug)
      if (!check.valid)
        return { content: [{ type: 'text' as const, text: check.error ?? 'Invalid slug.' }], isError: true }

      const index = await getDocsIndex()
      const doc = getDoc(index, check.sanitized)
      if (!doc) return { content: [{ type: 'text' as const, text: `Not found: "${slug}".` }], isError: true }

      if (doc.codeBlocks.length === 0)
        return { content: [{ type: 'text' as const, text: `No code examples in "${doc.title}".` }] }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(
              `# ${doc.title}  -  Code Examples (${doc.codeBlocks.length})\n\n${doc.codeBlocks.join('\n\n')}`,
            ),
          },
        ],
      }
    },
  )

  // -- get_changelog ----------------------------------------------------------

  server.tool(
    'get_changelog',
    'Get changelog entries. Filter by version or component name.',
    {
      version: z.string().optional().describe('Optional version to filter by'),
      component: z.string().optional().describe('Optional component name to filter by'),
      limit: z.number().min(1).max(20).default(5),
    },
    async ({ version, component, limit }) => {
      logRequest('get_changelog', { version, component, limit })
      const index = await getDocsIndex()
      let changelogDocs = sortChangelogDocs(
        getDocsForCategory(index, 'changelog').filter((d) => d.slug !== 'changelog/index'),
      )

      if (changelogDocs.length === 0) return { content: [{ type: 'text' as const, text: 'No changelog found.' }] }

      if (version) {
        const vLower = version.toLowerCase()
        changelogDocs = changelogDocs.filter(
          (d) => d.title.toLowerCase().includes(vLower) || d.cleanBodyLower.includes(vLower) || d.slug.includes(vLower),
        )
        if (changelogDocs.length === 0)
          return { content: [{ type: 'text' as const, text: `No changelog for version "${version}".` }] }
      }

      if (component) {
        const compLower = component.toLowerCase()
        const stemmedComp = stem(compLower)
        changelogDocs = changelogDocs.filter(
          (d) =>
            d.cleanBodyLower.includes(compLower) ||
            d.cleanBodyLower.includes(stemmedComp) ||
            d.title.toLowerCase().includes(compLower) ||
            fuzzyMatch(compLower, d.cleanBodyLower),
        )
        if (changelogDocs.length === 0)
          return { content: [{ type: 'text' as const, text: `No changelog mentioning "${component}".` }] }
      }

      const entries = changelogDocs.slice(0, limit)
      const output = entries
        .map((d) => `## ${d.title}\n\`${d.slug}\`\n\n${extractSummary(d.cleanBody)}`)
        .join('\n\n---\n\n')
      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(`# Changelog (${entries.length}/${changelogDocs.length})\n\n${output}`),
          },
        ],
      }
    },
  )

  // -- get_installation -------------------------------------------------------

  server.tool(
    'get_installation',
    'Get the installation/setup guide for a specific framework.',
    { framework: z.string().describe('Framework name, e.g. "next", "vite", "astro"') },
    async ({ framework }) => {
      logRequest('get_installation', { framework })
      const index = await getDocsIndex()
      const fwLower = framework.toLowerCase()

      let doc = getDoc(index, `installation/${fwLower}`)
      if (!doc) {
        const installDocs = getDocsForCategory(index, 'installation')
        const match = installDocs.find(
          (d) =>
            d.title.toLowerCase().includes(fwLower) ||
            d.slug.toLowerCase().includes(fwLower) ||
            fuzzyMatch(fwLower, d.title.toLowerCase()),
        )
        if (match) doc = match
      }

      if (!doc) {
        const installDocs = getDocsForCategory(index, 'installation')
        const available = installDocs.map((d) => `\`${d.slug.replace('installation/', '')}\``).join(', ')
        return {
          content: [{ type: 'text' as const, text: `No guide for "${framework}". Available: ${available || 'none'}.` }],
          isError: true,
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(`# ${doc.title}${doc.description ? `\n> ${doc.description}` : ''}\n\n${doc.cleanBody}`),
          },
        ],
      }
    },
  )

  // -- suggest_components -----------------------------------------------------

  server.tool(
    'suggest_components',
    'Describe what you need and get ranked component suggestions.',
    {
      need: z.string().describe('Describe what you need'),
      limit: z.number().min(1).max(10).default(5),
    },
    async ({ need, limit }) => {
      logRequest('suggest_components', { need, limit })
      const index = await getDocsIndex()
      const terms = expandSearchTerms(need)

      const scoreComponents = (components: ICachedDoc[]) =>
        components
          .map((doc) => ({
            slug: doc.slug,
            title: doc.title,
            description: doc.description,
            score: scoreKeywordQuery({
              terms,
              fields: [
                { text: doc.title.toLowerCase(), exactWeight: 10, fuzzyWeight: 2 },
                { text: doc.slug.replace('components/', ''), exactWeight: 8, fuzzyWeight: 2 },
                { text: doc.description.toLowerCase(), exactWeight: 5, fuzzyWeight: 1 },
              ],
              body: { text: doc.cleanBodyLower, exactCap: 3 },
            }),
          }))
          .filter((r) => r.score > 0)

      const allComponents = getDocsForCategory(index, 'components')
      const candidateComponents = getCandidateDocs(index, need, 'components')
      const scored =
        candidateComponents.length === allComponents.length
          ? scoreComponents(candidateComponents)
          : (() => {
              const r = scoreComponents(candidateComponents)
              return r.length > 0 ? r : scoreComponents(allComponents)
            })()
      scored.sort((a, b) => b.score - a.score)
      const top = scored.slice(0, limit)

      if (top.length === 0)
        return {
          content: [
            { type: 'text' as const, text: `No components for "${need}". Use list_docs category="components".` },
          ],
        }

      const output = top
        .map((r, i) => `${i + 1}. **${r.title}** \`${r.slug}\`  -  ${r.description || '(no description)'}`)
        .join('\n')
      return {
        content: [
          {
            type: 'text' as const,
            text: `Top ${top.length} for "${need}":\n\n${output}\n\nUse read_doc or get_component_api for details.`,
          },
        ],
      }
    },
  )

  // -- semantic_search --------------------------------------------------------

  server.tool(
    'semantic_search',
    'Natural language search using TF-IDF vectors and cosine similarity.',
    {
      query: z.string().describe('Natural language query'),
      category: CATEGORY_ENUM.default('all'),
      limit: z.number().min(1).max(20).default(5),
      threshold: z.number().min(0).max(1).default(0.05).describe('Minimum similarity (0-1).'),
    },
    async ({ query, category, limit, threshold }) => {
      logRequest('semantic_search', { query, category, limit, threshold })
      const index = await getDocsIndex()

      const queryTokens = tokenize(expandSearchText(query))
      const queryTf = computeTf(queryTokens)
      const queryVector = computeTfidfVector(queryTf, index.idf)

      if (queryVector.size === 0)
        return { content: [{ type: 'text' as const, text: `Could not process query "${query}".` }] }

      const candidateDocs = getCandidateDocs(index, query, category)
      const results: { slug: string; title: string; description: string; similarity: number; snippet: string }[] = []

      for (const doc of candidateDocs) {
        const similarity = cosineSimilarity(queryVector, doc.tfidfVector)
        if (similarity < threshold) continue

        const queryTerms = query
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => t.length >= 2)
        const lines = doc.cleanBody.split('\n')
        let snippet = ''
        for (let i = 0; i < lines.length; i++) {
          const lineLower = lines[i]?.toLowerCase() ?? ''
          if (queryTerms.some((t) => lineLower.includes(t))) {
            snippet = lines
              .slice(Math.max(0, i - 1), Math.min(lines.length, i + 2))
              .map((l) => l.trim())
              .filter(Boolean)
              .join(' ')
              .slice(0, 200)
            break
          }
        }
        results.push({ slug: doc.slug, title: doc.title, description: doc.description, similarity, snippet })
      }

      results.sort((a, b) => b.similarity - a.similarity)
      const top = results.slice(0, limit)

      if (top.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `No results for "${query}". Try search_docs or lower threshold.` }],
        }
      }

      const output = top
        .map((r) => {
          const score = `(${(r.similarity * 100).toFixed(1)}%)`
          return `- **${r.title}** \`${r.slug}\` ${score}${r.description ? `  -  ${r.description}` : ''}${r.snippet ? `\n  > ${r.snippet}` : ''}`
        })
        .join('\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: `${top.length} result(s) for "${query}":\n\n${output}\n\nUse read_doc for details.`,
          },
        ],
      }
    },
  )

  return server
}
