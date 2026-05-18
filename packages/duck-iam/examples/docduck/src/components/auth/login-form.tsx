'use client'

import { InfoIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { signIn } from '@/lib/auth-client'
import { loginSchema } from '@/lib/validations'

const DEMO_USERS = [
  { email: 'alice@example.com', label: 'Alice', roles: 'owner@acme, viewer@startup' },
  { email: 'bob@example.com', label: 'Bob', roles: 'editor@acme, owner@startup' },
  { email: 'charlie@example.com', label: 'Charlie', roles: 'viewer@acme' },
  { email: 'diana@example.com', label: 'Diana', roles: 'admin@acme' },
] as const

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const raw = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const parsed = loginSchema.safeParse(raw)
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !errors[key]) {
          errors[key] = issue.message
        }
      }
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    const result = await signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (result.error) {
      toast.error(result.error.message ?? 'Login failed')
      setLoading(false)
    } else {
      router.push('/workspaces')
      router.refresh()
    }
  }

  async function handleQuickLogin(email: string) {
    setLoading(true)
    const result = await signIn.email({ email, password: 'password123' })
    if (result.error) {
      toast.error(result.error.message ?? 'Login failed')
      setLoading(false)
    } else {
      router.push('/workspaces')
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alice@example.com"
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="password123"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && <p className="text-destructive text-sm">{fieldErrors.password}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="login-form" className="w-full" loading={loading}>
          Sign in
        </Button>
        <p className="text-center text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-foreground underline">
            Register
          </Link>
        </p>
        <Separator />
        <div className="flex w-full flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">Quick login:</span>
          <TooltipProvider delayDuration={200}>
            {DEMO_USERS.map((user) => (
              <Tooltip key={user.email}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => handleQuickLogin(user.email)}
                    className="gap-1 text-xs">
                    {user.label}
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-muted-foreground">{user.roles}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  )
}
