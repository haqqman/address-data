"use client";

import type { APIKey } from "@/types";
import {
  Table as NextUITable, TableHeader as NextUITableHeader, TableColumn as NextUITableColumn, TableBody as NextUITableBody, TableRow as NextUITableRow, TableCell as NextUITableCell,
  Chip as NextUIChip,
  Button as NextUIButton,
  ScrollShadow,
  Tooltip
} from "@nextui-org/react";
import { format } from "date-fns";
import { KeyRound, Trash2, PlusCircle, RotateCcw } from "lucide-react";

interface ApiKeyManagementTableProps {
  apiKeys: (APIKey & { userName?: string, userEmail?: string })[];
  onActionComplete: () => void;
}

export function ApiKeyManagementTable({ apiKeys, onActionComplete }: ApiKeyManagementTableProps) {

  const handleRevokeKey = async (keyId: string) => {
    // Mock action
    const result = { success: true, message: `API Key ${keyId} revoked successfully.` };
    if (result.success) {
      console.log("Action Successful", result.message);
      onActionComplete();
    } else {
      console.error("Action Failed", result.message);
    }
  };

  if (apiKeys.length === 0) {
    return <p className="text-foreground-500">No API keys found for any user.</p>;
  }

  return (
    <ScrollShadow hideScrollBar className="h-[600px] w-full border shadow-md rounded-lg">
      <NextUITable aria-label="API Key Management Table" removeWrapper>
        <NextUITableHeader>
          <NextUITableColumn>USER</NextUITableColumn>
          <NextUITableColumn>KEY NAME / ID</NextUITableColumn>
          <NextUITableColumn>PUBLIC KEY PREFIX</NextUITableColumn>
          <NextUITableColumn>STATUS</NextUITableColumn>
          <NextUITableColumn>CREATED AT</NextUITableColumn>
          <NextUITableColumn>LAST USED</NextUITableColumn>
          <NextUITableColumn className="text-right">ACTIONS</NextUITableColumn>
        </NextUITableHeader>
        <NextUITableBody items={apiKeys} emptyContent="No API keys found.">
          {(key) => (
            <NextUITableRow key={key.id}>
              <NextUITableCell>
                <div>{key.userName || "N/A"}</div>
                <div className="text-xs text-foreground-500">{key.userEmail || key.userId}</div>
              </NextUITableCell>
              <NextUITableCell>
                <div>{key.name || "Untitled Key"}</div>
                <div className="text-xs text-foreground-500">{key.id}</div>
              </NextUITableCell>
              <NextUITableCell className="font-mono">{key.publicKey.substring(0, 12)}...</NextUITableCell>
              <NextUITableCell>
                <NextUIChip size="sm" color={key.isActive ? "success" : "danger"} variant="flat">
                  {key.isActive ? "Active" : "Revoked"}
                </NextUIChip>
              </NextUITableCell>
              <NextUITableCell>{format(new Date(key.createdAt), "PPp")}</NextUITableCell>
              <NextUITableCell>{key.lastUsedAt ? format(new Date(key.lastUsedAt), "PPp") : "Never"}</NextUITableCell>
              <NextUITableCell className="text-right">
                {key.isActive ? (
                  <Tooltip content="Revoke Key" placement="top">
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
                  </Tooltip>
                ) : (
                  <Tooltip content="Key is Revoked" placement="top">
                     <NextUIButton isIconOnly size="sm" variant="light" isDisabled>
                       <RotateCcw className="h-4 w-4" />
                     </NextUIButton>
                  </Tooltip>
                )}
              </NextUITableCell>
            </NextUITableRow>
          )}
        </NextUITableBody>
      </NextUITable>
    </ScrollShadow>
  );
}