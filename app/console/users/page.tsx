
"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSubmissionsTable } from "@/components/console/UserSubmissionsTable";
import { getAddressSubmissions } from "@/app/actions/addressActions"; 
import type { AddressSubmission, User } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react"; 
import { useAuth } from "@/contexts/auth-context";

export default function ConsoleUserSubmissionsPage() { 
  const [allSubmissions, setAllSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();


  const fetchAllSubmissions = useCallback(async () => {
    const consoleRoles: Array<User['role']> = ['cto', 'administrator', 'manager'];
    if (!user || !consoleRoles.includes(user.role)) {
      setIsLoading(false);
       if (!authLoading) {
        setAllSubmissions([]);
        setError("Unauthorized access or user not loaded.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Passing a generic admin identifier. The `getAddressSubmissions` action
      // has logic to fetch all if it recognizes an admin-like ID.
      // The layout already protects this route for admins.
      const data = await getAddressSubmissions("mockConsoleId"); 
      setAllSubmissions(data);
    } catch (err) {
      setError("Failed to load user submissions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading) {
        fetchAllSubmissions();
    }
  }, [fetchAllSubmissions, authLoading]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">User Submissions</h1>
        <p className="text-foreground-500">
          View and manage all address submissions from users.
        </p>
      </div>

      <NextUICard className="shadow-xl rounded-xl bg-background">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-xl font-semibold text-primary">All Submissions</h2>
            <p className="text-sm text-foreground-500">
              A comprehensive list of all addresses submitted by users and their current status.
            </p>
          </div>
        </NextUICardHeader>
        <NextUICardBody className="p-2 md:p-4">
          {(isLoading || authLoading) && (
            <div className="space-y-4">
              <NextUISkeleton className="h-10 w-full rounded-lg bg-default-200" />
              <NextUISkeleton className="h-10 w-full rounded-lg bg-default-200" />
              <NextUISkeleton className="h-10 w-full rounded-lg bg-default-200" />
            </div>
          )}

          {error && !isLoading && (
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

          {!isLoading && !authLoading && !error && (
            <UserSubmissionsTable submissions={allSubmissions} />
          )}
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}
