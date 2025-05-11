
"use client";

import type { AddressSubmission } from "@/types";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Table as NextUITable, TableHeader as NextUITableHeader, TableColumn as NextUITableColumn, TableBody as NextUITableBody, TableRow as NextUITableRow, TableCell as NextUITableCell, Chip as NextUIChip, ScrollShadow } from "@nextui-org/react";
import { format } from "date-fns";

interface AddressListProps {
  addresses: AddressSubmission[];
}

export function AddressList({ addresses }: AddressListProps) {
  
  const getStatusChipColor = (status: AddressSubmission['status']): "primary" | "secondary" | "danger" | "default" | "success" | "warning" => {
    switch (status) {
      case "approved":
        return "success"; 
      case "pending_review":
        return "warning"; 
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  const formatAddress = (address: AddressSubmission['submittedAddress']) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}`;
  }

  if (addresses.length === 0) {
    return (
      <NextUICard className="shadow-lg rounded-xl mt-8">
        <NextUICardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col space-y-0.5">
            <h2 className="text-xl font-semibold">My Address Submissions</h2>
          </div>
        </NextUICardHeader>
        <NextUICardBody className="p-6">
          <p className="text-foreground-500">You haven't submitted any addresses yet.</p>
        </NextUICardBody>
      </NextUICard>
    );
  }

  return (
    <NextUICard className="shadow-lg rounded-xl mt-8">
      <NextUICardHeader className="px-6 pt-6 pb-2">
        <div className="flex flex-col space-y-0.5">
          <h2 className="text-xl font-semibold">My Address Submissions</h2>
          <p className="text-sm text-foreground-500">View the status of your submitted addresses.</p>
        </div>
      </NextUICardHeader>
      <NextUICardBody className="p-0 md:p-2"> {/* Adjusted padding for table */}
        <ScrollShadow hideScrollBar className="h-[400px] w-full">
          <NextUITable aria-label="Address Submissions List" removeWrapper>
            <NextUITableHeader>
              <NextUITableColumn>ADDRESS</NextUITableColumn>
              <NextUITableColumn>SUBMITTED AT</NextUITableColumn>
              <NextUITableColumn>STATUS</NextUITableColumn>
              <NextUITableColumn>NOTES/REASON</NextUITableColumn>
            </NextUITableHeader>
            <NextUITableBody items={addresses} emptyContent="No addresses submitted yet.">
              {(item) => (
                <NextUITableRow key={item.id}>
                  <NextUITableCell className="max-w-xs truncate" title={formatAddress(item.submittedAddress)}>{formatAddress(item.submittedAddress)}</NextUITableCell>
                  <NextUITableCell>{format(new Date(item.submittedAt), "PPP")}</NextUITableCell>
                  <NextUITableCell>
                    <NextUIChip color={getStatusChipColor(item.status)} size="sm" variant="flat">
                      {item.status.replace("_", " ").toUpperCase()}
                    </NextUIChip>
                  </NextUITableCell>
                  <NextUITableCell className="max-w-xs truncate">
                    {item.status === 'pending_review' && item.aiFlaggedReason ? `AI: ${item.aiFlaggedReason}` : 
                     item.status === 'rejected' ? 'Rejected by admin' :
                     item.status === 'approved' ? 'Approved' : '-'}
                  </NextUITableCell>
                </NextUITableRow>
              )}
            </NextUITableBody>
          </NextUITable>
        </ScrollShadow>
      </NextUICardBody>
    </NextUICard>
  );
}
