
"use client"; // Required for useState, useEffect

import { useState, useEffect, useCallback } from "react";
import { ApiKeyManagementTable } from "@/components/admin/ApiKeyManagementTable";
// import { listAllApiKeys } from "@/app/actions/adminApiKeyActions"; // Mock this action
import type { APIKey } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data and function for listing all API keys
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


export default function AdminApiKeysPage() {
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
    // This would open a modal or form to select a user and create a key
    alert("Placeholder: Open modal to create a new API key for a selected user.");
    // Potentially call fetchApiKeys() after creation in a real scenario
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Developer API Keys</h1>
            <p className="text-muted-foreground">
            Oversee, create, and revoke API keys for developers using the platform.
            </p>
        </div>
        <Button onClick={handleCreateNewGlobalKey} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New API Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Developer API Keys</CardTitle>
          <CardDescription>
            A list of all API keys issued to developers. Manage their status and usage.
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
            <ApiKeyManagementTable apiKeys={apiKeys} onActionComplete={fetchApiKeys} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
