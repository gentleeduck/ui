import { cn } from '@gentleduck/libs/cn'
import { NpmCommands } from '~/types/unist'
import { Event } from '~/lib/events'
import { CopyButton, CopyNpmCommandButton } from '~/components/copy-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Terminal } from 'lucide-react'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'

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
  children,
  ...props
}: CodeBlockProps) {
  return (
    <div
      className="mb-4 mt-6 relative overflow-hidden rounded-md border bg-white dark:bg-muted/40 [&_code]:bg-transparent"
      data-theme={(props as any)['data-theme']}>
      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          value={__rawString__}
          variant={'outline'}
          event={__event__}
          className={cn('absolute right-4 top-4 z-10', __withMeta__ && 'top-16')}
        />
      )}
      {__npmCommand__ && __yarnCommand__ && __pnpmCommand__ && __bunCommand__ ? (
        <ShellCommand
          __npmCommand__={__npmCommand__}
          __yarnCommand__={__yarnCommand__}
          __pnpmCommand__={__pnpmCommand__}
          __bunCommand__={__bunCommand__}
          {...props}
        />
      ) : (
        <pre
          className={cn(
            'max-h-[500px] overflow-auto py-4 focus-visible:shadow-none focus-visible:outline-none',
            className,
          )}
          {...props}>
          {children}
        </pre>
      )}
    </div>
  )
}

export function ShellCommand({ __npmCommand__, __yarnCommand__, __pnpmCommand__, __bunCommand__ }: NpmCommands) {
  const commands = {
    __npmCommand__,
    __yarnCommand__,
    __pnpmCommand__,
    __bunCommand__,
  }
  return (
    <Tabs className="bg-muted/40 rounded-md" defaultValue="__npmCommand__">
      <TabsList className="justify-start w-fit bg-transparent py-2">
        <div className="size-4 bg-foreground/80 flex flex-col items-center justify-center ltr:ml-3 ltr:mr-2 rtl:ml-2 rtl:mr-3">
          <Terminal className="text-background size-3" />
        </div>
        {Object.keys(commands).map((command) => {
          return (
            <TabsTrigger value={command} className="aria-[selected='true']:bg-muted">
              {command.replace('__', '').replace('Command', '').replace('__', '')}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {Object.entries(commands).map(([commandKey, command]) => {
        return (
          <TabsContent value={commandKey}>
            <CopyButton
              value={command as string}
              variant={'outline'}
              className={cn(
                'absolute right-3 top-2 bg-transparent border-none [&_svg]:size-5 [&_svg]:text-muted-foreground',
              )}
            />
            <pre className="p-4 pt-2 text-sm text-muted-foreground focus-visible:outline-none focus-visible:shadow-none">
              {command}
            </pre>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
