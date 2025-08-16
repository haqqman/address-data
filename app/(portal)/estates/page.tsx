
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Estate } from "@/types";
import { getEstates } from "@/app/actions/estateActions";
import { Card, CardHeader, CardBody, Skeleton, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default function EstatesPage() {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch only approved estates for the public list
      const data = await getEstates("approved"); 
      setEstates(data);
    } catch (err) {
      setError("Failed to load estates.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstates();
  }, [fetchEstates]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Estates</h1>
          <p className="text-foreground-500">Browse and manage real estate properties.</p>
        </div>
        <Button 
          as={Link}
          href="/submit-estate"
          color="warning" 
          className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
          startContent={<PlusCircle className="h-4 w-4" />}
        >
          Submit New Estate
        </Button>
      </div>
      
      <Card className="shadow-lg rounded-xl bg-background">
        <CardHeader className="p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary">Estate Directory</h2>
            <Input
                isClearable
                placeholder="Search by name or code..."
                startContent={<Search className="h-4 w-4 text-default-400" />}
                className="max-w-xs"
            />
        </CardHeader>
        <CardBody className="p-2 md:p-4">
            {isLoading && (
                <div className="space-y-4 p-4">
                    <Skeleton className="h-12 w-full rounded-lg bg-default-200" />
                    <Skeleton className="h-12 w-full rounded-lg bg-default-200" />
                    <Skeleton className="h-12 w-full rounded-lg bg-default-200" />
                </div>
            )}
            {error && !isLoading && (
                <Card className="mt-8 bg-danger-50 border-danger-200 rounded-xl">
                    <CardBody className="p-4">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-danger mr-3" />
                            <div>
                                <p className="font-semibold text-danger-700">Error</p>
                                <p className="text-sm text-danger-600">{error}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
            {!isLoading && !error && (
                 <Table aria-label="Estates Table" removeWrapper>
                    <TableHeader>
                        <TableColumn>CODE</TableColumn>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>LOCATION</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={estates} emptyContent="No approved estates found.">
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-xs">{item.estateCode}</TableCell>
                                <TableCell className="font-semibold">{item.name}</TableCell>
                                <TableCell>{`${item.location.lga}, ${item.location.state}`}</TableCell>
                                <TableCell>
                                    <Button as={Link} href={`/estates/${item.id}`} size="sm" variant="light">
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </CardBody>
      </Card>
    </div>
  );
}
