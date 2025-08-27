
"use client"; 

import { Button as NextUIButton, Card, CardBody, CardHeader } from "@nextui-org/react";
import { PlusCircle, Map, Building, Hash } from "lucide-react";
import Link from "next/link";

const stats = [
    { name: "States Covered", stat: "36 + FCT", icon: <Map className="h-8 w-8 text-secondary"/> },
    { name: "Total Estates", stat: "150+", icon: <Building className="h-8 w-8 text-secondary"/> },
    { name: "Verified Addresses", stat: "12,500+", icon: <Hash className="h-8 w-8 text-secondary"/> },
];

export default function DashboardPage() {

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-foreground-500">An overview of the Address Data ecosystem.</p>
        </div>
        <div className="flex gap-4">
             <NextUIButton 
                as={Link} 
                href="/submit-address" 
                color="warning" 
                className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                startContent={<PlusCircle className="h-4 w-4" />}
            >
                Submit Address
            </NextUIButton>
             <NextUIButton 
                as={Link} 
                href="/submit-estate" 
                color="secondary" 
                variant="ghost"
                className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                startContent={<PlusCircle className="h-4 w-4" />}
            >
                Submit Estate
            </NextUIButton>
        </div>
      </div>
      
        <Card className="p-4">
            <CardBody>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((item) => (
                        <Card key={item.name} className="p-4 bg-primary/5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-secondary/10 text-secondary rounded-lg p-3">
                                    {item.icon}
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-foreground-500 truncate">{item.name}</dt>
                                        <dd className="text-2xl font-bold text-primary">{item.stat}</dd>
                                    </dl>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </CardBody>
        </Card>

       <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Recent Activity</h2>
            </CardHeader>
            <CardBody>
                <div className="text-center text-foreground-500 py-8">
                    <p>Recent activity and analytics will be displayed here soon.</p>
                </div>
            </CardBody>
       </Card>

    </div>
  );
}
