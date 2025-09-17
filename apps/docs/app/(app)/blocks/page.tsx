'use client'
import Image from 'next/image'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'
import React from 'react'
import { icons } from './icons'
import { cn } from '@gentleduck/libs/cn'
import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Upload } from 'lucide-react'
import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'

export default function PopoverDemo() {
  return (
    <div
      className="container !px-0 bg-card border border-border w-full grid grid-cols-2 rounded-2xl"
      style={
        {
          '--font-sans': '"Inter", sans-serif',
          '--color-primary': '#2854d0',
          '--color-accent': '#535353',
          '--color-destructive': '#AC0F42',
          '--color-destructive-foreground': '#FEF2F6',
          '--color-muted': '#8C8C96',
          fontFamily: 'var(--font-sans)',
        } as React.CSSProperties
      }>
      <div className="flex flex-col gap-4 border-r border-border p-18 px-22">
        {/* Title */}
        <h2 className="text-2xl font-semibold">Signup</h2>

        {/* Steps */}
        <div className="grid xl:flex items-center gap-4 justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-[var(--color-primary)] rounded-lg grid place-content-center shrink-0">
              <icons.user_filled className="size-4 fill-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-primary/90">Personal Informations</h3>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'grid place-content-center size-8 rounded-full bg-muted text-muted-foreground font-semibold',
                  i === 0 && 'bg-foreground text-accent',
                )}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div className="flex items-start gap-4">
          <div className="size-[100px] bg-muted rounded-xl overflow-hidden shrink-0">
            <Avatar src="/avatars/06.png" alt="WD" width={100} height={100} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <div className="flex item-center gap-2">
              <Button icon={<Upload className="text-[var(--color-muted)]" />}>Upload Image</Button>
              <Button
                variant={'destructive'}
                className="bg-[var(--color-destructive-foreground)] text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/20">
                Remove
              </Button>
            </div>
            <p className="text-[var(--color-muted)] text-sm whitespace-nowrap">
              .png, .jpg, files up to 10mb at least 400px by 400px
            </p>
          </div>
        </div>

        <Separator className="border-dashed bg-transparent border-t-2 my-4" />

        {/* Form */}
        <form className="flex flex-col gap-2 [&_label]:text-[var(--color-accent)] [&_input]:bg-[var(--color-muted)]/10 [&_input]:border-[1.5px] [&_input]:placeholder:text-[var(--color-muted)] [&_input]:placeholder:font-normal [&_*]:whitespace-nowrap">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter your first name.." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter your last name.." />
            </div>
          </div>

          <div className="grid grid-cols-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="your@email.com" />
            </div>
          </div>
        </form>

        <Separator className="border-dashed bg-transparent border-t-2 my-4" />
        <div className="flex items-start gap-2 mb-8">
          <Checkbox
            id="terms"
            className="mt-2 checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]"
          />
          <div className="flex flex-col [&>*]:whitespace-nowrap">
            <Label htmlFor="terms" className="text-lg text-[var(--color-accent)]">
              Subscribe to product update email
            </Label>
            <p className="text-[var(--color-muted)]">Get latest updates about features and product updates</p>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 rounded-2xl">
          <Button size={'lg'} className="rounded-lg bg-[var(--color-primary)] text-primary-foreground">
            Continue
          </Button>
          <Button size={'lg'} className="rounded-lg" variant={'secondary'}>
            You already have an account ?<span className="font-semibold underline"> Sign in</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-18 pl-22 pr-0">
        <Image src="/avatars/login.png" alt="WD" width={2000} height={2000} />
      </div>
    </div>
  )
}
