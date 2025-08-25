
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardBody as NextUICardBody, Select as NextUISelect, SelectItem as NextUISelectItem } from "@nextui-org/react";
import { submitEstate } from "@/app/actions/estateActions";
import { CheckCircle, AlertTriangle, Info } from "lucide-react"; 
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context"; 
import { getStates, getLgasForState } from "@/app/actions/geographyActions";
import type { GeographyState, GeographyLGA } from "@/types";

const estateSchema = z.object({
  name: z.string().min(3, "Estate name must be at least 3 characters long."),
  state: z.string().min(1, "State is required."),
  lga: z.string().min(1, "LGA is required."),
  area: z.string().optional(),
  googleMapLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
}).refine(data => {
    // If state is FCT, area (used as district) is required
    if (data.state === 'FCT') {
        return !!data.area && data.area.length > 0;
    }
    return true;
}, {
    message: "District is required for Abuja (FCT).",
    path: ["area"], 
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
  const [districts, setDistricts] = useState<GeographyLGA[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch, trigger } = useForm<EstateFormValues>({
    resolver: zodResolver(estateSchema),
    defaultValues: {
      name: "",
      state: "",
      lga: "",
      area: "",
      googleMapLink: "",
    },
  });

  const watchedStateName = watch("state");

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
  
  const loadLgasForState = useCallback(async (stateId: string) => {
    setIsLoadingLgas(true);
    setLgas([]);
    try {
      const fetchedLgas = await getLgasForState(stateId);
      setLgas(fetchedLgas);
    } catch (error) {
      console.error("Failed to load LGAs", error);
    } finally {
      setIsLoadingLgas(false);
    }
  }, []);

  const loadDistrictsForFCT = useCallback(async () => {
    const fctState = states.find(s => s.name === 'FCT');
    if (!fctState) return;
    setIsLoadingDistricts(true);
    setDistricts([]);
    try {
        const fetchedDistricts = await getLgasForState(fctState.id);
        setDistricts(fetchedDistricts);
    } catch(e) {
        console.error("Failed to load FCT Districts", e);
    } finally {
        setIsLoadingDistricts(false);
    }
  }, [states]);
  
  const handleStateChange = (selectedName: string) => {
    setValue("state", selectedName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: true });
    setValue("area", "", { shouldValidate: true });
    
    const state = states.find(s => s.name === selectedName);
    if (state) {
      setSelectedStateId(state.id);
      loadLgasForState(state.id);
      if (state.name === 'FCT') {
        loadDistrictsForFCT();
        setValue("lga", "Abuja"); // Set City/LGA to Abuja for FCT
      } else {
        setDistricts([]);
      }
    } else {
      setSelectedStateId(null);
      setLgas([]);
      setDistricts([]);
    }
  };

  async function onSubmit(values: EstateFormValues) {
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
      setSelectedStateId(null);
      setLgas([]);
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
          
            {watchedStateName === 'FCT' ? (
                <Controller
                    name="lga"
                    control={control}
                    render={({ field }) => (
                        <NextUIInput
                            {...field}
                            label="City"
                            value="Abuja"
                            isReadOnly
                            variant="bordered"
                        />
                    )}
                />
            ) : (
                <NextUISelect
                    label="LGA (Local Government Area)"
                    placeholder="Select an LGA"
                    variant="bordered"
                    isInvalid={!!errors.lga}
                    errorMessage={errors.lga?.message}
                    isLoading={isLoadingLgas}
                    isDisabled={!watchedStateName || lgas.length === 0}
                    selectedKeys={watch("lga") ? [watch("lga")] : []}
                    onChange={(e) => setValue("lga", e.target.value, { shouldValidate: true })}
                >
                    {lgas.map((lga) => (
                    <NextUISelectItem key={lga.name} value={lga.name}>
                        {lga.name}
                    </NextUISelectItem>
                    ))}
                </NextUISelect>
            )}
        </div>

        <Controller
            name="area"
            control={control}
            render={({ field }) => (
                watchedStateName === 'FCT' ? (
                    <NextUISelect
                        {...field}
                        label="District"
                        placeholder="Select a district in Abuja"
                        variant="bordered"
                        isInvalid={!!errors.area}
                        errorMessage={errors.area?.message}
                        isLoading={isLoadingDistricts}
                        selectedKeys={field.value ? [field.value] : []}
                        onChange={(e) => field.onChange(e.target.value)}
                    >
                        {districts.map((district) => (
                            <NextUISelectItem key={district.name} value={district.name}>
                                {district.name}
                            </NextUISelectItem>
                        ))}
                    </NextUISelect>
                ) : (
                    <NextUIInput
                        {...field}
                        label="Area / District / Neighborhood (Optional)"
                        placeholder="e.g. Ikoyi, Maitama, GRA"
                        variant="bordered"
                        isInvalid={!!errors.area}
                        errorMessage={errors.area?.message}
                        fullWidth
                    />
                )
            )}
        />

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
