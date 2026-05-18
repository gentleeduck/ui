'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/login')
  }
  return session
}
