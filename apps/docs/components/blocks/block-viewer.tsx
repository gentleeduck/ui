'use client'

import { cn } from '@gentleduck/libs/cn'
import { registry_entry_schema, registry_item_file_schema } from '@gentleduck/registers'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gentleduck/registry-ui-duckui/collapsible'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gentleduck/registry-ui-duckui/resizable'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
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
} from '@gentleduck/registry-ui-duckui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@gentleduck/registry-ui-duckui/toggle-group'
import {
  Check,
  ChevronRight,
  Clipboard,
  ExternalLink,
  File,
  Folder,
  Fullscreen,
  Monitor,
  RotateCw,
  Share2,
  Smartphone,
  Tablet,
  Terminal,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { z } from 'zod'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { trackEvent } from '~/lib/events'
import { createFileTreeForRegistryItemFiles, FileTree } from '~/lib/get-registry-item'
import { getIconForLanguageExtension } from '../icons'

type BlockViewerContext = {
  item: z.infer<typeof registry_entry_schema>
  view: 'code' | 'preview'
  setView: (view: 'code' | 'preview') => void
  activeFile: string | null
  setActiveFile: (file: string) => void
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null> | null
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null
  highlightedFiles:
    | (z.infer<typeof registry_item_file_schema> & {
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
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null)
  const [iframeKey, setIframeKey] = React.useState(0)

  return (
    <BlockViewerContext.Provider
      value={{
        item,
        view,
        setView,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
        iframeKey,
        setIframeKey,
      }}>
      <div
        id={item.name}
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-2 overflow-hidden md:flex-col"
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
      <Tabs value={view} onValueChange={(value) => setView(value as 'preview' | 'code')}>
        <TabsList className="grid grid-cols-2 items-center rounded-md p-0 border">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <a
        href={`#${item.name}`}
        className="flex-1 text-center text-base font-medium underline-offset-2 hover:underline md:flex-auto md:text-left">
        {item.description?.replace(/\.$/, '')}
      </a>
      <div className="ml-auto flex items-center gap-2">
        <div className="items-center gap-1.5 rounded-md border flex">
          <ToggleGroup
            type="single"
            defaultValue="100"
            onValueChange={(value) => {
              setView('preview')
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value))
              }
            }}>
            <ToggleGroupItem value="100" title="Desktop">
              <Monitor />
            </ToggleGroupItem>
            <ToggleGroupItem value="60" title="Tablet">
              <Tablet />
            </ToggleGroupItem>
            <ToggleGroupItem value="30" title="Mobile">
              <Smartphone />
            </ToggleGroupItem>

            <Separator orientation="vertical" className="!h-6" />

            <Button size="icon" variant="ghost" className="rounded-none size-9" title="Open in New Tab">
              <Link href={`/view/${item.name}`} target="_blank">
                <span className="sr-only">Open in New Tab</span>
                <ExternalLink />
              </Link>
            </Button>
            <Separator orientation="vertical" className="!h-6" />

            <Button
              size="icon"
              variant="ghost"
              className="p-0 rounded-none size-9"
              title="Refresh Preview"
              onClick={() => {
                if (setIframeKey) {
                  setIframeKey((k) => k + 1)
                }
              }}>
              <RotateCw />
              <span className="sr-only">Refresh Preview</span>
            </Button>

            <Separator orientation="vertical" className="!h-6" />
            <Button
              size="icon"
              variant="ghost"
              className="p-0 rounded-none size-9"
              title="Share Preview Link"
              onClick={() => {
                copyToClipboardLink(`${window.location.origin}/view/${item.name}`)
              }}>
              {isCopiedLink ? <Check /> : <Share2 />}
              <span className="sr-only">Share</span>
            </Button>
          </ToggleGroup>
        </div>
        <Separator orientation="vertical" className="mx-1 !h-6" />
        <Button
          variant="secondary"
          onClick={() => {
            copyToClipboard(`npx @gentleduck/duck-ui@latest add ${item.name}`)
          }}>
          {isCopied ? <Check /> : <Terminal />}
          <span className="font-medium">npx @gentleduck/duck-ui add {item.name}</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        {
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
      key={iframeKey}
      src={`/view/${item.name}`}
      height={930}
      loading="lazy"
      className={cn('bg-background no-scrollbar relative z-20 w-full', className)}
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
          direction="horizontal"
          className="after:bg-surface/50 relative z-10 after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl">
          <ResizablePanel
            ref={resizablePanelRef}
            className="bg-background relative aspect-[4/2.5] overflow-hidden rounded-lg border md:aspect-auto md:rounded-xl"
            defaultSize={100}
            minSize={30}>
            <BlockViewerIframe />
          </ResizablePanel>
          <ResizableHandle className="after:bg-border relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:transition-all after:hover:h-10 md:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function BlockViewerMobile({ children }: { children: React.ReactNode }) {
  const { item } = useBlockViewer()

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <div className="line-clamp-1 text-base font-medium">{item.description}</div>
        <div className="text-muted-foreground ml-auto shrink-0 font-mono text-xs">{item.name}</div>
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
    <div className="bg-code text-code-foreground mr-[14px] flex overflow-hidden rounded-xl border group-data-[view=preview]/block-view-wrapper:hidden md:h-(--height)">
      <div className="w-72">
        <BlockViewerFileTree />
      </div>
      <figure
        data-rehype-pretty-code-figure=""
        className="!mx-0 mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none">
        <figcaption
          className="text-code-foreground [&_svg]:text-code-foreground flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 [&_svg]:size-4 [&_svg]:opacity-70 !text-base !font-medium"
          data-language={language}>
          {getIconForLanguageExtension(language)}
          {file.target}
          <div className="ml-auto flex items-center gap-2">
            <BlockCopyCodeButton />
          </div>
        </figcaption>
        <div
          key={file?.path}
          dangerouslySetInnerHTML={{ __html: file?.highlightedContent ?? '' }}
          className="overflow-y-auto"
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
    <SidebarProvider className="flex !min-h-full flex-col border-r">
      <Sidebar collapsible="none" className="w-full flex-1">
        <SidebarGroupLabel className="h-12 rounded-none border-b px-4 text-base">Files</SidebarGroupLabel>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="translate-x-0">
              {tree.map((file, index) => {
                return <Tree key={index} item={file} index={1} />
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
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
          className="hover:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap text-base font-medium"
          data-index={index}
          style={
            {
              '--index': `${index * 1.6}rem`,
            } as React.CSSProperties
          }>
          <File className="h-4 w-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90 gap-0"
        defaultOpen>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="hover:bg-muted-foreground/15 active:bg-muted-foreground/15 rounded-none !pl-(--index) whitespace-nowrap [&[data-open='true']_svg:first-child]:rotate-90 justify-start text-base"
            style={
              {
                '--index': `${index}rem`,
              } as React.CSSProperties
            }>
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0 gap-0">
            {item.children.map((subItem, key) => (
              <Tree key={key} item={subItem} index={index + 1} />
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
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => {
        copyToClipboard(content)
        trackEvent({
          name: 'copy_block_code',
          properties: {
            name: item.name,
            file: file.path,
          },
        })
      }}>
      {isCopied ? <Check /> : <Clipboard />}
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
    <BlockViewerProvider item={item} tree={tree} highlightedFiles={highlightedFiles} {...props}>
      <BlockViewerToolbar />
      <BlockViewerView />
      <BlockViewerCode />
      <BlockViewerMobile>{children}</BlockViewerMobile>
    </BlockViewerProvider>
  )
}

export { BlockViewer }
