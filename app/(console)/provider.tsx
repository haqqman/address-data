'use client'

import { type ReactNode, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Spinner } from '@nextui-org/react'
import { useRouter, usePathname } from 'next/navigation'
import { ConsoleHeader } from '@/scaffold/console/header'
import Link from 'next/link'
import type { User } from '@/types'

const CONSOLE_ROLES: User['role'][] = ['cto', 'administrator', 'manager']
const LOGIN_PAGE = '/console'

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isOnLoginPage = pathname === LOGIN_PAGE
  const isAuthorized = !!user && CONSOLE_ROLES.includes(user.role)
  const displayYear = new Date().getFullYear()

  useEffect(() => {
    if (!loading && !isOnLoginPage && !isAuthorized) {
      router.replace(LOGIN_PAGE)
    }
  }, [loading, isOnLoginPage, isAuthorized, router])

  // Show spinner while auth state is resolving
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner
          label='Loading Console...'
          color='warning'
          labelColor='warning'
        />
      </div>
    )
  }

  // Show spinner while redirect is in progress to prevent flashing protected content
  if (!isOnLoginPage && !isAuthorized) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner
          label='Redirecting...'
          color='warning'
          labelColor='warning'
        />
      </div>
    )
  }

  // Login page — render children only, no header/footer chrome
  if (isOnLoginPage) {
    return <>{children}</>
  }

  // Authenticated console pages — render full shell with header and footer
  return (
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
  )
}
