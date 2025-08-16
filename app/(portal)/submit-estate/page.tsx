
"use client";

import { EstateForm } from "@/components/forms/EstateForm";
import { useRouter } from "next/navigation";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";

export default function SubmitEstatePage() {
  const router = useRouter();

  const handleSubmissionSuccess = () => {
    // Redirect to the main estates page after a successful submission
    router.push("/estates"); 
  };

  return (
    <div className="space-y-8">
      <NextUICard className="w-full shadow-lg rounded-xl bg-background">
        <NextUICardHeader className="flex flex-col px-6 pt-6 pb-2 items-start space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Submit New Estate</h1>
          <p className="text-foreground-500">
            Fill in the details below to add a new estate. Submissions will be reviewed before approval.
          </p>
        </NextUICardHeader>
        <NextUICardBody className="p-6">
          <EstateForm onSubmissionSuccess={handleSubmissionSuccess} />
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}
