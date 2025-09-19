import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Terminal } from 'lucide-react'
import { CopyButton } from '~/components/copy-button'
import { Event } from '~/lib/events'
import { NpmCommands } from '~/types/unist'

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
      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          className={cn(
            'absolute right-1.5 bg-transparent border-none top-1.5 [&_svg]:size-5 [&_svg]:text-muted-foreground',
            __withMeta__ && 'top-16',
          )}
          event={__event__}
          value={__rawString__}
          variant={'outline'}
        />
      )}
      {__npmCommand__ && __yarnCommand__ && __pnpmCommand__ && __bunCommand__ ? (
        <ShellCommand
          __bunCommand__={__bunCommand__}
          __npmCommand__={__npmCommand__}
          __pnpmCommand__={__pnpmCommand__}
          __yarnCommand__={__yarnCommand__}
          {...props}
        />
      ) : (
        <pre
          className={cn(
            'max-h-[650px] overflow-auto rounded-lg py-4 focus-visible:outline-none focus-visible:shadow-none',
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
    __bunCommand__,
    __npmCommand__,
    __pnpmCommand__,
    __yarnCommand__,
  }
  return (
    <Tabs className="rounded-md" defaultValue="__npmCommand__">
      <TabsList className="justify-start w-fit bg-transparent py-2">
        <div className="size-4 bg-foreground/65 flex flex-col items-center justify-center ltr:ml-3 ltr:mr-2 rtl:ml-2 rtl:mr-3">
          <Terminal className="text-background size-4 " />
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
                'absolute right-1.5 top-1.5 bg-transparent border-none [&_svg]:size-5 [&_svg]:text-muted-foreground',
              )}
              value={command as string}
              variant={'outline'}
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
