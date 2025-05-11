
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code2 } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4 self-center">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">API Documentation</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Integrate Address Data into your applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-lg">
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
                  To authenticate your API requests, include your Public Key in the <code className="bg-muted px-1 rounded-sm">X-Public-Key</code> header 
                  and your Private Key in the <code className="bg-muted px-1 rounded-sm">X-Private-Key</code> header.
                </p>
                <pre className="bg-secondary/30 p-4 rounded-md mt-2 overflow-x-auto text-sm">
                  <code>
                    {`fetch('https://api.addressdata.ng/v1/endpoint', {
  headers: {
    'X-Public-Key': 'YOUR_PUBLIC_KEY',
    'X-Private-Key': 'YOUR_PRIVATE_KEY'
  }
})`}
                  </code>
                </pre>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 flex items-center">
                  <Code2 className="mr-2 h-6 w-6 text-primary" /> Endpoints
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium"><code className="bg-muted px-1 rounded-sm">/autocomplete</code></h3>
                    <p className="text-muted-foreground text-base">Suggests verified Nigerian addresses based on user input.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium"><code className="bg-muted px-1 rounded-sm">/lookup-by-code</code></h3>
                    <p className="text-muted-foreground text-base">Fetches a full verified address by its unique Address Data Code (ADC).</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium"><code className="bg-muted px-1 rounded-sm">/states</code></h3>
                    <p className="text-muted-foreground text-base">Lists all Nigerian states, including their respective LGAs and cities.</p>
                  </div>
                </div>
              </section>
              
              <p className="text-center text-muted-foreground pt-6">
                Detailed endpoint specifications, request/response examples, and rate limits will be available here soon.
              </p>
            </CardContent>
          </Card>
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
