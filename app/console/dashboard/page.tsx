
"use client";

import { useState, useEffect, useCallback } from "react";
import { FlaggedAddressTable } from "@/components/console/FlaggedAddressTable";
import { getFlaggedAddresses } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react"; 

export default function ConsoleDashboardPage() { 
  const [flaggedSubmissions, setFlaggedSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlaggedSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFlaggedAddresses();
      setFlaggedSubmissions(data);
    } catch (err) {
      setError("Failed to load flagged address submissions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlaggedSubmissions();
  }, [fetchFlaggedSubmissions]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Address Review Queue</h1>
          <p className="text-foreground-500">
            Review addresses flagged by the AI or requiring manual verification.
          </p>
        </div>
      </div>
      
      <NextUICard className="shadow-xl rounded-xl bg-background">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-xl font-semibold text-primary">Pending Reviews</h2>
            <p className="text-sm text-foreground-500">
              The following addresses require manual review. Approve or reject them based on verification.
            </p>
          </div>
        </NextUICardHeader>
        <NextUICardBody className="p-2 md:p-4">
          {isLoading && (
            <div className="space-y-4">
              <NextUISkeleton className="h-10 w-full rounded-lg bg-default-200" />
              <NextUISkeleton className="h-10 w-full rounded-lg bg-default-200" />
              <NextUISkeleton className="h-10 w-full rounded-lg bg-default-200" />
            </div>
          )}

          {error && (
            <NextUICard className="mt-4 bg-danger-50 border-danger-200 rounded-xl">
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

          {!isLoading && !error && (
            <FlaggedAddressTable 
              addresses={flaggedSubmissions} 
              onActionComplete={fetchFlaggedSubmissions} 
            />
          )}
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}
