'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/auth-client'
import { registerSchema } from '@/lib/validations'

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const parsed = registerSchema.safeParse(raw)
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

    const result = await signUp.email({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (result.error) {
      toast.error(result.error.message ?? 'Registration failed')
      setLoading(false)
    } else {
      router.push('/workspaces')
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create account</CardTitle>
        <CardDescription>Fill in your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="Your name" aria-invalid={!!fieldErrors.name} />
            {fieldErrors.name && <p className="text-destructive text-sm">{fieldErrors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
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
              placeholder="At least 8 characters"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && <p className="text-destructive text-sm">{fieldErrors.password}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="register-form" className="w-full" loading={loading}>
          Create account
        </Button>
        <p className="text-center text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-foreground underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
