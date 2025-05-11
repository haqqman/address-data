
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4 self-center">
                <Info className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">About Address Data</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Revolutionizing Address Intelligence in Nigeria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg">
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
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://searpane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Seapane
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
