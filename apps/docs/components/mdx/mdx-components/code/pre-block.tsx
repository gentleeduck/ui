import { cn } from '@gentelduck/libs/cn'
import { NpmCommands } from '~/types/unist'
import { Event } from '~/lib/events'
import { CopyButton, CopyNpmCommandButton } from '~/components/copy-button'

export type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  __rawString__?: string
  __withMeta__?: boolean
  __title__?: string
  __event__?: Event['name']
} & NpmCommands

export function Pre({
  className,
  __rawString__,
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  __bunCommand__,
  __withMeta__,
  __event__,
  __title__,
  ...props
}: CodeBlockProps) {
  // console.log(__rawString__, props)

  return (
    <div className=''>
      <pre
        className={cn(
          'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-secondary py-4 dark:bg-[#cdd6f403]',
          className
        )}
        {...props}
      />
      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          value={__rawString__}
          variant={'outline'}
          event={__event__}
          className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
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
