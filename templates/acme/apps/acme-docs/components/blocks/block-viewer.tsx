/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: Highlighted code HTML is generated upstream and rendered read-only here. */
'use client'

import { getIconForLanguageExtension } from '@gentleduck/docs/client'
import { trackEvent } from '@gentleduck/docs/lib'
import { useCopyToClipboard } from '@gentleduck/hooks/use-copy-to-clipboard'
import { cn } from '@gentleduck/libs/cn'
import type { registryEntrySchema, registryItemFileSchema } from '@gentleduck/registers'
import { Button } from '@gentleduck/registry-ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui/collapsible'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui/resizable'
import { Separator } from '@gentleduck/registry-ui/separator'
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from '@gentleduck/registry-ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui/toggle-group'
import {
  Check,
  ChevronRight,
  Clipboard,
  ExternalLink,
  File,
  Folder,
  Monitor,
  RotateCw,
  Share2,
  Smartphone,
  Tablet,
  Terminal,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import type { PanelImperativeHandle } from 'react-resizable-panels'
import type { z } from 'zod'
import type { createFileTreeForRegistryItemFiles, FileTree } from '~/lib/get-registry-item'

type BlockViewerContext = {
  item: z.infer<typeof registryEntrySchema>
  view: 'code' | 'preview'
  setView: (view: 'code' | 'preview') => void
  activeFile: string | null
  setActiveFile: (file: string) => void
  resizablePanelRef: React.RefObject<PanelImperativeHandle | null> | null
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null
  highlightedFiles:
    | (z.infer<typeof registryItemFileSchema> & {
        highlightedContent: string
      })[]
    | null
  iframeKey?: number
  setIframeKey?: React.Dispatch<React.SetStateAction<number>>
}

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null)

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext)
  if (!context) {
    throw new Error('useBlockViewer must be used within a BlockViewerProvider.')
  }
  return context
}

function BlockViewerProvider({
  item,
  tree,
  highlightedFiles,
  children,
}: Pick<BlockViewerContext, 'item' | 'tree' | 'highlightedFiles'> & {
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<BlockViewerContext['view']>('preview')
  const [activeFile, setActiveFile] = React.useState<BlockViewerContext['activeFile']>(
    highlightedFiles?.[0]?.target ?? null,
  )
  const resizablePanelRef = React.useRef<PanelImperativeHandle>(null)
  const [iframeKey, setIframeKey] = React.useState(0)

  return (
    <BlockViewerContext.Provider
      value={{
        activeFile,
        highlightedFiles,
        iframeKey,
        item,
        resizablePanelRef,
        setActiveFile,
        setIframeKey,
        setView,
        tree,
        view,
      }}>
      <div
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-2 overflow-hidden md:flex-col"
        data-view={view}
        id={item.name}
        style={
          {
            '--height': '930px',
          } as React.CSSProperties
        }>
        {children}
      </div>
    </BlockViewerContext.Provider>
  )
}

function BlockViewerToolbar() {
  const { setView, view, item, resizablePanelRef, setIframeKey } = useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const { copyToClipboard: copyToClipboardLink, isCopied: isCopiedLink } = useCopyToClipboard()

  return (
    <div className="hidden w-full items-center gap-2 lg:flex">
      <Tabs onValueChange={(value) => setView(value as 'preview' | 'code')} value={view}>
        <TabsList className="grid grid-cols-2 items-center rounded-md border p-0">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <a
        className="flex-1 text-center font-medium text-base underline-offset-2 hover:underline md:flex-auto md:text-left"
        href={`#${item.name}`}>
        {item.description?.replace(/\.$/, '')}
      </a>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md border">
          <ToggleGroup
            defaultValue="100"
            onValueChange={(value) => {
              setView('preview')
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value, 10))
              }
            }}
            type="single">
            <ToggleGroupItem aria-label="Desktop" value="100">
              <Monitor aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="Tablet" value="60">
              <Tablet aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="Mobile" value="30">
              <Smartphone aria-hidden="true" />
            </ToggleGroupItem>

            <Separator className="!h-6" orientation="vertical" />

            <Button asChild aria-label="Open in new tab" className="size-9 rounded-none" size="icon" variant="ghost">
              <Link href={`/view/${item.name}`} target="_blank">
                <ExternalLink aria-hidden="true" />
              </Link>
            </Button>
            <Separator className="!h-6" orientation="vertical" />

            <Button
              aria-label="Refresh preview"
              className="size-9 rounded-none p-0"
              onClick={() => {
                if (setIframeKey) {
                  setIframeKey((k) => k + 1)
                }
              }}
              size="icon"
              variant="ghost">
              <RotateCw aria-hidden="true" />
            </Button>

            <Separator className="!h-6" orientation="vertical" />
            <Button
              aria-label={isCopiedLink ? 'Link copied' : 'Share preview link'}
              className="size-9 rounded-none p-0"
              onClick={() => {
                copyToClipboardLink(`${window.location.origin}/view/${item.name}`)
              }}
              size="icon"
              variant="ghost">
              {isCopiedLink ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
            </Button>
          </ToggleGroup>
        </div>
        <Separator className="!h-6 mx-1" orientation="vertical" />
        <Button
          className="mr-2"
          onClick={() => {
            copyToClipboard(`npx @acme/cli add ${item.name}`)
          }}
          variant="secondary">
          {isCopied ? <Check aria-hidden="true" /> : <Terminal aria-hidden="true" />}
          <span className="font-medium">npx @acme/cli add {item.name}</span>
        </Button>
        {
          // <Separator className="mx-1 !h-4" orientation="vertical" />
          // <OpenInV0Button name={item.name} />
        }
      </div>
    </div>
  )
}

function BlockViewerIframe({ className }: { className?: string }) {
  const { item, iframeKey } = useBlockViewer()

  return (
    <iframe
      className={cn('no-scrollbar relative z-20 w-full bg-background', className)}
      height={930}
      key={iframeKey}
      loading="lazy"
      src={`/view/${item.name}`}
      title={`Preview of ${item.name}`}
    />
  )
}

function BlockViewerView() {
  const { resizablePanelRef } = useBlockViewer()

  return (
    <div className="hidden group-data-[view=code]/block-view-wrapper:hidden md:h-(--height) lg:flex">
      <div className="relative grid w-full gap-4">
        <div className="absolute inset-0 right-4 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
        <ResizablePanelGroup
          className="relative z-10 after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl after:bg-surface/50"
          orientation="horizontal">
          <ResizablePanel
            className="relative aspect-[4/2.5] overflow-hidden rounded-lg border bg-background md:aspect-auto md:rounded-xl"
            defaultSize={100}
            minSize={30}
            panelRef={resizablePanelRef}>
            <BlockViewerIframe />
          </ResizablePanel>
          <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function BlockViewerMobile({ children: _children }: { children: React.ReactNode }) {
  const { item } = useBlockViewer()

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <div className="line-clamp-1 font-medium text-base">{item.description}</div>
        <div className="ml-auto shrink-0 font-mono text-muted-foreground text-xs">{item.name}</div>
      </div>
      {
        // item.meta?.mobile === 'component' ? (
        //         children
        //       ) : (
        //         <div className="overflow-hidden rounded-xl border">
        //           <Image
        //             src={`/r/styles/new-york-v4/${item.name}-light.png`}
        //             alt={item.name}
        //             data-block={item.name}
        //             width={1440}
        //             height={900}
        //             className="object-cover dark:hidden"
        //           />
        //           <Image
        //             src={`/r/styles/new-york-v4/${item.name}-dark.png`}
        //             alt={item.name}
        //             data-block={item.name}
        //             width={1440}
        //             height={900}
        //             className="hidden object-cover dark:block"
        //           />
        //         </div>
        //       )
      }
    </div>
  )
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles } = useBlockViewer()

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  if (!file) {
    return null
  }

  const language = file.path.split('.').pop() ?? 'tsx'

  return (
    <div className="mr-[14px] flex overflow-hidden rounded-xl border bg-code text-code-foreground group-data-[view=preview]/block-view-wrapper:hidden md:h-(--height)">
      <div className="w-72">
        <BlockViewerFileTree />
      </div>
      <figure
        className="!mx-0 mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none"
        data-rehype-pretty-code-figure="">
        <figcaption
          className="!text-base !font-medium flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={language}>
          {getIconForLanguageExtension(language)}
          {file.target}
          <div className="ml-auto flex items-center gap-2">
            <BlockCopyCodeButton />
          </div>
        </figcaption>
        <div
          className="overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
          key={file.path}
        />
      </figure>
    </div>
  )
}

export function BlockViewerFileTree() {
  const { tree } = useBlockViewer()

  if (!tree) {
    return null
  }

  return (
    <SidebarProvider className="!min-h-full flex flex-col border-r">
      <Sidebar className="w-full flex-1" collapsible="none">
        <SidebarGroupLabel className="h-12 rounded-none border-b px-4 text-base">Files</SidebarGroupLabel>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="translate-x-0">
              {tree.map((file) => {
                return <Tree index={1} item={file} key={file.path ?? `${file.name}-root`} />
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  )
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          className="whitespace-nowrap rounded-none pl-(--index) font-medium text-base hover:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
          data-index={index}
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
          style={
            {
              '--index': `${index * 1.6}rem`,
            } as React.CSSProperties
          }>
          <File aria-hidden="true" className="h-4 w-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible gap-0 [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="!pl-(--index) justify-start whitespace-nowrap rounded-none text-base hover:bg-muted-foreground/15 active:bg-muted-foreground/15 [&[data-open='true']_svg:first-child]:rotate-90"
            style={
              {
                '--index': `${index}rem`,
              } as React.CSSProperties
            }>
            <ChevronRight aria-hidden="true" className="transition-transform" />
            <Folder aria-hidden="true" />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 gap-0 border-none p-0">
            {item.children.map((subItem) => (
              <Tree index={index + 1} item={subItem} key={subItem.path ?? `${item.name}-${subItem.name}`} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

function BlockCopyCodeButton() {
  const { activeFile, item } = useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const file = React.useMemo(() => {
    return item.files?.find((file) => file.target === activeFile)
  }, [activeFile, item.files])

  const content = file?.content

  if (!content) {
    return null
  }

  return (
    <Button
      aria-label={isCopied ? 'Copied' : 'Copy code'}
      className="size-7"
      onClick={() => {
        copyToClipboard(content)
        trackEvent({
          name: 'copy_block_code',
          properties: {
            file: file.path,
            name: item.name,
          },
        })
      }}
      size="icon"
      variant="ghost">
      {isCopied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
    </Button>
  )
}

function BlockViewer({
  item,
  tree,
  highlightedFiles,
  children,
  ...props
}: Pick<BlockViewerContext, 'item' | 'tree' | 'highlightedFiles'> & {
  children: React.ReactNode
}) {
  return (
    <BlockViewerProvider highlightedFiles={highlightedFiles} item={item} tree={tree} {...props}>
      <BlockViewerToolbar />
      <BlockViewerView />
      <BlockViewerCode />
      <BlockViewerMobile>{children}</BlockViewerMobile>
    </BlockViewerProvider>
  )
}

export { BlockViewer }
