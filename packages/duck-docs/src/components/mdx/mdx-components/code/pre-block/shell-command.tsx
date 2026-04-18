import { CopyButton } from '@duck-docs/components/copy-button'
import type { INpmCommands } from '@duck-docs/types/unist'
import { cn } from '@gentleduck/libs/cn'
import { Separator } from '@gentleduck/registry-ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'
import { Terminal } from 'lucide-react'

export function ShellCommand({ __npmCommand__, __yarnCommand__, __pnpmCommand__, __bunCommand__ }: INpmCommands) {
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
          <Terminal aria-hidden="true" className="size-4 text-background" />
        </div>
        {Object.keys(commands).map((command) => {
          return (
            <TabsTrigger className="aria-[selected='true']:bg-muted" key={command} value={command}>
              {command.replace('__', '').replace('Command', '').replace('__', '')}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <Separator />
      {Object.entries(commands).map(([commandKey, command]) => {
        return (
          <TabsContent className="[&_pre]:max-w-[620px] [&_pre]:overflow-auto" key={commandKey} value={commandKey}>
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
