
"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Snippet, Link as NextUILink, Divider as NextUIDivider, Code } from "@nextui-org/react";
import { BookOpen, Code2, Zap, ShieldCheck, MapPinned, HelpCircle, Layers, AlertTriangle, Tag, Building, Map as MapIcon } from "lucide-react";
import Image from "next/image";

const API_BASE_URL = "https://api.addressdata.ng/v1";

export default function DocsPage() {
  const addressObjectStructure = `{
  "adc": "ADC12345XYZ", // Address Data Code
  "streetAddress": "123 Main Street, XYZ Layout",
  "areaDistrict": "Ikeja GRA",
  "city": "Ikeja",
  "lga": "Ikeja",
  "state": "Lagos",
  "zipCode": "100001",
  "country": "Nigeria",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "status": "verified",
  "googleMapsSuggestion": "123 Main St, Ikeja GRA, Ikeja, Lagos 100001, Nigeria"
}`;

  const estateObjectStructure = `{
  "estateCode": "LAG-ETI-BNN01", // Unique Estate Code
  "name": "Banana Island Estate",
  "location": {
    "state": "Lagos",
    "lga": "Eti Osa",
    "area": "Ikoyi"
  },
  "googleMapLink": "https://maps.app.goo.gl/u5B1gY8Jz9W7xXaP7",
  "status": "approved"
}`;

  const authExample = `// Example: Fetching data with authentication headers
fetch('${API_BASE_URL}/address/lookup-by-code/ADC123XYZ', {
  method: 'GET',
  headers: {
    'X-Public-Key': 'YOUR_PUBLIC_KEY',
    'X-Private-Key': 'YOUR_PRIVATE_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

  const autocompleteRequest = `${API_BASE_URL}/autocomplete?query=123 Allen Ave Ikeja`;
  const autocompleteResponse = `[
  {
    "adc": "ADC123XYZ",
    "formattedAddress": "123 Allen Avenue, Ikeja, Lagos",
    "streetAddress": "123 Allen Avenue",
    "city": "Ikeja",
    "lga": "Ikeja",
    "state": "Lagos"
  },
  // ... other suggestions
]`;

  const lookupByCodeRequest = `${API_BASE_URL}/lookup-by-code/ADC789ABC`;

  const listEstatesRequest = `${API_BASE_URL}/estates`;
  const listEstatesResponse = `[
  { 
    "estateCode": "LAG-ETI-BNN01", 
    "name": "Banana Island Estate",
    "location": { "state": "Lagos", "lga": "Eti Osa" }
  },
  // ... other estates
]`;
  const lookupEstateByCodeRequest = `${API_BASE_URL}/estates/LAG-ETI-PRV02`;


  const statesRequest = `${API_BASE_URL}/states`;
  const statesResponse = `[
  { "name": "Abia", "capital": "Umuahia" },
  { "name": "Lagos", "capital": "Ikeja" },
  // ... other states
]`;

  const lgasRequest = `${API_BASE_URL}/states/Lagos/lgas`;
  const lgasResponse = `[
  { "name": "Agege" },
  { "name": "Ikeja" },
  // ... other LGAs in Lagos
]`;

  const citiesRequest = `${API_BASE_URL}/states/Lagos/lga/Ikeja/cities`;
  const citiesResponse = `[
  { "name": "Ikeja" },
  { "name": "Oregun" },
  // ... other cities/towns in Ikeja LGA
]`;


  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <NextUICard className="shadow-xl rounded-xl p-2 md:p-4 bg-background">
            <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-4">
              <div className="inline-flex items-center justify-center rounded-full bg-secondary/10 p-3 mb-4">
                <BookOpen className="h-10 w-10 text-secondary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">API Documentation</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Integrate Address Data into your applications seamlessly.
              </p>
            </NextUICardHeader>
            <NextUICardBody className="space-y-10 text-lg pt-0 text-foreground/90">
               <div className="flex justify-center my-6">
                <Image
                  src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-illustration-cuate.svg"
                  alt="API Documentation Illustration"
                  width={350}
                  height={300}
                  data-ai-hint="developer documentation"
                />
              </div>
              
              <section id="introduction">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                  <Zap className="mr-2 h-6 w-6 text-secondary" /> Introduction
                </h2>
                <p>
                  Welcome to the Address Data API. Our RESTful API provides robust endpoints for Nigerian address validation,
                  lookup, autocompletion, and access to structured geographical and real estate data. Empower your applications with accurate
                  and verified information.
                </p>
                <p className="mt-2">
                  All API requests must be authenticated. Please refer to the Authentication section below.
                </p>
              </section>

              <NextUIDivider />

              <section id="authentication">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                  <ShieldCheck className="mr-2 h-6 w-6 text-secondary" /> Authentication
                </h2>
                <p>
                  To authenticate your API requests, include your Public Key in the <Code>X-Public-Key</Code> header
                  and your Private Key in the <Code>X-Private-Key</Code> header.
                  You can generate your API keys from the developer portal.
                </p>
                <p className="text-base mt-4 mb-1"><strong>Authentication Example:</strong></p>
                <Snippet 
                  lang="javascript"
                  className="text-sm max-w-full" 
                  symbol="" 
                  variant="bordered"
                  tooltipProps={{color:"secondary"}} 
                  copyButtonProps={{variant:"light"}}
                >
                  {authExample}
                </Snippet>
              </section>

              <NextUIDivider />

              <section id="rate-limiting-pricing">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                  <Tag className="mr-2 h-6 w-6 text-secondary" /> Rate Limits &amp; Pricing
                </h2>
                <p>
                  Get started with <strong className="text-secondary">500 free address lookups per day</strong>. This daily limit applies to endpoints like 
                  <Code>/autocomplete</Code> and <Code>/lookup-by-code</Code>.
                </p>
                <p className="mt-2">
                  Our standard pricing plan is designed to be simple and scalable:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong className="text-secondary">₦20 per verified lookup</strong> after your free daily limit.</li>
                    <li>Access to geographical data endpoints (<Code>/states</Code>, etc.) is generally not counted towards lookup limits but may be subject to fair use policies.</li>
                </ul>
                <p className="mt-3 p-3 bg-warning/10 text-warning-foreground rounded-lg text-base">
                  <strong>Note:</strong> Detailed standard pricing plans and billing information will be available soon.
                </p>
              </section>

              <NextUIDivider />
              
              <section id="base-url">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                  <Layers className="mr-2 h-6 w-6 text-secondary" /> API Base URL
                </h2>
                <p>All API endpoints are relative to the following base URL:</p>
                <Snippet 
                  className="mt-2 text-base max-w-full" 
                  symbol="" 
                  variant="flat"
                  color="secondary"
                  copyButtonProps={{variant:"light"}}
                >
                  {API_BASE_URL}
                </Snippet>
              </section>

              <NextUIDivider />

              <section id="address-endpoints">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-primary">
                  <MapPinned className="mr-2 h-6 w-6 text-secondary" /> Address Endpoints
                </h2>
                <div className="space-y-8">
                  
                  {/* Autocomplete Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /autocomplete</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Suggests verified Nigerian addresses based on partial user input. Ideal for checkout forms and registrations.
                    </p>
                    <p className="text-base mb-1"><strong>Query Parameters:</strong></p>
                    <ul className="list-disc list-inside text-base ml-4 mb-2">
                      <li><Code>query</Code> (string, required): The partial address string to search for.</li>
                    </ul>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {autocompleteRequest}
                    </Snippet>
                    <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {autocompleteResponse}
                    </Snippet>
                  </div>

                  {/* Lookup by Code Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /lookup-by-code/{'{adc}'}</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Fetches a full, verified address using its unique Address Data Code (ADC).
                    </p>
                     <p className="text-base mb-1"><strong>Path Parameters:</strong></p>
                    <ul className="list-disc list-inside text-base ml-4 mb-2">
                      <li><Code>adc</Code> (string, required): The Address Data Code.</li>
                    </ul>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {lookupByCodeRequest}
                    </Snippet>
                    <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {addressObjectStructure}
                    </Snippet>
                  </div>
                </div>
              </section>

              <NextUIDivider />
              
              <section id="estate-endpoints">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-primary">
                  <Building className="mr-2 h-6 w-6 text-secondary" /> Estates Endpoints
                </h2>
                <div className="space-y-8">
                  
                  {/* List Estates Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /estates</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Retrieves a list of all approved real estate properties.
                    </p>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {listEstatesRequest}
                    </Snippet>
                    <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {listEstatesResponse}
                    </Snippet>
                  </div>

                  {/* Lookup Estate by Code Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /estates/{'{estateCode}'}</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Fetches a full, verified estate using its unique Estate Code.
                    </p>
                     <p className="text-base mb-1"><strong>Path Parameters:</strong></p>
                    <ul className="list-disc list-inside text-base ml-4 mb-2">
                        <li><Code>estateCode</Code> (string, required): The unique Estate Code.</li>
                    </ul>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {lookupEstateByCodeRequest}
                    </Snippet>
                    <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {estateObjectStructure}
                    </Snippet>
                  </div>
                </div>
              </section>

              <NextUIDivider />
              
              <section id="geography-endpoints">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-primary">
                  <MapIcon className="mr-2 h-6 w-6 text-secondary" /> Geography Endpoints
                </h2>
                <div className="space-y-8">
                  {/* Get States Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /states</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Lists all Nigerian states.
                    </p>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {statesRequest}
                    </Snippet>
                    <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {statesResponse}
                    </Snippet>
                  </div>
                  
                  {/* Get LGAs by State Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /states/{'{stateName}'}/lgas</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Lists all Local Government Areas (LGAs) for a specified Nigerian state.
                    </p>
                    <p className="text-base mb-1"><strong>Path Parameters:</strong></p>
                    <ul className="list-disc list-inside text-base ml-4 mb-2">
                        <li><Code>stateName</Code> (string, required): The name of the state (e.g., "Lagos"). Case-insensitive.</li>
                    </ul>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {lgasRequest}
                    </Snippet>
                    <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {lgasResponse}
                    </Snippet>
                  </div>

                  {/* Get Cities by LGA Endpoint */}
                  <div>
                    <h3 className="text-xl font-medium mb-1 text-primary">
                      <Code color="secondary" className="text-lg">GET /states/{'{stateName}'}/lga/{'{lgaName}'}/cities</Code>
                    </h3>
                    <p className="text-muted-foreground text-base mb-2">
                      Lists prominent cities/towns within a specified LGA of a state. (Note: City data granularity may vary).
                    </p>
                     <p className="text-base mb-1"><strong>Path Parameters:</strong></p>
                    <ul className="list-disc list-inside text-base ml-4 mb-2">
                        <li><Code>stateName</Code> (string, required): The name of the state.</li>
                        <li><Code>lgaName</Code> (string, required): The name of the LGA.</li>
                    </ul>
                    <p className="text-base mb-1"><strong>Example Request:</strong></p>
                    <Snippet lang="bash" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {citiesRequest}
                    </Snippet>
                     <p className="text-base mt-2 mb-1"><strong>Example Success Response (200 OK):</strong></p>
                    <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                      {citiesResponse}
                    </Snippet>
                  </div>

                </div>
              </section>

              <NextUIDivider />

              <section id="address-object">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                  <Code2 className="mr-2 h-6 w-6 text-secondary" /> Data Object Structures
                </h2>
                <p>
                  Our API returns data in a structured JSON format. Developers are encouraged to replicate this
                  structure for maximum compatibility.
                </p>
                <h4 className="text-lg font-semibold mt-4 mb-2 text-primary">Address Object</h4>
                <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                  {addressObjectStructure}
                </Snippet>
                <h4 className="text-lg font-semibold mt-4 mb-2 text-primary">Estate Object</h4>
                <Snippet lang="json" className="text-sm max-w-full" variant="bordered" tooltipProps={{color:"secondary"}}>
                  {estateObjectStructure}
                </Snippet>
              </section>
              
              <NextUIDivider />

              <section id="error-codes">
                <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                  <AlertTriangle className="mr-2 h-6 w-6 text-secondary" /> Error Handling
                </h2>
                <p>
                  The API uses standard HTTP status codes to indicate the success or failure of a request.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                  <li><Code>200 OK</Code>: Request was successful.</li>
                  <li><Code>400 Bad Request</Code>: The request was malformed (e.g., missing required parameters). The response body may contain more details.</li>
                  <li><Code>401 Unauthorized</Code>: API key is missing or invalid.</li>
                  <li><Code>403 Forbidden</Code>: API key is valid but does not have permission for the requested resource.</li>
                  <li><Code>404 Not Found</Code>: The requested resource does not exist.</li>
                  <li><Code>429 Too Many Requests</Code>: You have exceeded your rate limit.</li>
                  <li><Code>500 Internal Server Error</Code>: Something went wrong on our end. Please try again later.</li>
                </ul>
                 <p className="mt-2 text-base">
                  Error responses will typically include a JSON body with a <Code>message</Code> field explaining the error.
                </p>
              </section>
              
              <NextUIDivider />

              <section id="support" className="text-center">
                 <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center text-primary">
                  <HelpCircle className="mr-2 h-6 w-6 text-secondary" /> Need Help?
                </h2>
                <p>
                  If you have any questions, encounter issues, or need assistance with integration, please visit our support page.
                </p>
                <NextUILink href="/support" isBlock showAnchorIcon color="secondary" className="text-lg mt-3 inline-block">
                  Go to Support
                </NextUILink>
              </section>

            </NextUICardBody>
          </NextUICard>
        </div>
      </main>
      <footer className="py-8 border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://seapane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary no-underline"
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
