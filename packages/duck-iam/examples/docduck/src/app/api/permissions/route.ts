import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getScopedPermissions } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  const scope = request.nextUrl.searchParams.get('scope')
  if (!scope) {
    return NextResponse.json({}, { status: 400 })
  }

  const permissions = await getScopedPermissions(session.user.id, scope)
  return NextResponse.json(permissions)
}
