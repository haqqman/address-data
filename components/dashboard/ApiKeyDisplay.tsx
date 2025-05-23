
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Popover, PopoverTrigger, PopoverContent, Spinner, Listbox, ListboxItem, Chip as NextUIChip } from "@nextui-org/react";
import { Copy, Eye, EyeOff, AlertTriangle, KeyRound, PlusCircle, Trash2 } from "lucide-react"; // Removed RefreshCw as it's not used
import { useAuth } from "@/contexts/auth-context";
import { createApiKey, getUserApiKeys, revokeApiKey } from "@/app/actions/apiKeyActions";
import type { APIKey } from "@/types";
import { format } from "date-fns";

export function ApiKeyDisplay() {
  const { user } = useAuth();
  const [userApiKeys, setUserApiKeys] = useState<APIKey[]>([]);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{ publicKey: string, privateKey: string } | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyNameToCreate, setKeyNameToCreate] = useState("");

  const fetchKeys = useCallback(async () => {
    if (!user) {
      setIsLoadingKeys(false);
      return;
    }
    setIsLoadingKeys(true);
    setError(null);
    try {
      const keys = await getUserApiKeys(user.id);
      setUserApiKeys(keys);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
      setError("Could not load your API keys.");
    } finally {
      setIsLoadingKeys(false);
    }
  }, [user]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCopyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    alert(`${keyName} copied to clipboard!`); 
  };

  const handleGenerateNewKey = async () => {
    if (!user) {
      setError("You must be logged in to generate API keys.");
      return;
    }
    setIsGenerating(true);
    setNewlyGeneratedKey(null);
    setError(null);
    try {
      const result = await createApiKey({ 
        userId: user.id, 
        userName: user.name || undefined, 
        userEmail: user.email || undefined,
        keyName: keyNameToCreate || undefined 
      });
      if (result.success && result.apiKey && result.apiKey.privateKey) {
        setNewlyGeneratedKey({ publicKey: result.apiKey.publicKey, privateKey: result.apiKey.privateKey });
        setShowPrivateKey(true);
        setKeyNameToCreate(""); 
        fetchKeys(); 
      } else {
        setError(result.message || "Failed to generate new API key.");
      }
    } catch (err) {
      console.error("Error generating API key:", err);
      setError("An unexpected error occurred during key generation.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRevokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone directly, though it might be reactivatable by an admin.")) {
      return;
    }
    setError(null);
    try {
      const result = await revokeApiKey(keyId);
      if (result.success) {
        alert(result.message);
        fetchKeys(); 
      } else {
        setError(result.message || "Failed to revoke API key.");
      }
    } catch (err) {
      console.error("Error revoking API key:", err);
      setError("An unexpected error occurred while revoking the key.");
    }
  };


  return (
    <>
      <NextUICard className="shadow-lg rounded-xl mb-8 bg-background">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-xl font-semibold text-primary">Generate New API Key</h2>
            <p className="text-sm text-foreground-500">
              Create a new pair of API keys to access Address Data services.
            </p>
          </div>
        </NextUICardHeader>
        <NextUICardBody className="space-y-6 p-6">
          {newlyGeneratedKey && (
            <div className="space-y-4 p-4 border border-success-200 bg-success-50 rounded-lg">
              <h3 className="text-lg font-semibold text-success-700">New Keys Generated!</h3>
              <p className="text-sm text-success-600">
                Please save your Private Key securely. It will <strong className="font-bold">not</strong> be shown again.
              </p>
              <NextUIInput
                label="Newly Generated Public Key"
                value={newlyGeneratedKey.publicKey}
                isReadOnly
                variant="bordered"
                fullWidth
                endContent={
                  <NextUIButton isIconOnly variant="light" onPress={() => handleCopyToClipboard(newlyGeneratedKey.publicKey, "Public Key")} aria-label="Copy Public Key">
                    <Copy className="h-4 w-4" />
                  </NextUIButton>
                }
              />
              <NextUIInput
                label="Newly Generated Private Key"
                type={showPrivateKey ? "text" : "password"}
                value={newlyGeneratedKey.privateKey}
                isReadOnly
                variant="bordered"
                fullWidth
                endContent={
                  <div className="flex items-center">
                    <NextUIButton isIconOnly variant="light" onPress={() => setShowPrivateKey(!showPrivateKey)} aria-label={showPrivateKey ? "Hide Private Key" : "Show Private Key"}>
                      {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </NextUIButton>
                    <NextUIButton isIconOnly variant="light" onPress={() => handleCopyToClipboard(newlyGeneratedKey.privateKey, "Private Key")} aria-label="Copy Private Key">
                      <Copy className="h-4 w-4" />
                    </NextUIButton>
                  </div>
                }
              />
            </div>
          )}

          <div className="flex items-start p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
            <AlertTriangle className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Important Security Notice</h3>
              <p className="text-sm">
                Your Private Key is shown only once upon generation. Treat it like a password and store it securely. If lost, you will need to generate a new key pair.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <NextUIInput
                label="API Key Name (Optional)"
                placeholder="My App Key"
                variant="bordered"
                value={keyNameToCreate}
                onValueChange={setKeyNameToCreate}
                className="flex-grow"
            />
            <Popover placement="top">
                <PopoverTrigger>
                    <NextUIButton 
                    color="warning" // Main CTA uses accent color
                    className="text-primary w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                    isLoading={isGenerating} 
                    disabled={isGenerating || !user}
                    startContent={!isGenerating ? <PlusCircle className="h-4 w-4" /> : null}
                    >
                    {isGenerating ? "Generating..." : "Generate New Key Pair"}
                    </NextUIButton>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="px-1 py-2">
                    <div className="text-small font-bold text-primary">Confirm Generation</div>
                    <div className="text-tiny">This will create a new set of API keys.</div>
                    <NextUIButton 
                        size="sm" 
                        color="warning" 
                        className="mt-2 text-primary w-full shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
                        onPress={handleGenerateNewKey}
                    >
                        Confirm &amp; Generate
                    </NextUIButton>
                    </div>
                </PopoverContent>
            </Popover>
          </div>
           {error && <p className="text-sm text-danger-500 mt-2">{error}</p>}
        </NextUICardBody>
      </NextUICard>

      <NextUICard className="shadow-lg rounded-xl bg-background">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-xl font-semibold text-primary">Your Existing API Keys</h2>
            <p className="text-sm text-foreground-500">
              Manage your existing API keys.
            </p>
          </div>
        </NextUICardHeader>
        <NextUICardBody className="p-6">
          {isLoadingKeys && <div className="flex justify-center items-center py-8"><Spinner label="Loading your keys..." color="warning" /></div>}
          {!isLoadingKeys && error && <p className="text-danger-500 text-center py-4">{error}</p>}
          {!isLoadingKeys && !error && userApiKeys.length === 0 && (
            <p className="text-foreground-500 text-center py-4">You have not generated any API keys yet.</p>
          )}
          {!isLoadingKeys && !error && userApiKeys.length > 0 && (
            <Listbox 
                aria-label="User API Keys" 
                variant="flat"
                itemClasses={{ base: "gap-3" }}
            >
              {userApiKeys.map((key) => (
                <ListboxItem 
                    key={key.id} 
                    textValue={key.name || key.publicKey}
                    className="p-4 border rounded-lg mb-2 shadow-sm hover:bg-default-100"
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <KeyRound className="h-5 w-5 mr-3 text-secondary" />
                        <div>
                          <p className="font-semibold text-primary">{key.name || "Untitled Key"}</p>
                          <p className="text-xs text-foreground-500">Public Key: <span className="font-mono">{key.publicKey.substring(0,15)}...</span></p>
                        </div>
                      </div>
                      <div className="text-xs text-foreground-400 mt-1">
                        Created: {format(new Date(key.createdAt), "PPp")}
                        {key.lastUsedAt && (<span> | Last Used: {format(new Date(key.lastUsedAt), "PPp")}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <NextUIChip size="sm" color={key.isActive ? "success" : "danger"} variant="flat">
                            {key.isActive ? "Active" : "Revoked"}
                        </NextUIChip>
                        {key.isActive && (
                           <NextUIButton 
                                isIconOnly 
                                size="sm" 
                                variant="light" 
                                color="danger" 
                                onPress={() => handleRevokeKey(key.id)}
                                aria-label="Revoke API Key"
                            >
                                <Trash2 className="h-4 w-4" />
                           </NextUIButton>
                        )}
                    </div>
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </NextUICardBody>
      </NextUICard>
    </>
  );
}
