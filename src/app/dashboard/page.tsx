
"use client"; // Required for useState, useEffect

import { useState, useEffect, useCallback } from "react";
import { AddressForm } from "@/components/forms/AddressForm";
import { AddressList } from "@/components/dashboard/AddressList";
import { getAddressSubmissions } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming "mockUserId" for the current logged-in user
      // In a real app, you'd get this from an auth context
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
        <p className="text-muted-foreground">Manage your addresses and API keys.</p>
      </div>

      <AddressForm onSubmissionSuccess={fetchSubmissions} />

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {error && (
         <Alert variant="destructive">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!isLoading && !error && <AddressList addresses={submissions} />}
    </div>
  );
}
