/**
 * @module duck/lazy
 * @author wildduck
 * @license MIT
 * @version 1.0.0
 * @description this is a package for lazy components
 * @category hooks
 * @description Hook to handle lazy loading of components
 * @see [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 */

import { useLazyLoad } from './lazy-component.hooks'
import { DuckLazyProps } from './lazy-component.types'

/**
 * @function DuckLazy
 * @description Hook to handle lazy loading of components
 * @param {DuckLazyProps} props
 * @param {React.ReactNode} props.children
 * @returns {React.JSX.Element}
 *
 * @example
 * ```tsx
 * <DuckLazy>
 *   <div>Content</div>
 * </DuckLazy>
 * ```
 *
 * - Add custom styles to the **placeholder** div
 * ```tsx
 * <DuckLazy className={'[&_div[data-slot="placeholder"]]:h-[512px]'} {...props}>
 *   {children}
 * </DuckLazy>
 * ```
 */
export function DuckLazyComponent({
  children,
  options,
  ...props
}: DuckLazyProps): React.JSX.Element {
  const { isVisible, elementRef } = useLazyLoad({
    rootMargin: '0px', // Adjust this to trigger rendering earlier or later
    threshold: 0.1, // Trigger when 10% of the element is visible
    ...options,
  })

  return (
    <div
      ref={elementRef}
      {...props}
      data-slot="wrapper"
      aria-label="lazy-component"
      aria-details="This component is lazy-loaded and will be displayed when visible"
      aria-description="This component is lazy-loaded"
      aria-describedby="lazy"
      aria-busy={isVisible ? 'false' : 'true'}
      aria-hidden={isVisible ? 'false' : 'true'}
      role="region" // Define the region role to help screen readers understand the content context
      tabIndex={isVisible ? 0 : -1} // Make the element focusable once visible
      aria-live="polite" // Announce changes to content when it becomes visible
      aria-relevant="additions" // Make screen readers announce any added content
      aria-atomic="true" // Ensure that changes in the container are read out as atomic units
    >
      {isVisible ? (
        children
      ) : (
        <div
          data-slot="placeholder"
          className="animate-pulse h-[512px] mb-4 bg-muted"
          role="status" // Indicate to screen readers that this is a placeholder
          aria-live="polite" // Announce the loading state to screen readers
        />
      )}
    </div>
  )
}
      return Button[1]?.props?.value || Button[1]?.props?.__rawString__ || null
    }
  }, [Code])

  return (
    <DuckLazyComponent
      className={cn(
        'group relative my-4 flex flex-col space-y-2 [&_div[data-slot="placeholder"]]:h-[512px]',
        className
      )}
      {...props}
    >
      <Tabs
        defaultValue='preview'
        className='relative mr-auto w-full'
      >
        <div className='flex items-center justify-between pb-3'>
          {!hideCode && (
            <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0 overflow-x-auto [&_button]:shadow-none'>
              {TABS.map((tab) => (
                <TabsTrigger
                  value={tab.value}
                  className='data-[state=active]:text-primary border-b-transparent data-[state=active]:border-b-primary px-12 py-2 border-b-[2px] rounded-none cursor-pointer data-[state=active]:shadow-none'
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>
        <TabsContent
          value='preview'
          className='relative rounded-md border'
        >
          <div className='flex items-center justify-between p-4 absolute w-full'>
            <span className='text-sm text-muted-foreground'>{}</span>
            <div className='flex items-center gap-2'>
              <CopyButton
                value={codeString}
                variant='outline'
              />
            </div>
          </div>
          <ThemeWrapper defaultTheme='zinc'>
            <div
              className={cn(
                'preview flex min-h-[450px] w-full justify-center p-10',
                {
                  'items-center': align === 'center',
                  'items-start': align === 'start',
                  'items-end': align === 'end',
                }
              )}
            >
              <React.Suspense
                fallback={
                  <div className='flex w-full items-center justify-center text-sm text-muted-foreground'>
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    Loading...
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>
          </ThemeWrapper>
        </TabsContent>
        <TabsContent value='code'>
          <div className='flex flex-col space-y-4'>
            <div className='w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[450px] [&_pre]:overflow-auto'>
              {Code}
            </div>
          </div>
        </TabsContent>
        <BuildTab />
      </Tabs>
    </DuckLazyComponent>
  )
}

export const BuildTab = () => {
  return (
    <TabsContent
      value='build'
      className='relative overflow-hidden'
    >
      <div className='h-[450px] overflow-hidden rounded-lg'>
        <img
          src='/builder.png'
          alt='build'
          className='object-cover'
        />
      </div>

      <div className='flex flex-col items-center justify-center gap-4 bg-zinc-700/10 dark:bg-zinc-700/50 rounded-md px-4 py-2 backdrop-blur-sm absolute h-[450px] top-0 left-0 inset-0'>
        <div className='flex items-center gap-4'>
          <Button
            className='font-bold'
            size={'xs'}
            label={{
              children: (
                <div className='text-center'>
                  Know more about me click me! <br /> BTW i am coming soon...
                </div>
              ),
              showLabel: true,
              side: 'top',
            }}
          >
            <Crown />
            <span>Upgrade</span>
          </Button>
        </div>
      </div>
    </TabsContent>
  )
}

export const TABS = [
  {
    name: 'Preview',
    value: 'preview',
  },
  {
    name: 'Code',
    value: 'code',
  },
  {
    name: 'Build',
    value: 'build',
  },
]
