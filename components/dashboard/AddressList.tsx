
"use client";

import type { AddressSubmission } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface AddressListProps {
  addresses: AddressSubmission[];
}

export function AddressList({ addresses }: AddressListProps) {
  const getStatusBadgeVariant = (status: AddressSubmission['status']) => {
    switch (status) {
      case "approved":
        return "default"; // bg-primary
      case "pending_review":
        return "secondary"; // bg-secondary
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAddress = (address: AddressSubmission['submittedAddress']) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}`;
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Address Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't submitted any addresses yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>My Address Submissions</CardTitle>
        <CardDescription>View the status of your submitted addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes/Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell className="font-medium max-w-xs truncate">{formatAddress(address.submittedAddress)}</TableCell>
                  <TableCell>{format(new Date(address.submittedAt), "PPP")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(address.status)}>
                      {address.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {address.status === 'pending_review' && address.aiFlaggedReason ? `AI: ${address.aiFlaggedReason}` : 
                     address.status === 'rejected' ? 'Rejected by admin' :
                     address.status === 'approved' ? 'Approved' : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
