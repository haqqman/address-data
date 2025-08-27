
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Estate } from "@/types";
import { getEstates } from "@/app/actions/estateActions";
import { Card, CardHeader, CardBody, Skeleton, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link as NextUILink, Chip, Select, SelectItem, type Selection } from "@nextui-org/react";
import { AlertTriangle, PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default function EstatesPage() {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [stateFilter, setStateFilter] = useState<Selection>(new Set([]));


  const fetchEstates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all estates regardless of status for the portal view
      const data = await getEstates(); 
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

  const hasSearchFilter = Boolean(filterValue);
  
  const uniqueStates = useMemo(() => {
    const statesSet = new Set<string>();
    estates.forEach(estate => {
        if (estate.location.state) {
            statesSet.add(estate.location.state);
        }
    });
    return Array.from(statesSet).sort();
  }, [estates]);


  const filteredItems = useMemo(() => {
    let filteredEstates = [...estates];

    if (hasSearchFilter) {
      filteredEstates = filteredEstates.filter((estate) =>
        estate.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        estate.estateCode?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    const selectedStates = Array.from(stateFilter).map(s => String(s));
    if (selectedStates.length > 0 && !selectedStates.includes("all")) {
         filteredEstates = filteredEstates.filter((estate) => selectedStates.includes(estate.location.state));
    }

    return filteredEstates;
  }, [estates, filterValue, hasSearchFilter, stateFilter]);
  
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
  },[])

  const getStatusChipColor = (status: Estate['status']): "success" | "warning" | "danger" | "default" => {
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
        <CardHeader className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-primary w-full md:w-auto">{filteredItems.length} {filteredItems.length === 1 ? 'Estate' : 'Estates'}</h2>
            <div className="w-full md:w-auto md:flex-grow md:max-w-2xl flex flex-col md:flex-row gap-4">
              <Select
                label="Filter by State"
                placeholder="All States"
                size="sm"
                selectedKeys={stateFilter}
                onSelectionChange={setStateFilter}
                className="w-full md:max-w-xs"
              >
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </Select>
              <Input
                  isClearable
                  placeholder="Search by name or code..."
                  startContent={<Search className="h-4 w-4 text-default-400" />}
                  className="w-full md:max-w-xs"
                  value={filterValue}
                  size="sm"
                  onClear={onClear}
                  onValueChange={onSearchChange}
              />
            </div>
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
                        <TableColumn>CITY/DISTRICT</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={filteredItems} emptyContent={"No estates match the current filters."}>
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-xs">{item.estateCode || 'N/A'}</TableCell>
                                <TableCell className="font-semibold">{item.name}</TableCell>
                                <TableCell>{item.location.city || item.location.district}</TableCell>
                                <TableCell>
                                  <Chip size="sm" variant="flat" color={getStatusChipColor(item.status)}>
                                    {item.status.replace("_", " ").toUpperCase()}
                                  </Chip>
                                </TableCell>
                                <TableCell>
                                    <Button as={NextUILink} href={`/estates/${item.id}`} size="sm" variant="light" color="secondary">
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
