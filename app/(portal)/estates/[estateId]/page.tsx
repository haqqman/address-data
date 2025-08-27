
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEstateById, updateEstate } from "@/app/actions/estateActions";
import type { Estate } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardHeader, CardBody, CardFooter, Skeleton, Button, Input, Link as NextUILink, Divider, Chip } from "@nextui-org/react";
import { AlertTriangle, ArrowLeft, Edit, MapPin, Globe, CheckCircle, Info } from "lucide-react";
import { format } from "date-fns";

export default function ManageEstatePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const estateId = params.estateId as string;

  const [estate, setEstate] = useState<Estate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", googleMapLink: "" });
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);


  const fetchEstate = useCallback(async () => {
    if (!estateId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEstateById(estateId);
      if (data) {
        setEstate(data);
        setEditForm({ name: data.name, googleMapLink: data.googleMapLink || "" });
      } else {
        setError("Estate not found.");
      }
    } catch (err) {
      setError("Failed to load estate details.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [estateId]);

  useEffect(() => {
    fetchEstate();
  }, [fetchEstate]);
  
  const formatLocation = (location: Estate['location']) => {
    const parts = [];
    if (location.district) parts.push(location.district);
    else if (location.city) parts.push(location.city);
    parts.push(location.lga, location.state);
    return parts.filter(Boolean).join(', ');
  }


  const handleUpdate = async () => {
    if (!estate || !user) return;

    setIsSubmitting(true);
    setSubmissionStatus(null);
    
    const dataToUpdate: Partial<Estate> = {};
    if (editForm.name !== estate.name) dataToUpdate.name = editForm.name;
    if (editForm.googleMapLink !== (estate.googleMapLink || "")) dataToUpdate.googleMapLink = editForm.googleMapLink;

    if(Object.keys(dataToUpdate).length === 0) {
        setIsSubmitting(false);
        setIsEditing(false);
        return;
    }

    const result = await updateEstate(estate.id, dataToUpdate, user.id);
    
    if (result.success) {
      setSubmissionStatus({ type: 'success', message: result.message });
      fetchEstate(); // Refresh data
      setIsEditing(false);
    } else {
      setSubmissionStatus({ type: 'error', message: result.message });
    }
    
    setIsSubmitting(false);
  };


  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/4 rounded-lg bg-default-200" />
        <Card className="shadow-lg rounded-xl">
          <CardHeader><Skeleton className="h-8 w-3/5 rounded-lg bg-default-200" /></CardHeader>
          <CardBody className="space-y-4">
            <Skeleton className="h-6 w-full rounded-lg bg-default-300" />
            <Skeleton className="h-6 w-4/5 rounded-lg bg-default-300" />
            <Skeleton className="h-6 w-full rounded-lg bg-default-300" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10 bg-danger-50 border-danger-200 rounded-xl">
        <CardBody className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-danger mr-4" />
            <div>
              <p className="font-semibold text-danger-700">Error</p>
              <p className="text-sm text-danger-600">{error}</p>
              <Button as={NextUILink} href="/estates" size="sm" variant="light" color="danger" className="mt-2">
                Back to Estates
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!estate) return null;

  return (
    <div className="space-y-8">
      <div>
        <Button
            variant="light"
            onPress={() => router.push("/estates")}
            startContent={<ArrowLeft className="h-4 w-4" />}
            className="mb-4"
        >
          Back to Estates
        </Button>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">{estate.name}</h1>
                <p className="text-foreground-500 font-mono text-sm mt-1">{estate.estateCode}</p>
            </div>
            {!isEditing && (
                 <Button 
                    color="secondary" 
                    variant="ghost"
                    className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                    startContent={<Edit className="h-4 w-4" />}
                    onPress={() => setIsEditing(true)}
                 >
                    Suggest Improvement
                </Button>
            )}
        </div>
      </div>
      
       {submissionStatus && (
          <Card className={`mb-6 ${submissionStatus.type === 'success' ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'}`}>
            <CardBody className="p-4">
              <div className="flex items-center">
                {submissionStatus.type === 'success' ? <CheckCircle className="h-5 w-5 text-success mr-3" /> : <AlertTriangle className="h-5 w-5 text-danger mr-3" />}
                <p className={`text-sm font-medium ${submissionStatus.type === 'success' ? 'text-success-700' : 'text-danger-700'}`}>{submissionStatus.message}</p>
              </div>
            </CardBody>
          </Card>
        )}

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
            <h2 className="text-xl font-semibold text-primary">Estate Details</h2>
        </CardHeader>
        <CardBody className="space-y-4">
            {isEditing ? (
                <div className="space-y-4">
                    <Input
                        label="Estate Name"
                        value={editForm.name}
                        onValueChange={(v) => setEditForm({ ...editForm, name: v })}
                        variant="bordered"
                    />
                    <Input
                        label="Google Map Link"
                        value={editForm.googleMapLink}
                        onValueChange={(v) => setEditForm({ ...editForm, googleMapLink: v })}
                        variant="bordered"
                        placeholder="https://maps.app.goo.gl/..."
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-secondary mr-3"/>
                        <span>{formatLocation(estate.location)}</span>
                    </div>
                    {estate.googleMapLink && (
                        <div className="flex items-center">
                            <Globe className="h-5 w-5 text-secondary mr-3"/>
                            <NextUILink href={estate.googleMapLink} isExternal showAnchorIcon>
                                View on Google Maps
                            </NextUILink>
                        </div>
                    )}
                    <div className="flex items-center">
                         <Info className="h-5 w-5 text-secondary mr-3"/>
                         <span className="mr-2">Source:</span>
                         <Chip size="sm" variant="flat">{estate.source}</Chip>
                    </div>
                </div>
            )}
        </CardBody>
        {isEditing && (
            <CardFooter className="flex justify-end gap-2">
                <Button variant="light" onPress={() => setIsEditing(false)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button color="warning" onPress={handleUpdate} isLoading={isSubmitting} disabled={isSubmitting} className="text-primary">
                    Submit Improvement
                </Button>
            </CardFooter>
        )}
         {!isEditing && (
            <>
                <Divider/>
                <CardFooter className="text-xs text-foreground-500 justify-between">
                    <div>
                        <p>Created: {format(estate.createdAt, "PPp")}</p>
                        <p>Created By: {estate.createdBy.startsWith('system') ? 'System' : estate.createdBy}</p>
                    </div>
                     <div>
                        <p>Last Updated: {format(estate.updatedAt, "PPp")}</p>
                        <p>Updated By: {estate.lastUpdatedBy.startsWith('system') ? 'System' : estate.lastUpdatedBy}</p>
                    </div>
                </CardFooter>
            </>
         )}
      </Card>
    </div>
  );
}
