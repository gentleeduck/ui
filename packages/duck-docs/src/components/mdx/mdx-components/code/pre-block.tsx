import { CopyButton } from '@duck-docs/components/copy-button'
import type { Event } from '@duck-docs/lib/events'
import type { NpmCommands } from '@duck-docs/types/unist'
import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Terminal } from 'lucide-react'

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
  __title__,
  children,
  ...props
}: CodeBlockProps) {
  return (
    <div data-theme={(props as any)['data-theme']}>
      {__npmCommand__ && __yarnCommand__ && __pnpmCommand__ && __bunCommand__ ? (
        <ShellCommand
          __bunCommand__={__bunCommand__}
          __npmCommand__={__npmCommand__}
          __pnpmCommand__={__pnpmCommand__}
          __yarnCommand__={__yarnCommand__}
          {...props}
        />
      ) : (
        <>
          {__rawString__ && !__npmCommand__ && (
            <CopyButton
              className={cn('absolute top-2 right-2 bg-muted [&_svg]:text-muted-foreground', __withMeta__ && 'top-16')}
              event={__event__}
              value={__rawString__}
              variant={'outline'}
            />
          )}
          <pre
            className={cn(
              'max-h-[650px] overflow-auto rounded-lg py-4 focus-visible:shadow-none focus-visible:outline-none',
              className,
            )}
            {...props}>
            {children}
          </pre>
        </>
      )}
    </div>
  )
}

export function ShellCommand({ __npmCommand__, __yarnCommand__, __pnpmCommand__, __bunCommand__ }: NpmCommands) {
  const commands = {
    __bunCommand__,
    __npmCommand__,
    __pnpmCommand__,
    __yarnCommand__,
  }
  return (
    <Tabs className="rounded-md" defaultValue="__npmCommand__">
      <TabsList className="w-fit justify-start bg-transparent py-2">
        <div className="flex size-4 flex-col items-center justify-center bg-foreground/65 ltr:mr-2 ltr:ml-3 rtl:mr-3 rtl:ml-2">
          <Terminal className="size-4 text-background" />
        </div>
        {Object.keys(commands).map((command, idx) => {
          return (
            <TabsTrigger className="aria-[selected='true']:bg-muted" key={idx} value={command}>
              {command.replace('__', '').replace('Command', '').replace('__', '')}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {Object.entries(commands).map(([commandKey, command], idx) => {
        return (
          <TabsContent className="[&_pre]:max-w-[620px] [&_pre]:overflow-auto" key={idx} value={commandKey}>
            <CopyButton
              className={cn(
                'absolute top-1.5 right-1.5 border-none bg-transparent [&_svg]:size-5 [&_svg]:text-muted-foreground',
              )}
              value={command as string}
              variant={'outline'}
            />
            <pre className="p-4 pt-2 text-muted-foreground text-sm focus-visible:shadow-none focus-visible:outline-none">
              {command}
            </pre>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
