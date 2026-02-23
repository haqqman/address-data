'use client'

import type { AddressSubmission } from '@/types'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ScrollShadow,
  Tooltip,
} from '@heroui/react'
import { format } from 'date-fns'

interface UserSubmissionsTableProps {
  submissions: AddressSubmission[]
}

export function UserSubmissionsTable({
  submissions,
}: UserSubmissionsTableProps) {
  const getStatusChipColor = (
    status: AddressSubmission['status'],
  ): 'success' | 'warning' | 'danger' | 'default' => {
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

  const formatFullAddress = (
    address: AddressSubmission['submittedAddress'],
  ) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}, ${address.country} ${address.zipCode ? `(${address.zipCode})` : ''}`
  }

  if (submissions.length === 0) {
    return <p className='text-foreground-500'>No address submissions found.</p>
  }

  return (
    <ScrollShadow
      hideScrollBar
      className='h-[600px] w-full border shadow-md rounded-lg'
    >
      <Table aria-label='User Submissions Table' removeWrapper>
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>SUBMITTED ADDRESS</TableColumn>
          <TableColumn>ADC</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>SUBMITTED AT</TableColumn>
          <TableColumn>REVIEWED AT</TableColumn>
          <TableColumn>AI REASON / NOTES</TableColumn>
        </TableHeader>
        <TableBody
          items={submissions}
          emptyContent='No submissions found.'
        >
          {(submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <div>{submission.userName || 'N/A'}</div>
                <div className='text-xs text-foreground-500'>
                  {submission.userEmail || 'N/A'}
                </div>
              </TableCell>
              <TableCell className='max-w-xs'>
                <Tooltip
                  content={formatFullAddress(submission.submittedAddress)}
                  placement='top-start'
                >
                  <div className='font-medium truncate'>
                    {formatFullAddress(submission.submittedAddress)}
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className='font-mono text-xs'>
                {submission.adc || 'N/A'}
              </TableCell>
              <TableCell className='capitalize text-xs font-semibold'>
                {submission.propertyType || 'N/A'}
              </TableCell>
              <TableCell>
                <Chip
                  size='sm'
                  color={getStatusChipColor(submission.status)}
                  variant='flat'
                >
                  {submission.status
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Chip>
              </TableCell>
              <TableCell>
                {format(new Date(submission.submittedAt), 'PPp')}
              </TableCell>
              <TableCell>
                {submission.reviewedAt
                  ? format(new Date(submission.reviewedAt), 'PPp')
                  : 'N/A'}
              </TableCell>
              <TableCell
                className='max-w-xs truncate'
                title={submission.aiFlaggedReason || 'N/A'}
              >
                {submission.aiFlaggedReason ||
                  (submission.status === 'approved' ||
                  submission.status === 'rejected'
                    ? 'Manually Reviewed'
                    : 'N/A')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollShadow>
  )
}
