import type { Event } from '@duck-docs/lib/events'
import type { IMdxCodeNodeProperties, INpmCommands } from '@duck-docs/types'

export interface ICodeBlockProps extends React.HTMLAttributes<HTMLPreElement>, INpmCommands {
  'data-theme'?: string
  __rawString__?: IMdxCodeNodeProperties['__rawString__']
  __withMeta__?: boolean
  __title__?: IMdxCodeNodeProperties['__title__']
  __event__?: Event['name']
}
