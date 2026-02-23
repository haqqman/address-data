'use client'

import { useState, useEffect, useCallback } from 'react'
import { FlaggedAddressTable } from '@/components/console/FlaggedAddressTable'
import { getFlaggedAddresses } from '@/app/actions/addressActions'
import type { AddressSubmission } from '@/types'
import {
  Skeleton,
  Card,
  CardHeader,
  CardBody,
} from '@heroui/react'
import { AlertTriangle } from 'lucide-react'

export default function ConsoleDashboardPage() {
  const [flaggedSubmissions, setFlaggedSubmissions] = useState<
    AddressSubmission[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFlaggedSubmissions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getFlaggedAddresses()
      setFlaggedSubmissions(data)
    } catch (err) {
      setError('Failed to load flagged address submissions.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFlaggedSubmissions()
  }, [fetchFlaggedSubmissions])

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight text-primary'>
            Address Review Queue
          </h1>
          <p className='text-foreground-500'>
            Review addresses flagged by the AI or requiring manual verification.
          </p>
        </div>
      </div>

      <Card className='shadow-xl rounded-xl bg-background'>
        <CardHeader className='px-6 pt-6 pb-2'>
          <div className='flex flex-col space-y-0.5'>
            <h2 className='text-xl font-semibold text-primary'>
              Pending Reviews
            </h2>
            <p className='text-sm text-foreground-500'>
              The following addresses require manual review. Approve or reject
              them based on verification.
            </p>
          </div>
        </CardHeader>
        <CardBody className='p-2 md:p-4'>
          {isLoading && (
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full rounded-lg bg-default-200' />
              <Skeleton className='h-10 w-full rounded-lg bg-default-200' />
              <Skeleton className='h-10 w-full rounded-lg bg-default-200' />
            </div>
          )}

          {error && (
            <Card className='mt-4 bg-danger-50 border-danger-200 rounded-xl'>
              <CardBody className='p-4'>
                <div className='flex items-center'>
                  <AlertTriangle className='h-5 w-5 text-danger mr-3' />
                  <div>
                    <p className='font-semibold text-danger-700'>Error</p>
                    <p className='text-sm text-danger-600'>{error}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {!isLoading && !error && (
            <FlaggedAddressTable
              addresses={flaggedSubmissions}
              onActionComplete={fetchFlaggedSubmissions}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
