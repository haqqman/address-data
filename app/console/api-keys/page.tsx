"use client"; 

import { useState, useEffect, useCallback } from "react";
import { ApiKeyManagementTable } from "@/components/admin/ApiKeyManagementTable";
import type { APIKey } from "@/types";
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton } from "@nextui-org/react";
import { AlertTriangle, PlusCircle } from "lucide-react";

// Mock data and function
const mockApiKeys: (APIKey & { userName?: string, userEmail?: string })[] = [
  {
    id: "key_1", userId: "user_A", userName: "Alice Wonderland", userEmail: "alice@example.com",
    publicKey: "pk_live_alicekeypublic123", privateKeyHash: "hashed_private_key",
    createdAt: new Date(2023, 10, 1), lastUsedAt: new Date(2024, 0, 15), isActive: true, name: "Alice's Main Key"
  },
  {
    id: "key_2", userId: "user_B", userName: "Bob The Builder", userEmail: "bob@example.com",
    publicKey: "pk_live_bobkeypublic456", privateKeyHash: "hashed_private_key_2",
    createdAt: new Date(2023, 11, 5), isActive: false, name: "Bob's Old Key"
  },
    {
    id: "key_3", userId: "user_C", userName: "Charlie Brown", userEmail: "charlie@example.com",
    publicKey: "pk_live_charliekey789", privateKeyHash: "hashed_private_key_3",
    createdAt: new Date(2024, 0, 20), isActive: true, name: "Charlie's App Key"
  },
];

async function listAllApiKeys(): Promise<(APIKey & { userName?: string, userEmail?: string })[]> {
  return new Promise(resolve => setTimeout(() => resolve(mockApiKeys), 1000));
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
    alert("Placeholder: Open modal to create a new API key for a selected user.");
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
            <ApiKeyManagementTable apiKeys={apiKeys} onActionComplete={fetchApiKeys} />
          )}
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}