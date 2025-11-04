'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Spinner } from '@nextui-org/react'

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const { loading } = useAuth()

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

  return <>{children}</>
}
