
"use client"; 

import { useState, useEffect, useCallback } from "react";
import { ApiKeyManagementTable } from "@/components/admin/ApiKeyManagementTable";
import type { APIKey, User as AppUser } from "@/types"; // Renamed User to AppUser to avoid conflict
import { Skeleton as NextUISkeleton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input as NextUIInput, useDisclosure, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { getAllApiKeys, createApiKey } from "@/app/actions/apiKeyActions";
import { db } from "@/lib/firebase/config"; // For fetching users for the dropdown
import { collection, getDocs } from "firebase/firestore"; // For fetching users
import { useAuth } from "@/contexts/auth-context";


// Simplified user type for dropdown
interface SimpleUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

async function fetchAllUsers(): Promise<SimpleUser[]> {
    // This is a simplified fetch for user selection.
    // In a real app, you might have a dedicated 'users' collection or use Firebase Auth listUsers (admin SDK).
    // For now, we'll try to fetch from 'users' collection if it exists, or an empty array.
    try {
        const usersCol = collection(db, "users"); // Assuming a 'users' collection exists
        const querySnapshot = await getDocs(usersCol);
        const users: SimpleUser[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                id: doc.id, // Firestore document ID, should be Firebase Auth UID
                name: data.name || data.displayName || "Unnamed User",
                email: data.email
            });
        });
        // Add admin users if not in 'users' collection (e.g. if they only exist in Auth)
        // This part is tricky without direct access to Firebase Auth user list client-side or a proper users collection.
        // For simplicity, let's assume 'users' collection has all relevant users for API key assignment.
        return users;
    } catch (error) {
        console.error("Error fetching users for API key assignment:", error);
        return []; // Return empty if 'users' collection doesn't exist or error occurs
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
        alert(result.message); // Replace with toast
        fetchApiKeys(); // Refresh list
        onClose(); // Close modal
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
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Developer API Keys</h1>
            <p className="text-foreground-500">
            Oversee, create, and revoke API keys for developers using the platform.
            </p>
        </div>
        <NextUIButton onPress={onOpen} color="warning" className="text-white" startContent={<PlusCircle className="h-4 w-4" />}>
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

          {error && !isLoading && ( // Show error only if not loading
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

      {/* Create New API Key Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(modalOnClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create New API Key</ModalHeader>
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
                        <span>{userItem.name || "Unnamed User"}</span>
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
                <NextUIButton color="warning" onPress={handleCreateNewKey} isLoading={isCreating} disabled={isCreating || !selectedUserId}>
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
