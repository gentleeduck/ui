import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const userId = form.get('userId') as string

  const cookieStore = await cookies()
  cookieStore.set('user-id', userId, { path: '/' })

  redirect('/')
}
