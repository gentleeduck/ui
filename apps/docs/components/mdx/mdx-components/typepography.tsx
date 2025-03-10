import { cn } from '@duck/libs/cn'
import { FC } from 'react'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface AnchorProps extends React.HTMLAttributes<HTMLAnchorElement> {}
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const H1: FC<HeadingProps> = ({ className, ...props }) => (
  <h1
    className={cn(
      'font-heading mt-2 scroll-m-20 text-4xl font-bold',
      className,
    )}
    {...props}
  />
)

export const H2: FC<HeadingProps> = ({ className, ...props }) => (
  <h2
    className={cn(
      'font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
      className,
    )}
    {...props}
  />
)

export const H3: FC<HeadingProps> = ({ className, ...props }) => (
  <h3
    className={cn(
      'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
)

export const H4: FC<HeadingProps> = ({ className, ...props }) => (
  <h4
    className={cn(
      'font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
)

export const H5: FC<HeadingProps> = ({ className, ...props }) => (
  <h5
    className={cn(
      'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
)

export const H6: FC<HeadingProps> = ({ className, ...props }) => (
  <h6
    className={cn(
      'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
)

export const A: FC<AnchorProps> = ({ className, ...props }) => (
  <a
    className={cn('font-medium underline underline-offset-4', className)}
    {...props}
  />
)

export const P: FC<ParagraphProps> = ({ className, ...props }) => (
  <p
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...props}
  />
)
