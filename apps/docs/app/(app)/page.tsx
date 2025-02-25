'use client'
import Link from 'next/link'

import { siteConfig } from '~/config/site'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '~/components/page-header'
import { CopyButton } from '~/components/copy-button'
import { toast } from 'sonner'
import { Announcement } from '~/components/announcement'
import { ThemeWrapper } from '~/components/theme-wrapper'
import { ThemeCustomizer } from '~/components/theme-customizer'
import { ThemesTabs } from './themes/tabs'
import { buttonVariants } from '@duck/registry-ui-duckui/button'

export default function IndexPage() {
  return (
    <>
      <div className="flex items-start gap-4 p-4  select-none container mt-12">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#18181be6)]"></div>
        <div className="flex sm:min-h-[93vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8 h-[50rem] w-full dark:bg-background bg-white dark:bg-grid-white/[0.1] bg-grid-black/[0.1] ">
          {
            // <Announcement />
          }
          <PageHeader className="container flex flex-col items-center justify-center gap-4">
            <PageHeaderHeading className="text-3xl font-bold mb-4 sm:text-7xl lg:text-7xl">
              Simplify UI Creation with Elegant and Versatile Components.
            </PageHeaderHeading>
            <PageHeaderDescription className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground font-normal">
              Duck UI is a versatile UI library that simplifies creating modern,
              customizable interfaces. It provides a set of pre-built components
              for fast and consistent design across applications.
            </PageHeaderDescription>
            <PageActions className="flex flex-row items-center gap-5 w-fit">
              <Link
                href={'/docs'}
                className={buttonVariants({
                  className: 'px-6 text-[1rem] w-[130px]',
                  size: 'lg',
                })}
              >
                Get Stared
              </Link>
              <Link
                href={siteConfig.links.github}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'px-6 text-[1rem] w-[130px]',
                  size: 'lg',
                })}
                target="_blank"
                rel="noreferrer"
              >
                Github
              </Link>
            </PageActions>
          </PageHeader>
          <span className="flex flex-row items-center gap-3 text-primary text-md max-[800px]:mb-12 bg-secondary px-6 py-2 border border-solid border-border rounded-3xl">
            <span className="flex flex-row items-center gap-1.5 font-mono">
              <span className="text-blue-500 font-semibold">npx</span>
              <span className="text-red-500">duck-ui@latest</span>
              <span>init</span>
            </span>
            <CopyButton
              variant={'outline'}
              value="npx duck-ui@latest init"
              onClick={() => {
                toast.success('Copied to clipboard')
              }}
            />
          </span>
        </div>
        {/*  <div className="container">
                       <ThemeWrapper
                         defaultTheme="zinc"
                         className="relative flex w-full flex-col items-start md:flex-row"
                       >
                         <PageHeader className="w-full">
                           <Announcement />
                           <PageHeaderHeading className="hidden md:block">Add colors. Make it yours.</PageHeaderHeading>
                           <PageHeaderHeading className="md:hidden">Make it yours</PageHeaderHeading>
                           <PageHeaderDescription>
                             Hand-picked themes that you can copy and paste into your apps.
                           </PageHeaderDescription>
                           <PageActions>
                             <ThemeCustomizer />
                           </PageActions>
                         </PageHeader>
                       </ThemeWrapper>
                       <ThemesTabs />
                     </div> */}
      </div>
    </>
  )
}
