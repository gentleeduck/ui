import type { Event } from '@duck-docs/lib/events'
import type { MdxCodeNodeProperties, NpmCommands } from '@duck-docs/types'

export type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  'data-theme'?: string
  __rawString__?: MdxCodeNodeProperties['__rawString__']
  __withMeta__?: boolean
  __title__?: MdxCodeNodeProperties['__title__']
  __event__?: Event['name']
} & NpmCommands
