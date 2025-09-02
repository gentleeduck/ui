//@ts-noCheck
'use client'

import React from 'react'

import { NavCollabsedType, NavGroup, NavGroupProps, NavType } from './nav-group'
import { Separator } from './ShadcnUI/separator'
import { cn } from '@gentleduck/libs/cn'
import { filteredObject } from '@gentleduck/libs/filtered-object'

type HeaderProps<T extends boolean> = {
  header: HeaderType
  nav: NavGroupProps<T>
  logo?: React.ReactElement
  footer?: FooterType
}

interface HeaderType extends React.HtmlHTMLAttributes<HTMLDivElement> {
  isCollabsed?: boolean
  position?: 'side' | 'top'
}

type FooterType = {
  buttons: React.ReactNode[]
}

const Header = <T extends boolean>({ nav, header, logo, footer }: HeaderProps<T>) => {
  const { className, position, ...props } = header
  const navIsCollabsed = (header as NavCollabsedType).isCollabsed || false
  const filteredKeys = filteredObject(['isCollabsed'], header)

  return (
    <header
      {...filteredKeys}
      className={cn(
        'py-2 flex',
        position === 'side' ? 'flex-col h-full' : position === 'top' ? 'items-center' : '',
        className,
      )}
      {...props}>
      {logo && logo}
      {position === 'side' && <Separator className="my-1" />}
      <NavGroup<T>
        position={position}
        nav={{ ...nav.nav, isCollabsed: navIsCollabsed } as NavType<true>}
        navigationKeys={nav.navigationKeys}
      />

      {position === 'side' && <Separator className="my-1" />}
      <div>{footer && footer.buttons.map((button, idx) => <React.Fragment key={idx}>{button}</React.Fragment>)} </div>
    </header>
  )
}

Header.displayName = 'Header'

export { Header, type HeaderProps, type HeaderType, type FooterType }
