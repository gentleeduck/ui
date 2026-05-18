'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createWorkspaceSchema } from '@/lib/validations'
import { createWorkspace } from '@/server/actions/workspace'

export default function NewWorkspacePage() {
  const _router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      name: String(formData.get('name') ?? ''),
      slug: String(formData.get('slug') ?? ''),
    }

    const result = createWorkspaceSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.set('name', result.data.name)
      fd.set('slug', result.data.slug)
      await createWorkspace(fd)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create Workspace</CardTitle>
          <CardDescription>Set up a new workspace for your team.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input id="name" name="name" type="text" placeholder="My Workspace" />
              {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" name="slug" type="text" placeholder="my-workspace" />
              {errors.slug && <p className="text-destructive text-xs">{errors.slug}</p>}
              <p className="text-muted-foreground text-xs">Lowercase letters, numbers, and hyphens only</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" loading={loading}>
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
