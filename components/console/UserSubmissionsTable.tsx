
"use client";

import type { AddressSubmission } from "@/types";
import {
  Table as NextUITable, TableHeader as NextUITableHeader, TableColumn as NextUITableColumn, TableBody as NextUITableBody, TableRow as NextUITableRow, TableCell as NextUITableCell,
  Chip as NextUIChip,
  ScrollShadow,
  Tooltip
} from "@nextui-org/react";
import { format } from "date-fns";

interface UserSubmissionsTableProps {
  submissions: AddressSubmission[];
}

export function UserSubmissionsTable({ submissions }: UserSubmissionsTableProps) {
  
  const getStatusChipColor = (status: AddressSubmission['status']): "success" | "warning" | "danger" | "default" => {
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

  const formatFullAddress = (address: AddressSubmission['submittedAddress']) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}, ${address.country} ${address.zipCode ? `(${address.zipCode})` : ''}`;
  };

  if (submissions.length === 0) {
    return <p className="text-foreground-500">No address submissions found.</p>;
  }

  return (
    <ScrollShadow hideScrollBar className="h-[600px] w-full border shadow-md rounded-lg">
      <NextUITable aria-label="User Submissions Table" removeWrapper>
        <NextUITableHeader>
          <NextUITableColumn>USER</NextUITableColumn>
          <NextUITableColumn>SUBMITTED ADDRESS</NextUITableColumn>
          <NextUITableColumn>ADC</NextUITableColumn>
          <NextUITableColumn>STATUS</NextUITableColumn>
          <NextUITableColumn>SUBMITTED AT</NextUITableColumn>
          <NextUITableColumn>REVIEWED AT</NextUITableColumn>
          <NextUITableColumn>AI REASON / NOTES</NextUITableColumn>
        </NextUITableHeader>
        <NextUITableBody items={submissions} emptyContent="No submissions found.">
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
              <NextUITableCell className="font-mono text-xs">{submission.adc || 'N/A'}</NextUITableCell>
              <NextUITableCell>
                <NextUIChip size="sm" color={getStatusChipColor(submission.status)} variant="flat">
                  {submission.status.replace("_", " ").toUpperCase()}
                </NextUIChip>
              </NextUITableCell>
              <NextUITableCell>{format(new Date(submission.submittedAt), "PPp")}</NextUITableCell>
              <NextUITableCell>{submission.reviewedAt ? format(new Date(submission.reviewedAt), "PPp") : "N/A"}</NextUITableCell>
              <NextUITableCell className="max-w-xs truncate" title={submission.aiFlaggedReason || "N/A"}>
                {submission.aiFlaggedReason || (submission.status === 'approved' || submission.status === 'rejected' ? 'Manually Reviewed' : 'N/A')}
              </NextUITableCell>
            </NextUITableRow>
          )}
        </NextUITableBody>
      </NextUITable>
    </ScrollShadow>
  );
}
