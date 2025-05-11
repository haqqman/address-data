
"use client";

import type { AddressSubmission } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface UserSubmissionsTableProps {
  submissions: AddressSubmission[];
}

export function UserSubmissionsTable({ submissions }: UserSubmissionsTableProps) {
  const getStatusBadgeVariant = (status: AddressSubmission['status']) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending_review":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatFullAddress = (address: AddressSubmission['submittedAddress']) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}, ${address.country} ${address.zipCode ? `(${address.zipCode})` : ''}`;
  };

  if (submissions.length === 0) {
    return <p className="text-muted-foreground">No address submissions found.</p>;
  }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Submitted Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Reviewed At</TableHead>
            <TableHead>AI Reason / Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <div>{submission.userName || "N/A"}</div>
                <div className="text-xs text-muted-foreground">{submission.userEmail || "N/A"}</div>
              </TableCell>
              <TableCell className="max-w-xs">
                 <div className="font-medium truncate" title={formatFullAddress(submission.submittedAddress)}>
                  {formatFullAddress(submission.submittedAddress)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(submission.status)}>
                  {submission.status.replace("_", " ").toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(submission.submittedAt), "PPp")}</TableCell>
              <TableCell>{submission.reviewedAt ? format(new Date(submission.reviewedAt), "PPp") : "N/A"}</TableCell>
              <TableCell className="max-w-xs truncate" title={submission.aiFlaggedReason || "N/A"}>
                {submission.aiFlaggedReason || (submission.status === 'approved' || submission.status === 'rejected' ? 'Manually Reviewed' : 'N/A')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
