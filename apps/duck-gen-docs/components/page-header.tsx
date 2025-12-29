import { cn } from '@gentleduck/libs/cn'

function PageHeader({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn('border-grid', className)} {...props}>
      <div className="container-wrapper">
        <div className="container flex flex-col items-center text-center gap-2 xl:gap-4 py-[clamp(2rem,5vw,5rem)]">
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
        'text-primary leading-tighter max-w-4xl text-4xl uppercase font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter',
        className,
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-accent-foreground/80 max-w-3xl text-base text-balance sm:text-lg', className)} {...props} />
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
