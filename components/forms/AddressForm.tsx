'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import {
  Button,
  Input,
  Card,
  CardBody,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react'
import { submitAddress, lookupZipCode } from '@/app/actions/addressActions'
import { getEstates } from '@/app/actions/estateActions'
import { CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  getStates,
  getLgasForState,
  getCitiesForLga,
} from '@/app/actions/geographyActions'
import type { GeographyState, GeographyLGA, GeographyCity, Estate } from '@/types'

const addressSchema = z
  .object({
    estateId: z.string().optional(),
    estateName: z.string().optional(),
    street: z.string().min(1, 'Street is required'),
    areaDistrict: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    lga: z.string().min(1, 'LGA is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().optional(),
    propertyType: z.enum(['residential', 'commercial'], {
      required_error: 'Property type is required',
    }),
  })
  .refine(
    (data) => {
      // If state is FCT, the district field becomes required.
      if (data.state === 'FCT') {
        return !!data.areaDistrict && data.areaDistrict.length > 0
      }
      return true
    },
    {
      message: 'District is required for FCT.',
      path: ['areaDistrict'],
    },
  )

type AddressFormValues = z.infer<typeof addressSchema>

interface AddressFormProps {
  onSubmissionSuccess?: () => void
}

export function AddressForm({ onSubmissionSuccess }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)
  const { user } = useAuth()

  const [states, setStates] = useState<GeographyState[]>([])
  const [lgas, setLgas] = useState<GeographyLGA[]>([])
  const [cities, setCities] = useState<GeographyCity[]>([]) // Will also hold districts
  const [estates, setEstates] = useState<Estate[]>([])

  const [isLoadingStates, setIsLoadingStates] = useState(true)
  const [isLoadingLgas, setIsLoadingLgas] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false) // Used for cities/districts
  const [isLoadingEstates, setIsLoadingEstates] = useState(true)
  const [isFetchingZipCode, setIsFetchingZipCode] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      estateId: '',
      estateName: '',
      street: '',
      areaDistrict: '',
      city: '',
      lga: '',
      state: '',
      zipCode: '',
      propertyType: 'residential',
    },
  })

  const watchedStateName = watch('state')
  const watchedLgaName = watch('lga')
  const watchedCityName = watch('city')
  const watchedStreet = watch('street')

  useEffect(() => {
    async function fetchZipCode() {
      if (watchedStreet && watchedCityName && watchedStateName && watchedLgaName) {
        setIsFetchingZipCode(true)
        try {
          const zipCode = await lookupZipCode({
            street: watchedStreet,
            city: watchedCityName,
            lga: watchedLgaName,
            state: watchedStateName,
          })
          if (zipCode) {
            setValue('zipCode', zipCode, { shouldValidate: true })
          }
        } catch (error) {
          console.error('Failed to fetch zip code', error)
        } finally {
          setIsFetchingZipCode(false)
        }
      }
    }

    // Setup simple debounce
    const timeoutId = setTimeout(fetchZipCode, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedStreet, watchedCityName, watchedLgaName, watchedStateName, setValue])

  const loadStates = useCallback(async () => {
    setIsLoadingStates(true)
    try {
      const fetchedStates = await getStates()
      setStates(fetchedStates)
    } catch (error) {
      console.error('Failed to load states', error)
    } finally {
      setIsLoadingStates(false)
    }
  }, [])

  const loadEstates = useCallback(async () => {
    setIsLoadingEstates(true)
    try {
      const fetchedEstates = await getEstates('verified')
      setEstates(fetchedEstates)
    } catch (error) {
      console.error('Failed to load estates', error)
    } finally {
      setIsLoadingEstates(false)
    }
  }, [])

  useEffect(() => {
    loadStates()
    loadEstates()
  }, [loadStates, loadEstates])

  const loadLgas = useCallback(async (stateId: string) => {
    setIsLoadingLgas(true)
    setLgas([])
    setCities([])
    try {
      const fetchedLgas = await getLgasForState(stateId)
      setLgas(fetchedLgas)
    } catch (error) {
      console.error('Failed to load LGAs', error)
    } finally {
      setIsLoadingLgas(false)
    }
  }, [])

  const loadCitiesOrDistricts = useCallback(
    async (stateId: string, lgaId: string) => {
      setIsLoadingCities(true)
      setCities([])
      try {
        const fetchedCities = await getCitiesForLga(stateId, lgaId)
        setCities(fetchedCities)
      } catch (error) {
        console.error('Failed to load cities/districts', error)
      } finally {
        setIsLoadingCities(false)
      }
    },
    [],
  )

  const handleStateChange = (selectedName: string) => {
    setValue('state', selectedName, { shouldValidate: true })
    setValue('lga', '', { shouldValidate: false })
    setValue('city', '', { shouldValidate: false })
    setValue('areaDistrict', '', { shouldValidate: false })
    setLgas([])
    setCities([])

    const state = states.find((s) => s.name === selectedName)
    if (state) {
      loadLgas(state.id)
      if (state.name === 'FCT') {
        setValue('city', 'Abuja', { shouldValidate: true })
      }
    }
  }

  const handleLgaChange = (selectedName: string) => {
    setValue('lga', selectedName, { shouldValidate: true })
    if (watchedStateName !== 'FCT') {
      setValue('city', '', { shouldValidate: false })
    }
    setValue('areaDistrict', '', { shouldValidate: false })
    setCities([])

    const selectedState = states.find((s) => s.name === watchedStateName)
    const selectedLga = lgas.find((l) => l.name === selectedName)

    if (selectedState && selectedLga) {
      loadCitiesOrDistricts(selectedState.id, selectedLga.id)
    }
  }

  async function onSubmit(values: AddressFormValues) {
    const isValid = await trigger()
    if (!isValid) {
      setSubmissionStatus({
        type: 'error',
        message: 'Please fill out all required fields correctly.',
      })
      return
    }

    if (!user) {
      setSubmissionStatus({
        type: 'error',
        message: 'User not authenticated. Please log in.',
      })
      return
    }

    setIsSubmitting(true)
    setSubmissionStatus(null)
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string)
      }
    })

    const result = await submitAddress({
      formData,
      user: { id: user.id, displayName: user.displayName, email: user.email },
    })
    setIsSubmitting(false)

    if (result.success) {
      setSubmissionStatus({
        type: 'success',
        message: result.message || 'Address submitted successfully!',
      })
      reset()
      setLgas([])
      setCities([])
      if (onSubmissionSuccess) {
        setTimeout(() => {
          onSubmissionSuccess()
        }, 2000)
      }
    } else {
      setSubmissionStatus({
        type: 'error',
        message: result.message || 'Submission failed. Please try again.',
      })
      console.error('Submission Failed', result.message, result.errors)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {submissionStatus && (
          <Card
            className={`mb-6 ${submissionStatus.type === 'success' ? 'bg-success-50 border-success-200' : submissionStatus.type === 'error' ? 'bg-danger-50 border-danger-200' : 'bg-secondary-50 border-secondary-200'}`}
          >
            <CardBody className='p-4'>
              <div className='flex items-center'>
                {submissionStatus.type === 'success' && (
                  <CheckCircle className='h-5 w-5 text-success mr-3' />
                )}
                {submissionStatus.type === 'error' && (
                  <AlertTriangle className='h-5 w-5 text-danger mr-3' />
                )}
                {submissionStatus.type === 'info' && (
                  <Info className='h-5 w-5 text-secondary mr-3' />
                )}
                <div>
                  <p
                    className={`font-semibold ${submissionStatus.type === 'success' ? 'text-success-700' : submissionStatus.type === 'error' ? 'text-danger-700' : 'text-secondary-700'}`}
                  >
                    {submissionStatus.type === 'success'
                      ? 'Success'
                      : submissionStatus.type === 'error'
                        ? 'Error'
                        : 'Info'}
                  </p>
                  <p
                    className={`text-sm ${submissionStatus.type === 'success' ? 'text-success-600' : submissionStatus.type === 'error' ? 'text-danger-600' : 'text-secondary-600'}`}
                  >
                    {submissionStatus.message}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Controller
            name='estateId'
            control={control}
            render={({ field }) => (
              <Autocomplete
                label='Estate (Optional)'
                placeholder='Search for an estate or select None'
                variant='bordered'
                isLoading={isLoadingEstates}
                selectedKey={field.value || null}
                onSelectionChange={(key) => {
                  const val = key === 'none' || !key ? '' : key.toString()
                  field.onChange(val)
                  const selectedEstate = estates.find((est) => est.id === val)
                  setValue(
                    'estateName',
                    selectedEstate ? selectedEstate.name : '',
                    { shouldValidate: false }
                  )
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                isInvalid={!!errors.estateId}
                errorMessage={errors.estateId?.message}
              >
                {[
                  <AutocompleteItem key="none">
                    None
                  </AutocompleteItem>,
                  ...estates.map((estate) => (
                    <AutocompleteItem key={estate.id}>
                      {estate.name}
                    </AutocompleteItem>
                  )),
                ]}
              </Autocomplete>
            )}
          />
          <Controller
            name='propertyType'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label='Property Type'
                placeholder='Select property type'
                variant='bordered'
                isInvalid={!!errors.propertyType}
                errorMessage={errors.propertyType?.message}
                selectedKeys={[field.value]}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <SelectItem key='residential'>
                  Residential
                </SelectItem>
                <SelectItem key='commercial'>
                  Commercial
                </SelectItem>
              </Select>
            )}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Select
            label='State'
            placeholder='Select a state'
            variant='bordered'
            isInvalid={!!errors.state}
            errorMessage={errors.state?.message}
            isLoading={isLoadingStates}
            selectedKeys={watchedStateName ? [watchedStateName] : []}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            {states.map((state) => (
              <SelectItem key={state.name}>
                {state.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label='LGA (Local Government Area)'
            placeholder='Select an LGA'
            variant='bordered'
            isInvalid={!!errors.lga}
            errorMessage={errors.lga?.message}
            isLoading={isLoadingLgas}
            isDisabled={!watchedStateName || lgas.length === 0}
            selectedKeys={watchedLgaName ? [watchedLgaName] : []}
            onChange={(e) => handleLgaChange(e.target.value)}
          >
            {lgas.map((lga) => (
              <SelectItem key={lga.name}>
                {lga.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {watchedStateName === 'FCT' ? (
            <Input
              label='City'
              value='Abuja'
              isReadOnly
              variant='bordered'
              classNames={{
                inputWrapper: 'bg-default-100',
              }}
            />
          ) : (
            <Controller
              name='city'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label='City / Town'
                  placeholder='Select a city or town'
                  variant='bordered'
                  isInvalid={!!errors.city}
                  errorMessage={errors.city?.message}
                  isLoading={isLoadingCities}
                  isDisabled={!watchedLgaName || cities.length === 0}
                  selectedKeys={field.value ? [field.value] : []}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {cities.map((city) => (
                    <SelectItem key={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          )}
          <Controller
            name='areaDistrict'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label='District (FCT Only)'
                placeholder='Select a district'
                variant='bordered'
                isInvalid={!!errors.areaDistrict}
                errorMessage={errors.areaDistrict?.message}
                isLoading={isLoadingCities}
                isDisabled={
                  watchedStateName !== 'FCT' ||
                  !watchedLgaName ||
                  cities.length === 0
                }
                selectedKeys={field.value ? [field.value] : []}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {cities.map((district) => (
                  <SelectItem key={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Controller
            name='street'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label='Street'
                placeholder='123 Main Street'
                variant='bordered'
                isInvalid={!!errors.street}
                errorMessage={errors.street?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name='zipCode'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label='Zip Code (Auto)'
                placeholder={isFetchingZipCode ? 'Searching Google Maps...' : '- - - - -'}
                variant='bordered'
                isReadOnly
                classNames={{
                  inputWrapper: 'bg-default-50',
                }}
                isInvalid={!!errors.zipCode}
                errorMessage={errors.zipCode?.message}
                endContent={isFetchingZipCode ? <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /> : null}
              />
            )}
          />
        </div>
        <Button
          type='submit'
          color='warning'
          className='w-full md:w-auto text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out'
          isLoading={isSubmitting}
          disabled={isSubmitting || !user}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </>
  )
}
