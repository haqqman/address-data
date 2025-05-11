"use client"; 

import { useState, useEffect, useCallback } from "react";
import { AddressForm } from "@/components/forms/AddressForm";
import { AddressList } from "@/components/dashboard/AddressList";
import { getAddressSubmissions } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardBody as NextUICardBody } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react"; // For error display

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAddressSubmissions("mockUserId"); 
      setSubmissions(data);
    } catch (err) {
      setError("Failed to load address submissions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-foreground-500">Manage your addresses and API keys.</p>
      </div>

      <AddressForm onSubmissionSuccess={fetchSubmissions} />

      {isLoading && (
        <div className="space-y-4 mt-8">
          <NextUISkeleton className="h-12 w-1/3 rounded-lg" />
          <NextUISkeleton className="h-32 w-full rounded-lg" />
          <NextUISkeleton className="h-32 w-full rounded-lg" />
        </div>
      )}

      {error && (
         <NextUICard className="mt-8 bg-danger-50 border-danger-200 rounded-xl">
           <NextUICardBody className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-danger mr-3" />
              <div>
                <p className="font-semibold text-danger-700">Error</p>
                <p className="text-sm text-danger-600">{error}</p>
              </div>
            </div>
           </NextUICardBody>
         </NextUICard>
      )}

      {!isLoading && !error && <AddressList addresses={submissions} />}
    </div>
  );
}