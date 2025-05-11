
"use client";

import type { AddressSubmission } from "@/types";
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
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateAddressStatus } from "@/app/actions/addressActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";


interface FlaggedAddressTableProps {
  addresses: AddressSubmission[];
  onActionComplete: () => void; // Callback to refresh data
}

export function FlaggedAddressTable({ addresses, onActionComplete }: FlaggedAddressTableProps) {
  const { toast } = useToast();
  const [reviewNotes, setReviewNotes] = useState("");

  const handleAction = async (submissionId: string, newStatus: "approved" | "rejected") => {
    const result = await updateAddressStatus(submissionId, newStatus, reviewNotes);
    if (result.success) {
      toast({
        title: "Action Successful",
        description: result.message,
      });
      onActionComplete(); // Refresh the list
    } else {
      toast({
        title: "Action Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setReviewNotes(""); // Clear notes after action
  };
  
  const formatFullAddress = (address: AddressSubmission['submittedAddress']) => {
    return `${address.streetAddress}, ${address.areaDistrict}, ${address.city}, ${address.lga}, ${address.state}, ${address.country} ${address.zipCode ? `(${address.zipCode})` : ''}`;
  };

  if (addresses.length === 0) {
    return <p className="text-muted-foreground">No addresses are currently pending review.</p>;
  }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Submitted Address</TableHead>
            <TableHead>Google Maps Suggestion</TableHead>
            <TableHead>AI Reason</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((submission) => (
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
              <TableCell className="max-w-xs">
                <div className="truncate" title={submission.googleMapsSuggestion || "N/A"}>
                 {submission.googleMapsSuggestion || "N/A"}
                </div>
                </TableCell>
              <TableCell className="max-w-xs">
                {submission.aiFlaggedReason ? (
                  <Badge variant="outline" className="bg-amber-100 border-amber-400 text-amber-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {submission.aiFlaggedReason}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Info className="h-3 w-3 mr-1" />
                    No specific AI reason
                  </Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(submission.submittedAt), "PPp")}</TableCell>
              <TableCell className="text-right space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Address?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this address submission?
                        <Textarea 
                          placeholder="Optional review notes..." 
                          className="mt-2"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setReviewNotes("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(submission.id, "approved")}
                      >
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100">
                       <XCircle className="mr-1 h-4 w-4" /> Reject
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Address?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this address submission? This action cannot be undone.
                        <Textarea 
                          placeholder="Reason for rejection (optional)..." 
                          className="mt-2"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setReviewNotes("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => handleAction(submission.id, "rejected")}
                      >
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
