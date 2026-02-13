'use client'

import { useDocsConfig } from '@duck-docs/context'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@gentleduck/registry-ui-duckui/drawer'
import { ScrollArea } from '@gentleduck/registry-ui-duckui/scroll-area'
import { PanelsTopLeft } from 'lucide-react'
import Link, { type LinkProps } from 'next/link'
import * as React from 'react'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const docsConfig = useDocsConfig()

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          icon={<PanelsTopLeft />}
          size={'icon'}
          variant="ghost"></Button>
      </DrawerTrigger>
      <DrawerContent className="pr-0 pb-4">
        <ScrollArea>
          <div className="hide-scroll my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {docsConfig.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink href={item.href} key={item.href} onOpenChange={setOpen}>
                      {item.title}
                    </MobileLink>
                  ),
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {docsConfig.sidebarNav.map((item, index) => (
                <div className="flex flex-col space-y-3 pt-6" key={index}>
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map((item) => (
                      <React.Fragment key={item.href}>
                        {!item.disabled &&
                          (item.href ? (
                            <MobileLink className="text-muted-foreground" href={item.href} onOpenChange={setOpen}>
                              {item.title}
                              {item.label && (
                                <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 text-accent text-xs leading-none no-underline group-hover:no-underline">
                                  {item.label}
                                </span>
                              )}
                            </MobileLink>
                          ) : (
                            item.title
                          ))}
                      </React.Fragment>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  return (
    <Link
      className={cn(className)}
      href={href}
      scroll
      onClick={() => {
        onOpenChange?.(false)
      }}
      {...props}>
      {children}
    </Link>
  )
}
