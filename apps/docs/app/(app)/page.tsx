// import { TooltipProvider } from '@duck/registry-ui-duckui/tooltip'
// import { MainExample } from '~/layouts'
//
// export default function Home() {
//   return (
//     <TooltipProvider>
//       <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//         <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//           <MainExample />
//         </main>
//       </div>
//     </TooltipProvider>
//   )
// }

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
// import { ThemesTabs } from './themes/tabs'
import { buttonVariants } from '@duck/registry-ui-duckui/button'
import { cn } from '@duck/libs/cn'

export default function IndexPage() {
  return (
    <>
      <div className="grid gap-8 grid-cols-2 select-none container h-[90svh]">
        <PageHeader className="flex flex-col justify-center px-0">
          <PageHeaderHeading className="text-3xl font-semibold mb-3 sm:text-7xl lg:text-6xl px-0">
            Build Beautiful UIs with Simplicity and Power.
          </PageHeaderHeading>
          <PageHeaderDescription className="mb-3 sm:text-xl max-w-[800px] text-muted-foreground font-normal">
            Bring life to your own website with a pack full of ideas made
            specially for magical websites.
          </PageHeaderDescription>
          <Link
            href={'/docs'}
            className={cn(
              buttonVariants({
                variant: 'default',
                size: '2xl',
              }),
            )}
          >
            Get Stared
          </Link>
        </PageHeader>
        <div className="flex flex-col justify-center items-center">
          <img src={'/home.avif'} width={570} height={530} className='w-full' alt='3 people happy to see you using duck ui'  />
        </div>
      </div>
      <div>
        {
          // <Announcement />
        }
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

// <span className="">
//   <span className="flex flex-row items-center gap-1.5 font-mono">
//     <span className="text-blue-500 font-semibold">npx</span>
//     <span className="text-red-500">duck-ui@latest</span>
//     <span>init</span>
//   </span>
//   <CopyButton
//     variant={'outline'}
//     value="npx duck-ui@latest init"
//     onClick={() => {
//       toast.success('Copied to clipboard')
//     }}
//   />
// </span>
//
// <Link
//   href={'/docs'}
//   className={cn(
//     buttonVariants({
//       variant: 'default',
//       size: 'xxxl',
//       className: 'px-12',
//     }),
//   )}
// >
//   Get Stared
// </Link>
