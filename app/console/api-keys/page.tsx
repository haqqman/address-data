"use client"; 

import { useState, useEffect, useCallback } from "react";
import { ApiKeyManagementTable } from "@/components/admin/ApiKeyManagementTable";
import type { APIKey } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton } from "@nextui-org/react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, Timestamp, query, orderBy } from "firebase/firestore";

// Helper function to convert Firestore Timestamps to Date objects for APIKey
const convertApiKeyTimestamps = (docData: any): any => {
  const data = { ...docData };
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    }
  }
  return data;
};

async function listAllApiKeys(): Promise<(APIKey & { userName?: string, userEmail?: string })[]> {
  // In a real app, userName and userEmail might be populated by joining with a users collection
  // For this seeding, we'll assume they are part of the apiKey document or leave them as optional
  try {
    const apiKeysCol = collection(db, "apiKeys"); // Collection name as per blueprint "developerApiKeys" or simplify to "apiKeys"
    // Consider ordering if needed, e.g., by createdAt
    const q = query(apiKeysCol, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const keys: (APIKey & { userName?: string, userEmail?: string })[] = [];
    querySnapshot.forEach((doc) => {
      // Assuming userName and userEmail might be directly on the document for simplicity of seeding
      keys.push({ id: doc.id, ...convertApiKeyTimestamps(doc.data()) } as (APIKey & { userName?: string, userEmail?: string }));
    });
    return keys;
  } catch (error) {
    console.error("Error fetching API keys from Firestore:", error);
    return [];
  }
}

export default function ConsoleApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<(APIKey & { userName?: string, userEmail?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listAllApiKeys();
      setApiKeys(data);
    } catch (err) {
      setError("Failed to load API keys.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleCreateNewGlobalKey = () => {
    // This would involve writing to Firestore, potentially in a server action or a modal form
    alert("Placeholder: Open modal to create a new API key for a selected user and save to Firestore.");
     // For now, just re-fetch to simulate an update if you manually add a key to Firestore
    // onActionComplete(); 
  };
  
  const handleActionComplete = () => {
    fetchApiKeys(); // Re-fetch API keys after an action (e.g., revoke - if implemented via Firestore update)
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Developer API Keys</h1>
            <p className="text-foreground-500">
            Oversee, create, and revoke API keys for developers using the platform.
            </p>
        </div>
        <NextUIButton onPress={handleCreateNewGlobalKey} color="warning" className="text-white" startContent={<PlusCircle className="h-4 w-4" />}>
             Create New API Key
        </NextUIButton>
      </div>

      <NextUICard className="shadow-xl rounded-xl">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-semibold">All Developer API Keys</h2>
          <p className="text-sm text-foreground-500">
            A list of all API keys issued to developers. Manage their status and usage.
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
            <ApiKeyManagementTable apiKeys={apiKeys} onActionComplete={handleActionComplete} />
          )}
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}

