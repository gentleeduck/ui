import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BlogDuck',
  description: 'duck-iam example app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
        {children}
      </body>
    </html>
  )
}
