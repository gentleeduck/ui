import type { Event } from '@duck-docs/lib/events'
import type { IMdxCodeNodeProperties, INpmCommands } from '@duck-docs/types'

export interface ICodeBlockProps extends React.HTMLAttributes<HTMLPreElement>, INpmCommands {
  'data-theme'?: string
  __dmcRaw__?: IMdxCodeNodeProperties['__dmcRaw__']
  __dmcMeta__?: boolean
  __title__?: IMdxCodeNodeProperties['__title__']
  __dmcEvent__?: Event['name']
}
