"use client"; 

import Image from "next/image";
import Link from "next/link";
import { Button as NextUIButton, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { CheckCircle, DatabaseZap, SearchCheck, KeyRound, MapPin, ShieldCheck, Gauge, Layers } from "lucide-react"; // Added Layers
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function HomePage() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />, 
      title: "Accurate Address Entry",
      description: "Users can save addresses exactly as they appear physically, capturing local nuances.",
      dataAiHint: "map location"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-secondary" />,
      title: "AI-Assisted Verification",
      description: "Addresses are auto-approved if matching Google Maps, or flagged for console review.",
      dataAiHint: "AI checkmark"
    },
    {
      icon: <KeyRound className="h-8 w-8 text-secondary" />,
      title: "Developer API Access",
      description: "Secure API keys provide access to endpoints for address lookup and autocompletion.",
      dataAiHint: "API key"
    },
    {
      icon: <SearchCheck className="h-8 w-8 text-secondary" />,
      title: "Smart Autocomplete",
      description: "Speed up forms with verified Nigerian address suggestions.",
      dataAiHint: "search complete"
    },
    {
      icon: <DatabaseZap className="h-8 w-8 text-secondary" />,
      title: "Structured Storage",
      description: "Addresses stored in a standardized format for maximum compatibility.",
      dataAiHint: "database structure"
    },
    {
      icon: <Gauge className="h-8 w-8 text-secondary" />,
      title: "99.99% Up-time",
      description: "We guarantee our performance. Intelligent routing, address data optimization and cache.",
      dataAiHint: "performance gauge"
    },
    {
      icon: <Layers className="h-8 w-8 text-secondary" />,
      title: "Geography Data",
      description: "Access structured Nigerian states, LGAs, and cities for location-aware apps.",
      dataAiHint: "geography database"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="py-20 md:py-32 bg-gradient-to-br from-background to-primary/5 bg-cover bg-center rounded-bl-md rounded-br-md shadow-md"
          style={{ backgroundImage: "url('https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/hero.jpg')" }}
        >
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="flex justify-center mb-6">
              <Image 
                src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.svg" 
                alt="Address Data Logomark" 
                width={64} 
                height={64}
                className="text-primary" 
                data-ai-hint="logo brand"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary"> 
              The Future of Nigerian Address Data
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto"> 
              Address Data provides developers, businesses, and operations with tools to validate, store, and retrieve Nigerian address data efficiently and accurately.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <NextUIButton 
                size="lg" 
                color="warning" 
                as={Link} 
                href="/login" 
                radius="md"
                className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
              >
                Get Started
              </NextUIButton>
              <NextUIButton 
                size="lg" 
                variant="bordered" 
                as={Link} 
                href="#features" 
                radius="md"
                className="shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
              >
                Learn More
              </NextUIButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-background"> 
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <Image 
                  src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-illustration-amico.svg" 
                  alt="Features Illustration" 
                  width={500} 
                  height={450} 
                  className="mx-auto"
                  data-ai-hint="data features" 
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4"> 
                  Why Address Data?
                </h2>
                <p className="text-foreground/80 mb-8 md:mb-12">
                  Our platform is purpose-built for Nigeria, offering unparalleled accuracy and developer-friendly tools.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.slice(0,4).map((feature, index) => ( 
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-primary/5 transition-colors"> 
                       <div className="flex-shrink-0 mt-1">{feature.icon}</div> 
                       <div>
                          <h3 className="font-bold text-lg text-primary">{feature.title}</h3> 
                          <p className="text-sm text-foreground/70">{feature.description}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"> 
              {features.slice(4).map((feature, index) => (
                <NextUICard key={index} isHoverable shadow="md" radius="xl" className="transition-shadow bg-background hover:shadow-primary/20">
                  <NextUICardHeader className="flex flex-col items-center pt-6 pb-2">
                    <div className="flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4"> 
                       {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl text-center text-primary">{feature.title}</h3> 
                  </NextUICardHeader>
                  <NextUICardBody className="pt-0 pb-6 text-center">
                    <p className="text-sm text-foreground/70">{feature.description}</p>
                  </NextUICardBody>
                </NextUICard>
              ))}
            </div>
          </div>
        </section>
        
        {/* API Section */}
        <section id="api" className="py-8 bg-primary/5"> 
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6"> 
                  Powerful & Simple Developer API
                </h2>
                <p className="text-foreground/80 mb-4 text-lg">
                  Integrate robust address validation and lookup into your applications with our easy-to-use API.
                </p>
                <ul className="space-y-3 text-foreground/80 mb-8">
                  {[
                    { icon: <CheckCircle className="h-5 w-5 text-secondary mr-2" />, text: "/autocomplete: Suggest verified Nigerian addresses." },
                    { icon: <CheckCircle className="h-5 w-5 text-secondary mr-2" />, text: "/lookup-by-code: Fetch full address by Address Data Code." },
                    { icon: <CheckCircle className="h-5 w-5 text-secondary mr-2" />, text: "/states: List Nigerian states, LGAs, and cities." },
                  ].map(item => (
                    <li key={item.text} className="flex items-center">
                      {item.icon}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <NextUIButton 
                  size="lg" 
                  color="warning" 
                  as={Link} 
                  href="/docs" 
                  radius="md"
                  className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                >
                  View API Documentation
                </NextUIButton>
              </div>
              <div className="lg:w-1/2">
                <Image 
                  src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-illustration-rafiki.svg" 
                  alt="API illustration" 
                  width={600} 
                  height={400} 
                  className="rounded-lg"
                  data-ai-hint="API development" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section 
          className="relative py-20 md:py-32 bg-cover bg-center"
          style={{ backgroundImage: "url('https://address-data.vercel.app/assets/images/hero-bg-3.jpg')" }}
        >
          <div className="absolute inset-0 bg-primary/80"></div> 
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white"> 
              Ready to Elevate Your Address Handling?
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90">
              Join Address Data today and experience the difference accurate, structured address data can make.
            </p>
            <NextUIButton 
              size="lg" 
              as={Link} 
              href="/login" 
              radius="md"
              className="bg-warning text-primary hover:bg-warning/90 shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
            >
              Access Portal
            </NextUIButton>
          </div>
        </section>
      </main>

      {/* Footer */}
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

