import Image from 'next/image'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <Image src="/logo.png" alt="DocDuck" width={48} height={48} />
            <h1 className="font-bold text-3xl tracking-tight">DocDuck</h1>
          </Link>
          <p className="mt-2 text-muted-foreground text-sm">Create your account to get started</p>
        </div>
        <RegisterForm />
        <p className="text-center text-muted-foreground text-xs">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
