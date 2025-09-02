'use client'

import { cn } from '@gentleduck/libs/cn'
import { Block } from '@gentleduck/registers'
import { Button, ButtonProps } from '@gentleduck/registry-ui-duckui/button'
import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { editInV0 } from './v0Button.server'

export function V0Button({
  block,
  size = 'default',
  disabled,
  className,
  ...props
}: {
  block: Pick<Block, 'name' | 'description' | 'code' | 'style'>
} & ButtonProps) {
  return (
    <form
      action={async () => {
        try {
          const result = await editInV0({
            name: block.name,
            description: block.description || '',
            code: block.code,
            style: block.style,
          })
          if (result?.error) {
            throw new Error(result.error)
          }

          if (result?.url) {
            const popupOpened = window.open(result.url, '_blank')
            if (!popupOpened) {
              toast.warning('Pop-up window blocked.', {
                description: 'Click the pop-up button in your browser to continue.',
                duration: 5000,
              })
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message)
          }
        }
      }}>
      <Form size={size} className={className} disabled={disabled} {...props} />
    </form>
  )
}

function Form({ disabled, className, ...props }: Omit<React.ComponentProps<typeof V0Button>, 'block'>) {
  const { pending } = useFormStatus()

  return (
    <Button
      aria-label="Edit in v0"
      className={cn(
        'z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black',
        className,
      )}
      loading={pending}
      secondIcon={<V0Logo />}
      disabled={disabled || pending}
      label={{
        children: 'Edit in V0',
        showLabel: true,
        side: 'bottom',
        // delayDuration: 0,
      }}
      {...props}>
      Edit in
    </Button>
  )
}

export function V0Logo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-5 w-5 text-current', className)}
      {...props}>
      <path
        d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
        fill="currentColor"></path>
      <path
        d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
        fill="currentColor"></path>
    </svg>
  )
}
