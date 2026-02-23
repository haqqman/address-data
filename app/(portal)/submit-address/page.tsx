'use client'

import { AddressForm } from '@/components/forms/AddressForm'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardBody,
} from '@heroui/react'

export default function SubmitAddressPage() {
  const router = useRouter()

  const handleSubmissionSuccess = () => {
    router.push('/addresses')
  }

  return (
    <div className='space-y-8'>
      <Card className='w-full shadow-lg rounded-xl bg-background'>
        <CardHeader className='flex flex-col px-6 pt-6 pb-2 items-start space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight text-primary'>
            Submit New Address
          </h1>
          <p className='text-foreground-500'>
            Fill in the details below to add a new address to our database.
          </p>
        </CardHeader>
        <CardBody className='p-6'>
          <AddressForm onSubmissionSuccess={handleSubmissionSuccess} />
        </CardBody>
      </Card>
    </div>
  )
}
