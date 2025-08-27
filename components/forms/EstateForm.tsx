
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardBody as NextUICardBody, Select as NextUISelect, SelectItem as NextUISelectItem } from "@nextui-org/react";
import { submitEstate } from "@/app/actions/estateActions";
import { CheckCircle, AlertTriangle, Info } from "lucide-react"; 
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context"; 
import { getStates, getLgasForState, getCitiesForLga } from "@/app/actions/geographyActions";
import type { GeographyState, GeographyLGA, GeographyCity } from "@/types";

const estateSchema = z.object({
  name: z.string().min(3, "Estate name must be at least 3 characters long."),
  state: z.string().min(1, "State is required."),
  lga: z.string().min(1, "LGA is required."),
  city: z.string().optional(),
  district: z.string().optional(),
  googleMapLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
}).refine(data => {
    if (data.state === 'FCT') {
        return !!data.district && data.district.length > 0;
    }
    return !!data.city && data.city.length > 0;
}, {
    message: "City or District is required based on the selected State.",
    path: ["city"], 
});


type EstateFormValues = z.infer<typeof estateSchema>;

interface EstateFormProps {
  onSubmissionSuccess?: () => void;
}

export function EstateForm({ onSubmissionSuccess }: EstateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const { user } = useAuth(); 
  
  const [states, setStates] = useState<GeographyState[]>([]);
  const [lgas, setLgas] = useState<GeographyLGA[]>([]);
  const [cities, setCities] = useState<GeographyCity[]>([]); // Also holds districts

  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false); // Used for cities/districts

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch, trigger } = useForm<EstateFormValues>({
    resolver: zodResolver(estateSchema),
    defaultValues: {
      name: "",
      state: "",
      lga: "",
      city: "",
      district: "",
      googleMapLink: "",
    },
  });

  const watchedStateName = watch("state");
  const watchedLgaName = watch("lga");

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

  const loadCitiesOrDistricts = useCallback(async (stateId: string, lgaId: string) => {
    setIsLoadingCities(true);
    setCities([]);
    try {
      const fetchedCities = await getCitiesForLga(stateId, lgaId);
      setCities(fetchedCities);
    } catch (error) {
      console.error("Failed to load cities/districts", error);
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  const handleStateChange = (selectedName: string) => {
    setValue("state", selectedName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: false });
    setValue("city", "", { shouldValidate: false });
    setValue("district", "", { shouldValidate: false });
    setLgas([]);
    setCities([]);

    const state = states.find(s => s.name === selectedName);
    if (state) {
      loadLgas(state.id);
    }
  };
  
  const handleLgaChange = (selectedName: string) => {
    setValue("lga", selectedName, { shouldValidate: true });
    setValue("city", "", { shouldValidate: false });
    setValue("district", "", { shouldValidate: false });
    setCities([]);

    const selectedState = states.find(s => s.name === watchedStateName);
    const selectedLga = lgas.find(l => l.name === selectedName);

    if (selectedState && selectedLga) {
       loadCitiesOrDistricts(selectedState.id, selectedLga.id);
    }
  };


  async function onSubmit(values: EstateFormValues) {
    const isValid = await trigger();
    if(!isValid) {
        setSubmissionStatus({ type: "error", message: "Please fill out all required fields correctly." });
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
    
    const result = await submitEstate({ 
        formData, 
        user: { id: user.id, displayName: user.displayName, email: user.email } 
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubmissionStatus({ type: "success", message: result.message || "Estate submitted successfully for review!" });
      reset();
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
            className={`mb-6 ${submissionStatus.type === 'success' ? 'bg-success-50 border-success-200' : submissionStatus.type === 'error' ? 'bg-danger-50 border-danger-200' : 'bg-secondary-50 border-secondary-200'}`}
          >
            <NextUICardBody className="p-4">
              <div className="flex items-center">
                {submissionStatus.type === 'success' && <CheckCircle className="h-5 w-5 text-success mr-3" />}
                {submissionStatus.type === 'error' && <AlertTriangle className="h-5 w-5 text-danger mr-3" />}
                {submissionStatus.type === 'info' && <Info className="h-5 w-5 text-secondary mr-3" />}
                <div>
                  <p className={`font-semibold ${submissionStatus.type === 'success' ? 'text-success-700' : 'text-danger-700'}`}>
                    {submissionStatus.type === 'success' ? 'Success' : 'Error'}
                  </p>
                  <p className={`text-sm ${submissionStatus.type === 'success' ? 'text-success-600' : 'text-danger-600'}`}>
                    {submissionStatus.message}
                  </p>
                </div>
              </div>
            </NextUICardBody>
          </NextUICard>
        )}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <NextUIInput
              {...field}
              label="Estate Name"
              placeholder="Banana Island Estate"
              variant="bordered"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
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
                label={"LGA (Local Government Area)"}
                placeholder={"Select an LGA"}
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

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {watchedStateName === 'FCT' ? (
                 <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                         <NextUISelect
                            {...field}
                            label="District"
                            placeholder="Select a district"
                            variant="bordered"
                            isInvalid={!!errors.district || !!errors.city}
                            errorMessage={errors.district?.message || errors.city?.message}
                            isLoading={isLoadingCities}
                            isDisabled={!watchedLgaName || cities.length === 0}
                            selectedKeys={field.value ? [field.value] : []}
                            onChange={(e) => field.onChange(e.target.value)}
                        >
                            {cities.map((district) => (
                                <NextUISelectItem key={district.name} value={district.name}>
                                    {district.name}
                                </NextUISelectItem>
                            ))}
                        </NextUISelect>
                    )}
                />
            ) : (
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <NextUISelect
                            {...field}
                            label="City / Town"
                            placeholder="Select a city or town"
                            variant="bordered"
                            isInvalid={!!errors.city || !!errors.district}
                            errorMessage={errors.city?.message || errors.district?.message}
                            isLoading={isLoadingCities}
                            isDisabled={!watchedLgaName || cities.length === 0}
                            selectedKeys={field.value ? [field.value] : []}
                            onChange={(e) => field.onChange(e.target.value)}
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
        </div>


        <Controller
          name="googleMapLink"
          control={control}
          render={({ field }) => (
            <NextUIInput
              {...field}
              label="Google Maps Link (Optional)"
              placeholder="https://maps.app.goo.gl/..."
              variant="bordered"
              isInvalid={!!errors.googleMapLink}
              errorMessage={errors.googleMapLink?.message}
              fullWidth
            />
          )}
        />
        <NextUIButton 
          type="submit" 
          color="warning" 
          className="w-full md:w-auto text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
          isLoading={isSubmitting} 
          disabled={isSubmitting || !user}
        >
          {isSubmitting ? "Submitting for Review..." : "Submit Estate"}
        </NextUIButton>
      </form>
    </>
  );
}
