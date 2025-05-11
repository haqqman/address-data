
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitAddress } from "@/app/actions/addressActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetAddress: "",
      areaDistrict: "",
      city: "",
      lga: "",
      state: "",
      zipCode: "",
      country: "Nigeria", // Default to Nigeria
    },
  });

  async function onSubmit(values: AddressFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    const result = await submitAddress(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Submission Successful",
        description: result.message,
      });
      form.reset();
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    } else {
      toast({
        title: "Submission Failed",
        description: result.message || "An error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        // Set form errors if any from server-side validation
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            form.setError(field as keyof AddressFormValues, {
              type: "server",
              message: messages.join(", "),
            });
          }
        });
      }
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Submit Your Address</CardTitle>
        <CardDescription>
          Enter your address details. Addresses are verified for accuracy.
          Submitted addresses will be reviewed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main Street, XYZ Layout" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area / District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ikeja GRA, Asokoro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City / Town</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos, Abuja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LGA (Local Government Area)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ikeja, Abuja Municipal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos, FCT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 100001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Address
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
