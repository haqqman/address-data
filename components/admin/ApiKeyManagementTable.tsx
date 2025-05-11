
"use client";

import type { APIKey } from "@/types";
import {
  Table as NextUITable, TableHeader as NextUITableHeader, TableColumn as NextUITableColumn, TableBody as NextUITableBody, TableRow as NextUITableRow, TableCell as NextUITableCell,
  Chip as NextUIChip,
  Button as NextUIButton,
  ScrollShadow,
  Tooltip,
  useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input as NextUIInput
} from "@nextui-org/react";
import { format } from "date-fns";
import { KeyRound, Trash2, RotateCcw, ShieldOff, ShieldCheck, User, Edit3 } from "lucide-react";
import { useState } from "react";
import { revokeApiKey, reactivateApiKey, deleteApiKey } from "@/app/actions/apiKeyActions"; // Import new actions

interface ApiKeyManagementTableProps {
  apiKeys: APIKey[]; // No longer needs userName/userEmail directly from props, APIKey type updated
  onActionComplete: () => void;
  // onEditKey: (key: APIKey) => void; // For future editing if needed
}

export function ApiKeyManagementTable({ apiKeys, onActionComplete }: ApiKeyManagementTableProps) {
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const {isOpen: isRevokeModalOpen, onOpen: onRevokeModalOpen, onClose: onRevokeModalClose, onOpenChange: onRevokeModalOpenChange} = useDisclosure();
  const {isOpen: isReactivateModalOpen, onOpen: onReactivateModalOpen, onClose: onReactivateModalClose, onOpenChange: onReactivateModalOpenChange} = useDisclosure();
  const {isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose, onOpenChange: onDeleteModalOpenChange} = useDisclosure();


  const openModal = (key: APIKey, modalType: 'revoke' | 'reactivate' | 'delete') => {
    setSelectedKey(key);
    if (modalType === 'revoke') onRevokeModalOpen();
    else if (modalType === 'reactivate') onReactivateModalOpen();
    else if (modalType === 'delete') onDeleteModalOpen();
  };

  const handleRevoke = async () => {
    if (!selectedKey) return;
    const result = await revokeApiKey(selectedKey.id);
    if (result.success) {
      alert(result.message); // Replace with toast
      onActionComplete();
    } else {
      alert(`Error: ${result.message}`); // Replace with toast
    }
    onRevokeModalClose();
    setSelectedKey(null);
  };

  const handleReactivate = async () => {
    if (!selectedKey) return;
    const result = await reactivateApiKey(selectedKey.id);
     if (result.success) {
      alert(result.message); // Replace with toast
      onActionComplete();
    } else {
      alert(`Error: ${result.message}`); // Replace with toast
    }
    onReactivateModalClose();
    setSelectedKey(null);
  };
  
  const handleDelete = async () => {
    if (!selectedKey) return;
    const result = await deleteApiKey(selectedKey.id);
     if (result.success) {
      alert(result.message); // Replace with toast
      onActionComplete();
    } else {
      alert(`Error: ${result.message}`); // Replace with toast
    }
    onDeleteModalClose();
    setSelectedKey(null);
  };


  if (apiKeys.length === 0) {
    return <p className="text-foreground-500">No API keys found for any user.</p>;
  }

  return (
    <>
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
                <NextUITableCell className="text-right space-x-1">
                  {key.isActive ? (
                    <Tooltip content="Revoke Key" placement="top">
                      <NextUIButton 
                        isIconOnly size="sm" variant="light" color="warning" 
                        onPress={() => openModal(key, 'revoke')} aria-label="Revoke API Key"
                      >
                        <ShieldOff className="h-4 w-4" />
                      </NextUIButton>
                    </Tooltip>
                  ) : (
                    <Tooltip content="Reactivate Key" placement="top">
                      <NextUIButton isIconOnly size="sm" variant="light" color="success"
                        onPress={() => openModal(key, 'reactivate')} aria-label="Reactivate API Key"
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </NextUIButton>
                    </Tooltip>
                  )}
                   {/* <Tooltip content="Edit Key Name" placement="top">
                      <NextUIButton isIconOnly size="sm" variant="light" color="default"
                        onPress={() => onEditKey(key)} aria-label="Edit API Key Name"
                      >
                        <Edit3 className="h-4 w-4" />
                      </NextUIButton>
                  </Tooltip> */}
                  <Tooltip content="Delete Key" placement="top">
                      <NextUIButton isIconOnly size="sm" variant="light" color="danger"
                        onPress={() => openModal(key, 'delete')} aria-label="Delete API Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </NextUIButton>
                  </Tooltip>
                </NextUITableCell>
              </NextUITableRow>
            )}
          </NextUITableBody>
        </NextUITable>
      </ScrollShadow>

      {/* Revoke Modal */}
      <Modal isOpen={isRevokeModalOpen} onOpenChange={onRevokeModalOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Revoke API Key?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to revoke the API key <span className="font-semibold">{selectedKey?.name || selectedKey?.publicKey.substring(0,12)}...</span>?</p>
                <p>This will prevent it from being used to access the API.</p>
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={onClose}>Cancel</NextUIButton>
                <NextUIButton color="warning" onPress={handleRevoke}>Revoke Key</NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reactivate Modal */}
      <Modal isOpen={isReactivateModalOpen} onOpenChange={onReactivateModalOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reactivate API Key?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to reactivate the API key <span className="font-semibold">{selectedKey?.name || selectedKey?.publicKey.substring(0,12)}...</span>?</p>
                <p>This will allow it to be used to access the API again.</p>
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={onClose}>Cancel</NextUIButton>
                <NextUIButton color="success" onPress={handleReactivate}>Reactivate Key</NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete API Key?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to <span className="font-bold text-danger-500">permanently delete</span> the API key <span className="font-semibold">{selectedKey?.name || selectedKey?.publicKey.substring(0,12)}...</span>?</p>
                <p className="text-danger-500">This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={onClose}>Cancel</NextUIButton>
                <NextUIButton color="danger" onPress={handleDelete}>Delete Key</NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
