import { cn } from '@gentleduck/libs/cn'

function PageHeader({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn('border-grid', className)} {...props}>
      <div className="container-wrapper">
        <div className="container flex flex-col items-center gap-2 py-[clamp(2rem,5vw,5rem)] text-center xl:gap-4">
          {children}
        </div>
      </div>
    </section>
  )
}

function PageHeaderHeading({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'max-w-4xl text-balance font-semibold text-4xl text-primary uppercase leading-tighter tracking-tight lg:font-semibold lg:leading-[1.1] xl:text-5xl xl:tracking-tighter',
        className,
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('max-w-3xl text-balance text-accent-foreground/80 text-base sm:text-lg', className)} {...props} />
  )
}

function PageActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none', className)}
      {...props}
    />
  )
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
