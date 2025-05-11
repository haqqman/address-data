
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { submitAddress } from "@/app/actions/addressActions";
import { CheckCircle, Loader2, AlertTriangle, Info } from "lucide-react"; // Added Info icon
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context"; 

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  areaDistrict: z.string().min(1, "Area/District is required"),
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

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AddressFormValues>({
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
      if (onSubmissionSuccess) {
        setTimeout(() => { // Add a small delay so user can see the message
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
            className={`mb-6 ${submissionStatus.type === 'success' ? 'bg-success-50 border-success-200' : submissionStatus.type === 'error' ? 'bg-danger-50 border-danger-200' : 'bg-primary-50 border-primary-200'}`}
          >
            <NextUICardBody className="p-4">
              <div className="flex items-center">
                {submissionStatus.type === 'success' && <CheckCircle className="h-5 w-5 text-success mr-3" />}
                {submissionStatus.type === 'error' && <AlertTriangle className="h-5 w-5 text-danger mr-3" />}
                {submissionStatus.type === 'info' && <Info className="h-5 w-5 text-primary mr-3" />}
                <div>
                  <p className={`font-semibold ${submissionStatus.type === 'success' ? 'text-success-700' : submissionStatus.type === 'error' ? 'text-danger-700' : 'text-primary-700'}`}>
                    {submissionStatus.type === 'success' ? 'Success' : submissionStatus.type === 'error' ? 'Error' : 'Info'}
                  </p>
                  <p className={`text-sm ${submissionStatus.type === 'success' ? 'text-success-600' : submissionStatus.type === 'error' ? 'text-danger-600' : 'text-primary-600'}`}>
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
                placeholder="e.g., 123 Main Street, XYZ Layout"
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
                label="Area / District"
                placeholder="e.g., Ikeja GRA, Asokoro"
                variant="bordered"
                isInvalid={!!errors.areaDistrict}
                errorMessage={errors.areaDistrict?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="City / Town"
                placeholder="e.g., Lagos, Abuja"
                variant="bordered"
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message}
                fullWidth
              />
            )}
          />
           <Controller
            name="lga"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="LGA (Local Government Area)"
                placeholder="e.g., Ikeja, Abuja Municipal"
                variant="bordered"
                isInvalid={!!errors.lga}
                errorMessage={errors.lga?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="State"
                placeholder="e.g., Lagos, FCT"
                variant="bordered"
                isInvalid={!!errors.state}
                errorMessage={errors.state?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <NextUIInput
                {...field}
                label="Zip Code (Optional)"
                placeholder="e.g., 100001"
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
                isDisabled // Country is fixed to Nigeria
                fullWidth
              />
            )}
          />
        </div>
        <NextUIButton type="submit" color="warning" className="w-full md:w-auto text-white" isLoading={isSubmitting} disabled={isSubmitting || !user}>
          {isSubmitting ? "Submitting..." : "Submit Address"}
        </NextUIButton>
      </form>
    </>
  );
}
