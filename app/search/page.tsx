
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card, CardHeader, CardBody, Spinner, Divider, Link as NextUILink, Chip } from "@nextui-org/react";
import { searchByTerm } from "@/app/actions/searchActions";
import type { AddressSubmission, Estate } from "@/types";
import { Building, MapPin, Search as SearchIcon, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  
  const [results, setResults] = useState<{ addresses: AddressSubmission[]; estates: Estate[] }>({ addresses: [], estates: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      setError(null);
      searchByTerm(query)
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setError("An error occurred while searching. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [query]);
  
  const formatLocation = (location: Estate['location']) => {
    const parts = [];
    if (location.district) parts.push(location.district);
    else if (location.city) parts.push(location.city);
    parts.push(location.lga, location.state);
    return parts.filter(Boolean).join(', ');
  }
  
  const formatAddress = (address: AddressSubmission['submittedAddress']) => {
    const parts = [
        address.streetAddress, 
        address.areaDistrict, 
        address.city, 
        address.lga, 
        address.state
    ];
    return parts.filter(Boolean).join(', ');
  }

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
       <div className="flex items-center gap-2 mb-6">
        <SearchIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary">Search Results</h1>
      </div>
      
      {query && <p className="mb-8 text-foreground-600">Showing results for: <span className="font-semibold text-secondary">&quot;{query}&quot;</span></p>}
      
      {isLoading && <div className="flex justify-center p-8"><Spinner label="Searching..." color="warning" /></div>}
      
      {error && (
         <Card className="bg-danger-50 border-danger-200">
            <CardBody className="flex flex-row items-center gap-4">
                <AlertTriangle className="h-6 w-6 text-danger" />
                <p className="text-danger-700">{error}</p>
            </CardBody>
        </Card>
      )}

      {!isLoading && !error && results.estates.length === 0 && results.addresses.length === 0 && (
         <Card className="text-center p-8">
            <CardBody>
                <p className="text-foreground-500">No results found for your query.</p>
                <p className="text-sm text-foreground-400 mt-2">Try searching for a different address or estate code.</p>
            </CardBody>
        </Card>
      )}

      {!isLoading && !error && (
        <div className="space-y-8">
            {/* Estates Results */}
            {results.estates.length > 0 && (
                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Building className="h-6 w-6 text-secondary" />
                            <h2 className="text-xl font-semibold text-primary">Estates ({results.estates.length})</h2>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        {results.estates.map(estate => (
                            <div key={estate.id} className="p-4 border rounded-lg hover:bg-default-50 transition-colors">
                                <NextUILink as={Link} href={`/estates/${estate.id}`} className="font-bold text-lg text-primary">{estate.name}</NextUILink>
                                <p className="text-sm text-foreground-600 flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-secondary"/>
                                    {formatLocation(estate.location)}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-foreground-500">
                                  {estate.estateCode && <Chip size="sm" variant="flat" color="secondary">{estate.estateCode}</Chip>}
                                  <span>Last Updated: {format(estate.updatedAt, "PP")}</span>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            )}

             {/* Addresses Results */}
            {results.addresses.length > 0 && (
                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-secondary" />
                            <h2 className="text-xl font-semibold text-primary">Addresses ({results.addresses.length})</h2>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                       {results.addresses.map(address => (
                            <div key={address.id} className="p-4 border rounded-lg">
                                <p className="font-semibold text-primary">{formatAddress(address.submittedAddress)}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-foreground-500">
                                   {address.adc && <Chip size="sm" variant="flat" color="secondary">{address.adc}</Chip>}
                                   <span>Submitted: {format(new Date(address.submittedAt), "PP")}</span>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            )}

        </div>
      )}
    </main>
  );
}


export default function SearchPage() {
    return (
        <div className="flex flex-col min-h-screen">
          <PublicHeader />
          <Suspense fallback={<div className="flex-grow flex justify-center items-center"><Spinner label="Loading search..." color="warning" /></div>}>
            <SearchResults />
          </Suspense>
          <footer className="py-8 border-t bg-background">
            <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Address Data. All Rights Reserved.</p>
            </div>
          </footer>
        </div>
      );
}
