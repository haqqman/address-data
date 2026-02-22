import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { Providers } from './providers'
import Analytics from '@/components/analytics'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AddressData',
  description: 'Address intelligence platform for Nigeria.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={urbanist.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
