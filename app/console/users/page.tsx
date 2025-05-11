"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSubmissionsTable } from "@/components/admin/UserSubmissionsTable";
import { getAddressSubmissions } from "@/app/actions/addressActions"; 
import type { AddressSubmission } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react"; 

export default function ConsoleUserSubmissionsPage() { 
  const [allSubmissions, setAllSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
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
        <p className="text-foreground-500">
          View and manage all address submissions from users.
        </p>
      </div>

      <NextUICard className="shadow-xl rounded-xl">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-semibold">All Submissions</h2>
          <p className="text-sm text-foreground-500">
            A comprehensive list of all addresses submitted by users and their current status.
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
            <UserSubmissionsTable submissions={allSubmissions} />
          )}
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}