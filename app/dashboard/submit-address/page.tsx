
"use client";

import { AddressForm } from "@/components/forms/AddressForm";
import { useRouter } from "next/navigation";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";

export default function SubmitAddressPage() {
  const router = useRouter();

  const handleSubmissionSuccess = () => {
    // Optionally, show a success message here before redirecting
    // For now, redirect to dashboard where the new submission will appear
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <NextUICard className="w-full shadow-lg rounded-xl">
        <NextUICardHeader className="flex flex-col px-6 pt-6 pb-2 items-start space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Submit New Address</h1>
          <p className="text-foreground-500">
            Fill in the details below to add a new address to your records.
          </p>
        </NextUICardHeader>
        <NextUICardBody className="p-6">
          <AddressForm onSubmissionSuccess={handleSubmissionSuccess} />
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}
