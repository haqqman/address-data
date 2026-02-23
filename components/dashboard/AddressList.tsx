'use client'

import type { AddressSubmission } from '@/types'
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ScrollShadow,
} from '@heroui/react'
import { format } from 'date-fns'
import { useIsMobile } from '@/hooks/use-mobile'

interface AddressListProps {
  addresses: AddressSubmission[]
  title: string
}

export function AddressList({ addresses, title }: AddressListProps) {
  const isMobile = useIsMobile()

  const getStatusChipColor = (
    status: AddressSubmission['status'],
  ): 'primary' | 'secondary' | 'danger' | 'default' | 'success' | 'warning' => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending-review':
        return 'warning'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  const formatAddress = (address: AddressSubmission['submittedAddress']) => {
    // A more concise format for mobile
    if (isMobile) {
      return `${address.streetAddress}, ${address.city}`
    }
    return `${address.streetAddress}, ${address.areaDistrict || ''}, ${address.city}, ${address.lga}, ${address.state}`.replace(
      /, ,/g,
      ',',
    )
  }

  if (addresses.length === 0) {
    return (
      <Card className='shadow-lg rounded-xl mt-8'>
        <CardHeader className='px-6 pt-6 pb-2'>
          <div className='flex flex-col space-y-0.5'>
            <h2 className='text-xl font-semibold text-primary'>{title}</h2>
          </div>
        </CardHeader>
        <CardBody className='p-6'>
          <p className='text-foreground-500'>
            You haven't contributed any addresses yet.
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className='shadow-lg rounded-xl mt-8'>
      <CardHeader className='px-6 pt-6 pb-2'>
        <div className='flex flex-col space-y-0.5'>
          <h2 className='text-xl font-semibold text-primary'>{title}</h2>
          <p className='text-sm text-foreground-500'>
            View the status of your address contributions.
          </p>
        </div>
      </CardHeader>
      <CardBody className='p-0 md:p-2'>
        <ScrollShadow hideScrollBar className='h-[400px] w-full'>
          <Table aria-label='Address Contributions List' removeWrapper>
            <TableHeader>
              <TableColumn>ADDRESS</TableColumn>
              <TableColumn className={isMobile ? 'hidden' : ''}>
                ADC
              </TableColumn>
              <TableColumn>SUBMITTED</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn className={isMobile ? 'hidden' : ''}>
                NOTES/REASON
              </TableColumn>
            </TableHeader>
            <TableBody
              items={addresses}
              emptyContent='No contributions found.'
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell
                    className='max-w-xs truncate'
                    title={formatAddress(item.submittedAddress)}
                  >
                    {formatAddress(item.submittedAddress)}
                  </TableCell>
                  <TableCell
                    className={
                      isMobile
                        ? 'hidden font-mono text-xs'
                        : 'font-mono text-xs'
                    }
                  >
                    {item.adc || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.submittedAt), 'PP')}
                  </TableCell>
                  <TableCell className='capitalize text-xs font-semibold'>
                    {item.propertyType || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusChipColor(item.status)}
                      size='sm'
                      variant='flat'
                    >
                      {item.status
                        .split('-')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </Chip>
                  </TableCell>
                  <TableCell
                    className={
                      isMobile
                        ? 'hidden max-w-xs truncate'
                        : 'max-w-xs truncate'
                    }
                  >
                    {item.status === 'pending-review' && item.aiFlaggedReason
                      ? `AI: ${item.aiFlaggedReason}`
                      : item.status === 'rejected'
                        ? 'Rejected by admin'
                        : item.status === 'approved'
                          ? 'Approved'
                          : '-'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollShadow>
      </CardBody>
    </Card>
  )
}
