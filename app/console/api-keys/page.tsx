
"use client"; 

import { useState, useEffect, useCallback } from "react";
import { ApiKeyManagementTable } from "@/components/admin/ApiKeyManagementTable";
import type { APIKey } from "@/types"; 
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input as NextUIInput, useDisclosure, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { getAllApiKeys, createApiKey } from "@/app/actions/apiKeyActions";
import { db } from "@/lib/firebase/config"; 
import { collection, getDocs } from "firebase/firestore"; 
import { useAuth } from "@/contexts/auth-context";


interface SimpleUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

async function fetchAllUsers(): Promise<SimpleUser[]> {
    try {
        const usersCol = collection(db, "users"); 
        const querySnapshot = await getDocs(usersCol);
        const users: SimpleUser[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                id: doc.id, 
                name: data.name || data.displayName || "Unnamed User",
                email: data.email
            });
        });
        return users;
    } catch (error) {
        console.error("Error fetching users for API key assignment:", error);
        return []; 
    }
}


export default function ConsoleApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<SimpleUser[]>([]);
  const { user: adminUser } = useAuth();


  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllApiKeys();
      setApiKeys(data);
    } catch (err) {
      setError("Failed to load API keys.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUsersForDropdown = useCallback(async () => {
    const users = await fetchAllUsers();
    setAllUsers(users);
  }, []);

  useEffect(() => {
    fetchApiKeys();
    loadUsersForDropdown();
  }, [fetchApiKeys, loadUsersForDropdown]);

  const handleCreateNewKey = async () => {
    if (!adminUser || adminUser.role !== 'admin') {
        alert("Unauthorized action.");
        return;
    }
    if (!selectedUserId) {
        alert("Please select a user to assign the API key to.");
        return;
    }
    const targetUser = allUsers.find(u => u.id === selectedUserId);
    if (!targetUser) {
        alert("Selected user not found.");
        return;
    }

    setIsCreating(true);
    setError(null);
    try {
      const result = await createApiKey({
        userId: targetUser.id,
        userName: targetUser.name || undefined,
        userEmail: targetUser.email || undefined,
        keyName: newKeyName || undefined,
      });
      if (result.success) {
        alert(result.message); 
        fetchApiKeys(); 
        onClose(); 
        setNewKeyName("");
        setSelectedUserId(null);
      } else {
        setError(result.message || "Failed to create API key.");
      }
    } catch (err) {
      setError("An unexpected error occurred during key creation.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleActionComplete = () => {
    fetchApiKeys(); 
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Developer API Keys</h1>
            <p className="text-foreground-500">
            Oversee, create, and revoke API keys for developers using the platform.
            </p>
        </div>
        <NextUIButton 
            onPress={onOpen} 
            color="warning" 
            className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
            startContent={<PlusCircle className="h-4 w-4" />}
        >
             Create New API Key
        </NextUIButton>
      </div>

      <NextUICard className="shadow-xl rounded-xl bg-background">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-xl font-semibold text-primary">All Developer API Keys</h2>
            <p className="text-sm text-foreground-500">
              A list of all API keys issued to developers. Manage their status and usage.
            </p>
          </div>
        </NextUICardHeader>
        <NextUICardBody className="p-2 md:p-4">
          {isLoading && (
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

          {!isLoading && !error && (
            <ApiKeyManagementTable apiKeys={apiKeys} onActionComplete={handleActionComplete} />
          )}
        </NextUICardBody>
      </NextUICard>

      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(modalOnClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-primary">Create New API Key</ModalHeader>
              <ModalBody>
                <p>Assign a new API key to a user. The private key will be shown once upon creation.</p>
                <Autocomplete
                  label="Select User"
                  placeholder="Search for a user by name or email"
                  items={allUsers}
                  variant="bordered"
                  onSelectionChange={(key) => setSelectedUserId(key as string)}
                  selectedKey={selectedUserId}
                  className="max-w-xs"
                >
                  {(userItem) => (
                    <AutocompleteItem key={userItem.id} textValue={userItem.name || userItem.email || userItem.id}>
                      <div className="flex flex-col">
                        <span className="text-primary">{userItem.name || "Unnamed User"}</span>
                        <span className="text-xs text-default-500">{userItem.email || userItem.id}</span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <NextUIInput
                  label="API Key Name (Optional)"
                  placeholder="User's Main App Key"
                  variant="bordered"
                  value={newKeyName}
                  onValueChange={setNewKeyName}
                />
                {error && <p className="text-sm text-danger-500">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={modalOnClose} disabled={isCreating}>
                  Cancel
                </NextUIButton>
                <NextUIButton 
                    color="warning" 
                    onPress={handleCreateNewKey} 
                    isLoading={isCreating} 
                    disabled={isCreating || !selectedUserId}
                    className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                >
                  {isCreating ? "Creating..." : "Create API Key"}
                </NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
