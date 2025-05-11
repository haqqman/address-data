"use client";

import type { AddressSubmission } from "@/types";
import {
  Table as NextUITable, TableHeader as NextUITableHeader, TableColumn as NextUITableColumn, TableBody as NextUITableBody, TableRow as NextUITableRow, TableCell as NextUITableCell,
  Chip as NextUIChip,
  Button as NextUIButton,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  Textarea as NextUITextarea,
  ScrollShadow,
  Tooltip
} from "@nextui-org/react";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { updateAddressStatus } from "@/app/actions/addressActions";
import { useState } from "react";

interface FlaggedAddressTableProps {
  addresses: AddressSubmission[];
  onActionComplete: () => void; 
}

export function FlaggedAddressTable({ addresses, onActionComplete }: FlaggedAddressTableProps) {
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose, onOpenChange: onApproveOpenChange } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose, onOpenChange: onRejectOpenChange } = useDisclosure();
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleAction = async (newStatus: "approved" | "rejected") => {
    if (!selectedSubmissionId) return;

    const result = await updateAddressStatus(selectedSubmissionId, newStatus, reviewNotes);
    if (result.success) {
      console.log("Action Successful", result.message);
      onActionComplete(); 
    } else {
      console.error("Action Failed", result.message);
    }
    setReviewNotes(""); 
    selectedSubmissionId === "approve" ? onApproveClose() : onRejectClose();
    setSelectedSubmissionId(null);
  };
  
  const formatFullAddress = (address: AddressSubmission['submittedAddress']) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}, ${address.country} ${address.zipCode ? `(${address.zipCode})` : ''}`;
  };

  const openModal = (submissionId: string, type: "approve" | "reject") => {
    setSelectedSubmissionId(submissionId);
    setReviewNotes("");
    if (type === "approve") onApproveOpen();
    else onRejectOpen();
  };

  if (addresses.length === 0) {
    return <p className="text-foreground-500">No addresses are currently pending review.</p>;
  }

  return (
    <>
      <ScrollShadow hideScrollBar className="h-[600px] w-full border shadow-md rounded-lg">
        <NextUITable aria-label="Flagged Addresses Table" removeWrapper>
          <NextUITableHeader>
            <NextUITableColumn>USER</NextUITableColumn>
            <NextUITableColumn>SUBMITTED ADDRESS</NextUITableColumn>
            <NextUITableColumn>GOOGLE MAPS SUGGESTION</NextUITableColumn>
            <NextUITableColumn>AI REASON</NextUITableColumn>
            <NextUITableColumn>SUBMITTED AT</NextUITableColumn>
            <NextUITableColumn className="text-right">ACTIONS</NextUITableColumn>
          </NextUITableHeader>
          <NextUITableBody items={addresses} emptyContent="No addresses pending review.">
            {(submission) => (
              <NextUITableRow key={submission.id}>
                <NextUITableCell>
                  <div>{submission.userName || "N/A"}</div>
                  <div className="text-xs text-foreground-500">{submission.userEmail || "N/A"}</div>
                </NextUITableCell>
                <NextUITableCell className="max-w-xs">
                  <Tooltip content={formatFullAddress(submission.submittedAddress)} placement="top-start">
                    <div className="font-medium truncate">
                      {formatFullAddress(submission.submittedAddress)}
                    </div>
                  </Tooltip>
                </NextUITableCell>
                <NextUITableCell className="max-w-xs">
                  <Tooltip content={submission.googleMapsSuggestion || "N/A"} placement="top-start">
                    <div className="truncate">
                    {submission.googleMapsSuggestion || "N/A"}
                    </div>
                  </Tooltip>
                </NextUITableCell>
                <NextUITableCell className="max-w-xs">
                  {submission.aiFlaggedReason ? (
                    <NextUIChip
                      size="sm"
                      variant="flat"
                      color="warning"
                      startContent={<AlertTriangle className="h-3 w-3" />}
                    >
                      {submission.aiFlaggedReason}
                    </NextUIChip>
                  ) : (
                    <NextUIChip size="sm" variant="flat" color="default" startContent={<Info className="h-3 w-3" />}>
                      No specific AI reason
                    </NextUIChip>
                  )}
                </NextUITableCell>
                <NextUITableCell>{format(new Date(submission.submittedAt), "PPp")}</NextUITableCell>
                <NextUITableCell className="text-right space-x-2">
                  <NextUIButton
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="success"
                    onPress={() => openModal(submission.id, "approve")}
                    aria-label="Approve"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </NextUIButton>
                  <NextUIButton
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => openModal(submission.id, "reject")}
                    aria-label="Reject"
                  >
                    <XCircle className="h-5 w-5" />
                  </NextUIButton>
                </NextUITableCell>
              </NextUITableRow>
            )}
          </NextUITableBody>
        </NextUITable>
      </ScrollShadow>

      {/* Approve Modal */}
      <Modal isOpen={isApproveOpen} onOpenChange={onApproveOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Approve Address?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to approve this address submission?</p>
                <NextUITextarea
                  label="Optional review notes..."
                  variant="bordered"
                  value={reviewNotes}
                  onValueChange={setReviewNotes}
                />
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={onClose}>
                  Cancel
                </NextUIButton>
                <NextUIButton color="success" onPress={() => {handleAction("approved"); onClose();}}>
                  Approve
                </NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onOpenChange={onRejectOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reject Address?</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to reject this address submission? This action cannot be undone.</p>
                <NextUITextarea
                  label="Reason for rejection (optional)..."
                  variant="bordered"
                  value={reviewNotes}
                  onValueChange={setReviewNotes}
                />
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={onClose}>
                  Cancel
                </NextUIButton>
                <NextUIButton color="danger" onPress={() => {handleAction("rejected"); onClose();}}>
                  Reject
                </NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}