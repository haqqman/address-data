
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardBody as NextUICardBody, Select as NextUISelect, SelectItem as NextUISelectItem } from "@nextui-org/react";
import { submitAddress } from "@/app/actions/addressActions";
import { CheckCircle, Loader2, AlertTriangle, Info } from "lucide-react"; 
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context"; 
import { getStates, getLgasForState, getCitiesForLga } from "@/app/actions/geographyActions";
import type { GeographyState, GeographyLGA, GeographyCity } from "@/types";

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  areaDistrict: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  lga: z.string().min(1, "LGA is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmissionSuccess?: () => void;
}

export function AddressForm({ onSubmissionSuccess }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const { user } = useAuth(); 
  
  const [states, setStates] = useState<GeographyState[]>([]);
  const [lgas, setLgas] = useState<GeographyLGA[]>([]);
  const [cities, setCities] = useState<GeographyCity[]>([]);

  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedLga, setSelectedLga] = useState<string>("");


  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetAddress: "",
      areaDistrict: "",
      city: "",
      lga: "",
      state: "",
      zipCode: "",
      country: "Nigeria", 
    },
  });

  const watchedState = watch("state");
  const watchedLga = watch("lga");

  useEffect(() => {
    async function loadStates() {
      setIsLoadingStates(true);
      try {
        const fetchedStates = await getStates();
        setStates(fetchedStates);
      } catch (error) {
        console.error("Failed to load states", error);
      } finally {
        setIsLoadingStates(false);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    const stateId = states.find(s => s.name === watchedState)?.id;
    if (stateId) {
      setSelectedState(stateId);
      setValue("lga", "");
      setValue("city", "");
      setLgas([]);
      setCities([]);
    }
  }, [watchedState, states, setValue]);

  useEffect(() => {
    if (selectedState) {
      async function loadLgas() {
        setIsLoadingLgas(true);
        try {
          const fetchedLgas = await getLgasForState(selectedState);
          setLgas(fetchedLgas);
        } catch (error) {
          console.error("Failed to load LGAs", error);
        } finally {
          setIsLoadingLgas(false);
        }
      }
      loadLgas();
    }
  }, [selectedState]);
  
  useEffect(() => {
    const lgaId = lgas.find(l => l.name === watchedLga)?.id;
    if (lgaId) {
        setSelectedLga(lgaId);
        setValue("city", "");
        setCities([]);
    }
  }, [watchedLga, lgas, setValue]);


  useEffect(() => {
    if (selectedState && selectedLga) {
      async function loadCities() {
        setIsLoadingCities(true);
        try {
          const fetchedCities = await getCitiesForLga(selectedState, selectedLga);
          setCities(fetchedCities);
        } catch (error) {
          console.error("Failed to load cities", error);
        } finally {
          setIsLoadingCities(false);
        }
      }
      loadCities();
    }
  }, [selectedState, selectedLga]);

  async function onSubmit(values: AddressFormValues) {
    if (!user) {
      setSubmissionStatus({ type: "error", message: "User not authenticated. Please log in."});
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    const result = await submitAddress({ 
        formData, 
        user: { id: user.id, name: user.name, email: user.email } 
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubmissionStatus({ type: "success", message: result.message || "Address submitted successfully!" });
      reset();
      setSelectedState("");
      setSelectedLga("");
      setLgas([]);
      setCities([]);
      if (onSubmissionSuccess) {
        setTimeout(() => { 
            onSubmissionSuccess();
        }, 2000); 
      }
    } else {
      setSubmissionStatus({ type: "error", message: result.message || "Submission failed. Please try again." });
      console.error("Submission Failed", result.message, result.errors);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submissionStatus && (
          <NextUICard 
            className={`mb-6 ${submissionStatus.type === 'success' ? 'bg-success-50 border-success-200' : submissionStatus.type === 'error' ? 'bg-danger-50 border-danger-200' : 'bg-secondary-50 border-secondary-200'}`} // Use secondary for info
          >
            <NextUICardBody className="p-4">
              <div className="flex items-center">
                {submissionStatus.type === 'success' && <CheckCircle className="h-5 w-5 text-success mr-3" />}
                {submissionStatus.type === 'error' && <AlertTriangle className="h-5 w-5 text-danger mr-3" />}
                {submissionStatus.type === 'info' && <Info className="h-5 w-5 text-secondary mr-3" />}
                <div>
                  <p className={`font-semibold ${submissionStatus.type === 'success' ? 'text-success-700' : submissionStatus.type === 'error' ? 'text-danger-700' : 'text-secondary-700'}`}>
                    {submissionStatus.type === 'success' ? 'Success' : submissionStatus.type === 'error' ? 'Error' : 'Info'}
                  </p>
                  <p className={`text-sm ${submissionStatus.type === 'success' ? 'text-success-600' : submissionStatus.type === 'error' ? 'text-danger-600' : 'text-secondary-600'}`}>
                    {submissionStatus.message}
                  </p>
                </div>
              </div>
            </NextUICardBody>
          </NextUICard>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="streetAddress"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="Street Address"
                placeholder="123 Main Street, XYZ Layout"
                variant="bordered"
                isInvalid={!!errors.streetAddress}
                errorMessage={errors.streetAddress?.message}
                className="md:col-span-2"
                fullWidth
              />
            )}
          />
           <Controller
            name="areaDistrict"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="District"
                placeholder="Ikeja GRA, Asokoro"
                variant="bordered"
                isInvalid={!!errors.areaDistrict}
                errorMessage={errors.areaDistrict?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
               <NextUISelect
                {...field}
                label="State"
                placeholder="Select a state"
                variant="bordered"
                isInvalid={!!errors.state}
                errorMessage={errors.state?.message}
                isLoading={isLoadingStates}
                selectedKeys={field.value ? [field.value] : []}
                onChange={field.onChange}
              >
                {states.map((state) => (
                  <NextUISelectItem key={state.name} value={state.name}>
                    {state.name}
                  </NextUISelectItem>
                ))}
              </NextUISelect>
            )}
          />
           <Controller
            name="lga"
            control={control}
            render={({ field }) => (
              <NextUISelect
                {...field}
                label="LGA (Local Government Area)"
                placeholder="Select an LGA"
                variant="bordered"
                isInvalid={!!errors.lga}
                errorMessage={errors.lga?.message}
                isLoading={isLoadingLgas}
                isDisabled={!watchedState || lgas.length === 0}
                selectedKeys={field.value ? [field.value] : []}
                onChange={field.onChange}
              >
                {lgas.map((lga) => (
                  <NextUISelectItem key={lga.name} value={lga.name}>
                    {lga.name}
                  </NextUISelectItem>
                ))}
              </NextUISelect>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <NextUISelect
                {...field}
                label="City"
                placeholder="Select a city"
                variant="bordered"
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message}
                isLoading={isLoadingCities}
                isDisabled={!watchedLga || cities.length === 0}
                selectedKeys={field.value ? [field.value] : []}
                onChange={field.onChange}
              >
                {cities.map((city) => (
                  <NextUISelectItem key={city.name} value={city.name}>
                    {city.name}
                  </NextUISelectItem>
                ))}
              </NextUISelect>
            )}
          />
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="Zip Code (Optional)"
                placeholder="100001"
                variant="bordered"
                isInvalid={!!errors.zipCode}
                errorMessage={errors.zipCode?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="Country"
                variant="bordered"
                isInvalid={!!errors.country}
                errorMessage={errors.country?.message}
                isDisabled 
                fullWidth
              />
            )}
          />
        </div>
        <NextUIButton 
          type="submit" 
          color="warning" 
          className="w-full md:w-auto text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" // text-primary for button text
          isLoading={isSubmitting} 
          disabled={isSubmitting || !user}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </NextUIButton>
      </form>
    </>
  );
}

