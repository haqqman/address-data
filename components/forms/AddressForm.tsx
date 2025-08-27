
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardBody as NextUICardBody, Select as NextUISelect, SelectItem as NextUISelectItem } from "@nextui-org/react";
import { submitAddress } from "@/app/actions/addressActions";
import { CheckCircle, Loader2, AlertTriangle, Info } from "lucide-react"; 
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context"; 
import { getStates, getLgasForState, getCitiesForLga, getAbujaDistricts } from "@/app/actions/geographyActions";
import type { GeographyState, GeographyLGA, GeographyCity } from "@/types";

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  areaDistrict: z.string().optional(),
  city: z.string().min(1, "City is required"),
  lga: z.string().min(1, "LGA is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
}).refine(data => {
    if (data.city === 'Abuja') {
        return !!data.areaDistrict && data.areaDistrict.length > 0;
    }
    return true;
}, {
    message: "District is required for Abuja city.",
    path: ["areaDistrict"],
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
  const [districts, setDistricts] = useState<GeographyCity[]>([]); 

  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedLgaId, setSelectedLgaId] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch, trigger } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      areaDistrict: "",
      city: "",
      lga: "",
      state: "",
      zipCode: "",
    },
  });

  const watchedStateName = watch("state");
  const watchedLgaName = watch("lga");
  const watchedCityName = watch("city");

  const loadStates = useCallback(async () => {
    setIsLoadingStates(true);
    try {
      const fetchedStates = await getStates();
      setStates(fetchedStates);
    } catch (error) {
      console.error("Failed to load states", error);
    } finally {
      setIsLoadingStates(false);
    }
  }, []);

  useEffect(() => {
    loadStates();
  }, [loadStates]);
  
  const loadLgas = useCallback(async (stateId: string) => {
    setIsLoadingLgas(true);
    setLgas([]);
    setCities([]);
    try {
      const fetchedLgas = await getLgasForState(stateId);
      setLgas(fetchedLgas);
    } catch (error) {
      console.error("Failed to load LGAs", error);
    } finally {
      setIsLoadingLgas(false);
    }
  }, []);

  const loadCities = useCallback(async (stateId: string, lgaId: string) => {
    setIsLoadingCities(true);
    setCities([]);
    try {
      const fetchedCities = await getCitiesForLga(stateId, lgaId);
      setCities(fetchedCities);
    } catch (error) {
      console.error("Failed to load cities", error);
    } finally {
      setIsLoadingCities(false);
    }
  }, []);
  
  const loadDistricts = useCallback(async () => {
    setIsLoadingDistricts(true);
    setDistricts([]);
    try {
        const fetchedDistricts = await getAbujaDistricts();
        setDistricts(fetchedDistricts);
    } catch(e) {
        console.error("Failed to load FCT Districts", e);
    } finally {
        setIsLoadingDistricts(false);
    }
  }, []);

  const handleStateChange = (selectedName: string) => {
    setValue("state", selectedName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: true });
    setValue("city", "", { shouldValidate: true });
    setValue("areaDistrict", "", { shouldValidate: true });
    
    const state = states.find(s => s.name === selectedName);
    if (state) {
      setSelectedStateId(state.id);
      loadLgas(state.id);
      if (state.name === 'FCT') {
        loadDistricts();
        setValue("city", "Abuja", { shouldValidate: true });
        setCities([]); // No other cities to choose from
      } else {
        setDistricts([]);
      }
    } else {
      setSelectedStateId(null);
      setLgas([]);
      setCities([]);
      setDistricts([]);
    }
    setSelectedLgaId(null);
  };
  
  const handleLgaChange = (selectedName: string) => {
    setValue("lga", selectedName, { shouldValidate: true });
    setValue("city", "", { shouldValidate: true });
    setValue("areaDistrict", "", { shouldValidate: true });

    const lga = lgas.find(l => l.name === selectedName);
    if (lga && selectedStateId) {
      setSelectedLgaId(lga.id);
      if (watchedStateName === 'FCT') {
         setValue("city", "Abuja", { shouldValidate: true });
         setCities([]);
      } else {
        loadCities(selectedStateId, lga.id);
      }
    } else {
      setSelectedLgaId(null);
      setCities([]);
    }
  };

  const handleCityChange = (selectedName: string) => {
    setValue("city", selectedName, { shouldValidate: true });
    setValue("areaDistrict", "", { shouldValidate: false });
  };
  
  const handleDistrictChange = (selectedName: string) => {
    setValue("areaDistrict", selectedName, { shouldValidate: true });
  };

  async function onSubmit(values: AddressFormValues) {
    const isValid = await trigger();
    if (!isValid) {
      setSubmissionStatus({ type: "error", message: "Please fill out all required fields."});
      return;
    }
    
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
     formData.append("country", "Nigeria");

    const result = await submitAddress({ 
        formData, 
        user: { id: user.id, displayName: user.displayName, email: user.email } 
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubmissionStatus({ type: "success", message: result.message || "Address submitted successfully!" });
      reset();
      setSelectedStateId(null);
      setSelectedLgaId(null);
      setLgas([]);
      setCities([]);
      setDistricts([]);
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
            className={`mb-6 ${submissionStatus.type === 'success' ? 'bg-success-50 border-success-200' : submissionStatus.type === 'error' ? 'bg-danger-50 border-danger-200' : 'bg-secondary-50 border-secondary-200'}`}
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
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <NextUIInput
              {...field}
              label="Street"
              placeholder="123 Main Street"
              variant="bordered"
              isInvalid={!!errors.street}
              errorMessage={errors.street?.message}
              fullWidth
            />
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NextUISelect
            label="State"
            placeholder="Select a state"
            variant="bordered"
            isInvalid={!!errors.state}
            errorMessage={errors.state?.message}
            isLoading={isLoadingStates}
            selectedKeys={watchedStateName ? [watchedStateName] : []}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            {states.map((state) => (
              <NextUISelectItem key={state.name} value={state.name}>
                {state.name}
              </NextUISelectItem>
            ))}
          </NextUISelect>
          <NextUISelect
            label="LGA (Local Government Area)"
            placeholder="Select an LGA"
            variant="bordered"
            isInvalid={!!errors.lga}
            errorMessage={errors.lga?.message}
            isLoading={isLoadingLgas}
            isDisabled={!watchedStateName || lgas.length === 0}
            selectedKeys={watchedLgaName ? [watchedLgaName] : []}
            onChange={(e) => handleLgaChange(e.target.value)}
          >
            {lgas.map((lga) => (
              <NextUISelectItem key={lga.name} value={lga.name}>
                {lga.name}
              </NextUISelectItem>
            ))}
          </NextUISelect>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {watchedStateName === 'FCT' ? (
              <NextUIInput
                label="City"
                value="Abuja"
                isReadOnly
                variant="bordered"
              />
            ) : (
              <Controller
                name="city"
                control={control}
                render={({field}) => (
                  <NextUISelect
                    {...field}
                    label="City"
                    placeholder="Select a city"
                    variant="bordered"
                    isInvalid={!!errors.city}
                    errorMessage={errors.city?.message}
                    isLoading={isLoadingCities}
                    isDisabled={!watchedLgaName || cities.length === 0}
                    selectedKeys={field.value ? [field.value] : []}
                    onChange={(e) => handleCityChange(e.target.value)}
                  >
                    {cities.map((city) => (
                      <NextUISelectItem key={city.name} value={city.name}>
                        {city.name}
                      </NextUISelectItem>
                    ))}
                  </NextUISelect>
                )}
              />
           )}
           <Controller
            name="areaDistrict"
            control={control}
            render={({field}) => (
              <NextUISelect
                {...field}
                label="District"
                placeholder="Available for Abuja City Only"
                variant="bordered"
                isInvalid={!!errors.areaDistrict}
                errorMessage={errors.areaDistrict?.message}
                isLoading={isLoadingDistricts}
                isDisabled={watchedCityName !== 'Abuja' || districts.length === 0}
                selectedKeys={field.value ? [field.value] : []}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                {districts.map((district) => (
                    <NextUISelectItem key={district.name} value={district.name}>
                        {district.name}
                    </NextUISelectItem>
                ))}
              </NextUISelect>
            )}
           />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
                )}
            />
        </div>
        <NextUIButton 
          type="submit" 
          color="warning" 
          className="w-full md:w-auto text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
          isLoading={isSubmitting} 
          disabled={isSubmitting || !user}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </NextUIButton>
      </form>
    </>
  );
}
