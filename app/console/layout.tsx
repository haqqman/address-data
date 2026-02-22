import type { ReactNode } from 'react'
import { ConsoleHeader } from '@/scaffold/console/header'
import { ConsoleProvider } from '@/app/console/provider'
import Link from 'next/link'

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  const displayYear = new Date().getFullYear()

  return (
    <ConsoleProvider>
      <div className='flex flex-col min-h-screen'>
        <ConsoleHeader />
        <main className='flex-grow max-w-7xl mx-auto px-4 py-8'>{children}</main>
        <footer className='py-8 border-t bg-background'>
          <div className='max-w-7xl mx-auto px-4 text-center text-muted-foreground'>
            <p className='mb-2'>
              Built for Nigeria, for developers. Powered by{' '}
              <Link
                href='https://seapane.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:text-secondary no-underline'
              >
                Seapane
              </Link>
            </p>
            <p className='text-sm'>
              &copy; {displayYear} AddressData. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </ConsoleProvider>
  )
}
