import { Link } from '@tanstack/react-router'
import Logo from '~/assets/logomark.svg?react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@gentleduck/registry-ui-duckui/navigation-menu'
import DuckUILogo from '~/assets/duck-ui-logo.png'
export default function Header() {
  return (
    <header className="mx-auo  p-10 h-10 flex gap-2 justify-between">
      <nav className="flex items-center gap-2">
        <div className="px-2 font-bold">
          <Link to="/">
            <Logo
              className="transition-transform duration-500 ease-(--duck-motion-spring) hover:rotate-360 "
              width={40}
              height={40}
            />
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent className="border-border">
                <ul className="grid grid-cols-12 w-xl gap-3 p-6  ">
                  <li className="col-span-6">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md  bg-gradient-to-b from-black from-50% to-purple-500 text-white p-6 no-underline outline-none focus:shadow-md"
                        to="/">
                        <Logo className="mx-auto" width={150} height={150} />
                        <p className="mb-2 mt-4 text-lg font-medium">duck/ui 🦆</p>
                        <p className="text-sm leading-tight">the progressive UI framework</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ul className="col-span-6 ">
                    <li className="">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex select-none flex-col justify-end px-4 py-3 rounded-md no-underline outline-none focus:shadow-md"
                          to="/">
                          <p className="text-lg font-medium whitespace-nowrap">duck/ui 🦆</p>
                          <p className="text-sm leading-tight text-pretty">the progressive UI framework</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex select-none flex-col justify-end px-4 py-3 rounded-md no-underline outline-none focus:shadow-md"
                          to="/">
                          <p className="text-lg font-medium whitespace-nowrap">@gentelduck/variants 🎨</p>
                          <p className="text-sm leading-tight text-pretty">
                            A lightweight utility for generating class names based on variant configurations
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex select-none flex-col justify-end px-4 py-3 rounded-md no-underline outline-none focus:shadow-md"
                          to="/">
                          <p className="text-lg font-medium whitespace-nowrap">@gentelduck/aria-feather 🦅</p>
                          <p className="text-sm leading-tight text-pretty">
                            an behavioral headless library for making interactive components
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  )
}
