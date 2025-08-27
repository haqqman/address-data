
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AddressList } from "@/components/dashboard/AddressList";
import { getAddressSubmissions } from "@/app/actions/addressActions";
import type { AddressSubmission } from "@/types";
import { Skeleton, Card, CardBody, Button, Tabs, Tab } from "@nextui-org/react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

type FilterType = "my_contributions" | "all";

export default function AddressesPage() {
  const [submissions, setSubmissions] = useState<AddressSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>("my_contributions");

  const fetchSubmissions = useCallback(async () => {
    if (!user && activeFilter === "my_contributions") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Always fetch all submissions if the view is 'all', otherwise fetch for the user.
      const userIdToFetch = activeFilter === "my_contributions" ? user?.id : undefined;
      const data = await getAddressSubmissions(userIdToFetch);
      setSubmissions(data);
    } catch (err) {
      setError("Failed to load address submissions.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, activeFilter]);

  useEffect(() => {
    if (!authLoading) {
      fetchSubmissions();
    }
  }, [fetchSubmissions, authLoading]);

  const filteredSubmissions = useMemo(() => {
    if (activeFilter === "my_contributions") {
        return user ? submissions.filter(s => s.userId === user.id) : [];
    }
    return submissions;
  }, [submissions, activeFilter, user]);

  const listTitle = useMemo(() => {
    return activeFilter === 'my_contributions' ? "My Contributions" : "All Contributions";
  }, [activeFilter]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Address Contributions</h1>
          <p className="text-foreground-500">View and manage address submissions.</p>
        </div>
        <Button
          as={Link}
          href="/submit-address"
          color="warning"
          className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
          startContent={<PlusCircle className="h-4 w-4" />}
        >
          Submit New Address
        </Button>
      </div>

       <div className="w-full flex flex-col">
        <Tabs 
            aria-label="Address filter"
            selectedKey={activeFilter}
            onSelectionChange={(key) => setActiveFilter(key as FilterType)}
            color="secondary"
            variant="bordered"
            className="mb-4"
        >
            <Tab key="my_contributions" title="My Contributions" />
            <Tab key="all" title="All Contributions" />
        </Tabs>
      </div>

      {(isLoading || authLoading) && (
        <div className="space-y-4 mt-8">
          <Skeleton className="h-12 w-1/3 rounded-lg bg-default-200" />
          <Skeleton className="h-32 w-full rounded-lg bg-default-200" />
          <Skeleton className="h-32 w-full rounded-lg bg-default-200" />
        </div>
      )}

      {error && !isLoading && (
        <Card className="mt-8 bg-danger-50 border-danger-200 rounded-xl">
          <CardBody className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-danger mr-3" />
              <div>
                <p className="font-semibold text-danger-700">Error</p>
                <p className="text-sm text-danger-600">{error}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {!isLoading && !authLoading && !error && <AddressList title={listTitle} addresses={filteredSubmissions} />}
    </div>
  );
}
