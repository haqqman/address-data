
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput, Textarea as NextUITextarea, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { submitAddress } from "@/app/actions/addressActions";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    const result = await submitAddress(formData);
    setIsSubmitting(false);

    if (result.success) {
      console.log("Submission Successful", result.message);
      // toast removed
      reset();
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    } else {
      console.error("Submission Failed", result.message, result.errors);
      // toast removed
      // Server-side validation errors could be mapped to form errors if needed
      // For now, relying on client-side validation primarily.
    }
  }

  return (
    <NextUICard className="w-full shadow-lg rounded-xl">
      <NextUICardHeader className="flex flex-col px-6 pt-6 pb-2">
        <h2 className="text-xl font-semibold">Submit Your Address</h2>
        <p className="text-sm text-foreground-500">
          Enter your address details. Addresses are verified for accuracy.
          Submitted addresses will be reviewed.
        </p>
      </NextUICardHeader>
      <NextUICardBody className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <NextUIButton type="submit" color="warning" className="w-full md:w-auto text-white" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Address"}
          </NextUIButton>
        </form>
      </NextUICardBody>
    </NextUICard>
  );
}
