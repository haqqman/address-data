
"use client";

import type { APIKey } from "@/types"; // Assuming User type is also relevant
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { KeyRound, Trash2, PlusCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Mock actions - replace with actual server actions
// import { createApiKey, revokeApiKey, listApiKeysForUser } from "@/app/actions/adminApiKeyActions";

interface ApiKeyManagementTableProps {
  apiKeys: (APIKey & { userName?: string, userEmail?: string })[]; // Assuming APIKey type is extended with user info
  onActionComplete: () => void;
}

export function ApiKeyManagementTable({ apiKeys, onActionComplete }: ApiKeyManagementTableProps) {
  const { toast } = useToast();

  const handleRevokeKey = async (keyId: string) => {
    // const result = await revokeApiKey(keyId);
    // For mock:
    const result = { success: true, message: `API Key ${keyId} revoked successfully.` };
    if (result.success) {
      toast({ title: "Action Successful", description: result.message });
      onActionComplete();
    } else {
      toast({ title: "Action Failed", description: result.message, variant: "destructive" });
    }
  };

  const handleCreateKey = async (userId: string) => {
    // const result = await createApiKey(userId, "New API Key");
     // For mock:
    const result = { success: true, message: `New API Key created for user ${userId}.` };
    if (result.success) {
      toast({ title: "Action Successful", description: result.message });
      onActionComplete();
    } else {
      toast({ title: "Action Failed", description: result.message, variant: "destructive" });
    }
  }

  if (apiKeys.length === 0) {
    return <p className="text-muted-foreground">No API keys found for any user.</p>;
  }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Key Name / ID</TableHead>
            <TableHead>Public Key Prefix</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>
                <div>{key.userName || "N/A"}</div>
                <div className="text-xs text-muted-foreground">{key.userEmail || key.userId}</div>
              </TableCell>
              <TableCell>
                <div>{key.name || "Untitled Key"}</div>
                <div className="text-xs text-muted-foreground">{key.id}</div>
              </TableCell>
              <TableCell className="font-mono">{key.publicKey.substring(0, 12)}...</TableCell>
              <TableCell>
                <Badge variant={key.isActive ? "default" : "destructive"}>
                  {key.isActive ? "Active" : "Revoked"}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(key.createdAt), "PPp")}</TableCell>
              <TableCell>{key.lastUsedAt ? format(new Date(key.lastUsedAt), "PPp") : "Never"}</TableCell>
              <TableCell className="text-right space-x-2">
                {key.isActive ? (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleRevokeKey(key.id)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Revoke
                  </Button>
                ) : (
                   <Button variant="ghost" size="sm" disabled>
                    <RotateCcw className="mr-1 h-4 w-4" /> Revoked
                  </Button>
                )}
                {/* Add functionality to create a new key for this specific user */}
                {/* <Button variant="outline" size="sm" onClick={() => handleCreateKey(key.userId)}>
                  <PlusCircle className="mr-1 h-4 w-4" /> New Key for User
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
