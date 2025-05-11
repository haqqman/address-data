
"use client";

import { useState, useEffect, useCallback } from "react";
import { FlaggedAddressTable } from "@/components/admin/FlaggedAddressTable";
import { getFlaggedAddresses } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton } from "@nextui-org/react";
import { AlertTriangle, DatabaseZap } from "lucide-react"; // For error display & seed button
import { seedGeographyData } from "@/app/actions/seedActions"; // Import the seed action

export default function ConsoleDashboardPage() { 
  const [flaggedSubmissions, setFlaggedSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

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

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const result = await seedGeographyData();
      setSeedMessage(result.message);
      if (!result.success) {
        console.error("Seeding failed:", result.message);
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred during seeding.";
      setSeedMessage(`Error: ${errorMsg}`);
      console.error("Seeding error:", e);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Address Review Queue</h1>
          <p className="text-foreground-500">
            Review addresses flagged by the AI or requiring manual verification.
          </p>
        </div>
        {/* Temporary Seed Button - Remove after successful seeding */}
        <NextUIButton 
          color="secondary" 
          onPress={handleSeedData} 
          isLoading={isSeeding}
          disabled={isSeeding}
          startContent={<DatabaseZap className="h-4 w-4" />}
        >
          {isSeeding ? "Seeding Geography Data..." : "Seed Geography Data"}
        </NextUIButton>
      </div>
      
      {seedMessage && (
        <NextUICard className={`mt-4 ${seedMessage.startsWith("Error:") ? "bg-danger-50" : "bg-success-50"}`}>
          <NextUICardBody>
            <p className={`${seedMessage.startsWith("Error:") ? "text-danger-700" : "text-success-700"}`}>{seedMessage}</p>
          </NextUICardBody>
        </NextUICard>
      )}


      <NextUICard className="shadow-xl rounded-xl">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-semibold">Pending Reviews</h2>
          <p className="text-sm text-foreground-500">
            The following addresses require manual review. Approve or reject them based on verification.
          </p>
        </NextUICardHeader>
        <NextUICardBody className="p-2 md:p-4">
          {isLoading && (
            <div className="space-y-4">
              <NextUISkeleton className="h-10 w-full rounded-lg" />
              <NextUISkeleton className="h-10 w-full rounded-lg" />
              <NextUISkeleton className="h-10 w-full rounded-lg" />
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
