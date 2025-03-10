import { cn } from '@duck/libs/cn'
import { NpmCommands } from '~/types/unist'
import { Event } from '~/lib/events'
import { CopyButton, CopyNpmCommandButton } from '../../copy-button'

export type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  __rawString__?: string
  __withMeta__?: boolean
  __title__?: string
  __event__?: Event['name']
} & NpmCommands

export function PreBlock({
  className,
  __rawString__,
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  __bunCommand__,
  __withMeta__,
  __event__,
  ...props
}: CodeBlockProps) {
  console.log(__rawString__, props)

  return (
    <div>
      <pre
        className={cn(
          'max-h-[650px] overflow-x-auto rounded-md py-3',
          className,
        )}
        {...props}
        tabIndex={0}
      />
      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          value={__rawString__}
          variant={'outline'}
          event={__event__}
          className={cn(
            'absolute right-4 top-4 group-hover:opacity-100',
            __withMeta__ && 'top-6',
          )}
        />
      )}

      {__npmCommand__ &&
        __yarnCommand__ &&
        __pnpmCommand__ &&
        __bunCommand__ && (
          <CopyNpmCommandButton
            commands={{
              __npmCommand__,
              __yarnCommand__,
              __pnpmCommand__,
              __bunCommand__,
            }}
            className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
          />
        )}
    </div>
  )
}
