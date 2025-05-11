
"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSubmissionsTable } from "@/components/admin/UserSubmissionsTable";
import { getAddressSubmissions } from "@/app/actions/addressActions"; // Using existing action, might need specific admin version
import type { AddressSubmission } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConsoleUserSubmissionsPage() { // Renamed from AdminUserSubmissionsPage
  const [allSubmissions, setAllSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass a special ID or parameter to fetch all submissions
      // For mock, "mockAdminId" will fetch all as per current mock logic
      const data = await getAddressSubmissions("mockAdminId"); 
      setAllSubmissions(data);
    } catch (err) {
      setError("Failed to load user submissions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Submissions</h1>
        <p className="text-muted-foreground">
          View and manage all address submissions from users.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            A comprehensive list of all addresses submitted by users and their current status.
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
            <UserSubmissionsTable submissions={allSubmissions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
