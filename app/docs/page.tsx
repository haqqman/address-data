
"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Snippet } from "@nextui-org/react";
import { BookOpen, Code2 } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <NextUICard className="shadow-xl rounded-xl p-2">
            <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">API Documentation</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Integrate Address Data into your applications.
              </p>
            </NextUICardHeader>
            <NextUICardBody className="space-y-8 text-lg pt-0">
              <section>
                <h2 className="text-2xl font-semibold mb-3 flex items-center">
                  <Code2 className="mr-2 h-6 w-6 text-primary" /> Introduction
                </h2>
                <p>
                  Welcome to the Address Data API documentation. Our API provides endpoints for address validation,
                  lookup, autocompletion, and access to Nigerian geographical data.
                </p>
                <p className="mt-2">
                  All API requests must be authenticated using your API Key Pair (Public and Private Key).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 flex items-center">
                  <Code2 className="mr-2 h-6 w-6 text-primary" /> Authentication
                </h2>
                <p>
                  To authenticate your API requests, include your Public Key in the <code className="bg-muted px-1 rounded-sm text-sm">X-Public-Key</code> header
                  and your Private Key in the <code className="bg-muted px-1 rounded-sm text-sm">X-Private-Key</code> header.
                </p>
                <Snippet 
                  className="mt-2 text-sm max-w-full" 
                  symbol="" 
                  variant="bordered"
                  tooltipProps={{color:"primary"}}
                  copyButtonProps={{variant:"light"}}
                >
                  {`fetch('https://api.addressdata.ng/v1/endpoint', {
  headers: {
    'X-Public-Key': 'YOUR_PUBLIC_KEY',
    'X-Private-Key': 'YOUR_PRIVATE_KEY'
  }
})`}
                </Snippet>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 flex items-center">
                  <Code2 className="mr-2 h-6 w-6 text-primary" /> Endpoints
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium"><code className="bg-muted px-1 rounded-sm text-sm">/autocomplete</code></h3>
                    <p className="text-muted-foreground text-base">Suggests verified Nigerian addresses based on user input.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium"><code className="bg-muted px-1 rounded-sm text-sm">/lookup-by-code</code></h3>
                    <p className="text-muted-foreground text-base">Fetches a full verified address by its unique Address Data Code (ADC).</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium"><code className="bg-muted px-1 rounded-sm text-sm">/states</code></h3>
                    <p className="text-muted-foreground text-base">Lists all Nigerian states, including their respective LGAs and cities.</p>
                  </div>
                </div>
              </section>

              <p className="text-center text-muted-foreground pt-6">
                Detailed endpoint specifications, request/response examples, and rate limits will be available here soon.
              </p>
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
