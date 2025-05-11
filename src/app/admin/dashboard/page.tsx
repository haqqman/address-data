
"use client";

import { useState, useEffect, useCallback } from "react";
import { FlaggedAddressTable } from "@/components/admin/FlaggedAddressTable";
import { getFlaggedAddresses } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Address Review Queue</h1>
        <p className="text-muted-foreground">
          Review addresses flagged by the AI or requiring manual verification.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            The following addresses require manual review. Approve or reject them based on verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <FlaggedAddressTable 
              addresses={flaggedSubmissions} 
              onActionComplete={fetchFlaggedSubmissions} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
