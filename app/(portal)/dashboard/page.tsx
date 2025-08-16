
"use client"; 

import { useState, useEffect, useCallback } from "react";
import { AddressList } from "@/components/dashboard/AddressList";
import { getAddressSubmissions } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardBody as NextUICardBody, Button as NextUIButton } from "@nextui-org/react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context"; 
import Link from "next/link";

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth(); 

  const fetchSubmissions = useCallback(async () => {
    if (!user) { 
      setIsLoading(false); 
      if (!authLoading) { 
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
  }, [user, authLoading]); 

  useEffect(() => {
    if (!authLoading) { 
      fetchSubmissions();
    }
  }, [fetchSubmissions, authLoading]); 

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-foreground-500">Manage your addresses and API keys.</p>
        </div>
        <NextUIButton 
          as={Link} 
          href="/submit-address" 
          color="warning" 
          className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" // text-primary for button text on warning
          startContent={<PlusCircle className="h-4 w-4" />}
        >
          Submit New Address
        </NextUIButton>
      </div>

      {(isLoading || authLoading) && ( 
        <div className="space-y-4 mt-8">
          <NextUISkeleton className="h-12 w-1/3 rounded-lg bg-default-200" />
          <NextUISkeleton className="h-32 w-full rounded-lg bg-default-200" />
          <NextUISkeleton className="h-32 w-full rounded-lg bg-default-200" />
        </div>
      )}

      {error && !isLoading && ( 
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
