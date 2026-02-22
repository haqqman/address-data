'use client'

import { type ReactNode, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Spinner } from '@heroui/react'
import { useRouter, usePathname } from 'next/navigation'
import { ConsoleTopbar } from '@/components/layout/console/topbar'
import { Footer } from '@/components/layout/footer'
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
        <Spinner label='Redirecting...' color='warning' labelColor='warning' />
      </div>
    )
  }

  if (isOnLoginPage) {
    return <>{children}</>
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <ConsoleTopbar />
      <main className='flex-grow max-w-7xl mx-auto px-4 py-8'>{children}</main>
      <Footer />
    </div>
  )
}
