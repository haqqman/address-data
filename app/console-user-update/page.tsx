// app/console-user-update/page.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button as NextUIButton,
  Input as NextUIInput,
  Card as NextUICard,
  CardHeader as NextUICardHeader,
  CardBody as NextUICardBody,
  Select as NextUISelect,
  SelectItem as NextUISelectItem,
  Spinner,
} from "@nextui-org/react";
import { updateConsoleUserDetails, type ConsoleUserUpdateFormValues } from "@/app/actions/userActions";
import { z } from "zod";
import { User, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { User as UserType } from "@/types";

// Updated schema to reflect new form fields
const consoleUserUpdateSchemaClient = z.object({
  uid: z.string().min(1, "UID is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
});

const roleOptions: { label: string; value: UserType['role'] }[] = [
  { label: "CTO", value: "cto" },
  { label: "Administrator", value: "administrator" },
  { label: "Manager", value: "manager" },
];

export default function ConsoleUserUpdatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsoleUserUpdateFormValues>({ // Still using ConsoleUserUpdateFormValues from action for consistency
    resolver: zodResolver(consoleUserUpdateSchemaClient), // Use client-side schema for form validation
    defaultValues: {
      uid: "",
      phoneNumber: "",
      role: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof consoleUserUpdateSchemaClient>) {
    setIsLoading(true);
    setFormMessage(null);
    // The server action now expects `uid` directly.
    const result = await updateConsoleUserDetails(values);
    setFormMessage(result);
    setIsLoading(false);
    if (result.success) {
      reset();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary/5 p-4">
       <Link href="/" className="flex items-center space-x-2 mb-8">
          <Image 
            src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.svg" 
            alt="Address Data Logomark" 
            width={32} 
            height={32}
            className="text-primary"
          />
          <span className="font-bold text-2xl text-primary">Address Data</span>
        </Link>
      <NextUICard className="w-full max-w-lg shadow-xl p-2 md:p-4 rounded-xl bg-background">
        <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2">
          <div className="flex justify-center mb-2">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Update Console User Details</h1>
          <p className="text-muted-foreground mt-1 text-warning-600">
            <ShieldAlert className="inline h-4 w-4 mr-1" />
            This is a temporary page for administrative purposes. Enter the Firestore UID of the user.
          </p>
        </NextUICardHeader>
        <NextUICardBody className="pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formMessage && (
              <NextUICard
                className={`mb-4 ${formMessage.type === "success" ? "bg-success-50 border-success-200" : "bg-danger-50 border-danger-200"}`}
              >
                <NextUICardBody className="p-3">
                  <div className="flex items-center">
                    {formMessage.type === "success" ? (
                      <CheckCircle className="h-5 w-5 text-success-700 mr-2" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-danger-700 mr-2" />
                    )}
                    <p className={`text-sm font-medium ${formMessage.type === "success" ? "text-success-700" : "text-danger-700"}`}>
                      {formMessage.message}
                    </p>
                  </div>
                </NextUICardBody>
              </NextUICard>
            )}

            <Controller
              name="uid"
              control={control}
              render={({ field }) => (
                <NextUIInput
                  {...field}
                  label="User UID (From Firestore)"
                  placeholder="Enter user's Firestore UID"
                  variant="bordered"
                  isInvalid={!!errors.uid}
                  errorMessage={errors.uid?.message}
                />
              )}
            />
            
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <NextUIInput
                  {...field}
                  label="Phone Number"
                  placeholder="Enter phone number"
                  variant="bordered"
                  isInvalid={!!errors.phoneNumber}
                  errorMessage={errors.phoneNumber?.message}
                />
              )}
            />
             <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <NextUISelect
                  {...field}
                  label="Role"
                  placeholder="Select user role"
                  variant="bordered"
                  isInvalid={!!errors.role}
                  errorMessage={errors.role?.message}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as UserType['role'])}
                >
                  {roleOptions.map((roleOpt) => (
                    <NextUISelectItem key={roleOpt.value} value={roleOpt.value}>
                      {roleOpt.label}
                    </NextUISelectItem>
                  ))}
                </NextUISelect>
              )}
            />
            <NextUIButton
              type="submit"
              color="warning"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
            >
              {isLoading ? <Spinner size="sm" color="current" /> : "Update User Details"}
            </NextUIButton>
          </form>
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}