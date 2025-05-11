"use client"; 

import { useState, useEffect, useCallback } from "react";
import { AddressForm } from "@/components/forms/AddressForm";
import { AddressList } from "@/components/dashboard/AddressList";
import { getAddressSubmissions } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardBody as NextUICardBody } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

  const fetchSubmissions = useCallback(async () => {
    if (!user) { // Don't fetch if user is not yet available or logged out
      setIsLoading(false); // Ensure loading is false if no user
      if (!authLoading) { // Only set submissions to empty if auth is done loading and there's no user
        setSubmissions([]);
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAddressSubmissions(user.id); 
      setSubmissions(data);
    } catch (err) {
      setError("Failed to load address submissions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]); // Add user and authLoading to dependency array

  useEffect(() => {
    if (!authLoading) { // Fetch submissions only after auth state is resolved
      fetchSubmissions();
    }
  }, [fetchSubmissions, authLoading]); // Add authLoading to dependency array

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-foreground-500">Manage your addresses and API keys.</p>
      </div>

      <AddressForm onSubmissionSuccess={fetchSubmissions} />

      {(isLoading || authLoading) && ( // Show skeleton if either data is loading or auth is loading
        <div className="space-y-4 mt-8">
          <NextUISkeleton className="h-12 w-1/3 rounded-lg" />
          <NextUISkeleton className="h-32 w-full rounded-lg" />
          <NextUISkeleton className="h-32 w-full rounded-lg" />
        </div>
      )}

      {error && !isLoading && ( // Only show error if not loading
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

      {!isLoading && !authLoading && !error && <AddressList addresses={submissions} />}
    </div>
  );
}
