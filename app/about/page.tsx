
"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { Info } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <NextUICard className="shadow-xl rounded-xl p-2">
            <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                <Info className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">About Address Data</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Revolutionizing Address Intelligence in Nigeria.
              </p>
            </NextUICardHeader>
            <NextUICardBody className="space-y-6 text-lg pt-0">
              <div className="flex justify-center my-6">
                <Image
                  src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-illustration-pana.svg"
                  alt="About Address Data Illustration"
                  width={300}
                  height={250}
                  data-ai-hint="team collaboration"
                />
              </div>
              <p>
                <strong>Address Data</strong> is an address intelligence platform purpose-built for Nigeria.
                It provides developers, businesses, and admins with tools to validate, store, and retrieve
                Nigerian address data in a structured, efficient, and scalable way.
              </p>
              <p>
                Our system supports manual overrides, geolocation comparisons, and machine-readable outputs —
                all designed to boost accuracy and usability in real-world applications.
              </p>
              <h2 className="text-2xl font-semibold pt-4">Our Mission</h2>
              <p>
                To provide the most reliable and comprehensive address data service for Nigeria, empowering
                businesses and developers with the tools they need for accurate location-based services,
                logistics, and customer engagement.
              </p>
              <h2 className="text-2xl font-semibold pt-4">Key Objectives</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Ensure high accuracy of address data through AI and manual verification.</li>
                <li>Provide developer-friendly APIs for easy integration.</li>
                <li>Offer structured address storage for maximum compatibility.</li>
                <li>Continuously improve our platform based on user feedback and technological advancements.</li>
              </ul>
              <div className="flex justify-center pt-6">
                <Image 
                  src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark-light.svg" 
                  alt="Address Data Logomark" 
                  width={48} 
                  height={48}
                  className="text-primary"
                />
              </div>
            </NextUICardBody>
          </NextUICard>
        </div>
      </main>
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://searpane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 no-underline"
            >
              Seapane
            </a>
          </p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Address Data. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

    