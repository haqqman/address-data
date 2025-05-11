
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DatabaseZap, SearchCheck, KeyRound, MapPin, ShieldCheck, Building2, Gauge } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function HomePage() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Accurate Address Entry",
      description: "Users can save addresses exactly as they appear physically, capturing local nuances.",
      dataAiHint: "map location"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "AI-Assisted Verification",
      description: "Addresses are auto-approved if matching Google Maps, or flagged for admin review.",
      dataAiHint: "AI checkmark"
    },
    {
      icon: <KeyRound className="h-8 w-8 text-primary" />,
      title: "Developer API Access",
      description: "Secure API keys provide access to endpoints for address lookup and autocompletion.",
      dataAiHint: "API key"
    },
    {
      icon: <SearchCheck className="h-8 w-8 text-primary" />,
      title: "Smart Autocomplete",
      description: "Speed up forms with verified Nigerian address suggestions.",
      dataAiHint: "search complete"
    },
    {
      icon: <DatabaseZap className="h-8 w-8 text-primary" />,
      title: "Structured Storage",
      description: "Addresses stored in a standardized format for maximum compatibility.",
      dataAiHint: "database structure"
    },
    {
      icon: <Gauge className="h-8 w-8 text-primary" />,
      title: "99.99% Up-time",
      description: "We guarantee our performance. Intelligent routing, address data optimization and cache.",
      dataAiHint: "performance gauge"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-background to-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Building2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              The Future of Nigerian Address Data
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Address Data provides developers, businesses, and admins with tools to validate, store, and retrieve Nigerian address data efficiently and accurately.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Why Address Data?
            </h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Our platform is purpose-built for Nigeria, offering unparalleled accuracy and developer-friendly tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                       {feature.icon}
                    </div>
                    <CardTitle className="text-center text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* API Section */}
        <section id="api" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Powerful & Simple Developer API
                </h2>
                <p className="text-muted-foreground mb-4 text-lg">
                  Integrate robust address validation and lookup into your applications with our easy-to-use API.
                </p>
                <ul className="space-y-3 text-muted-foreground mb-8">
                  {[
                    { icon: <CheckCircle className="h-5 w-5 text-primary mr-2" />, text: "/autocomplete: Suggest verified Nigerian addresses." },
                    { icon: <CheckCircle className="h-5 w-5 text-primary mr-2" />, text: "/lookup-by-code: Fetch full address by Address Data Code." },
                    { icon: <CheckCircle className="h-5 w-5 text-primary mr-2" />, text: "/states: List Nigerian states, LGAs, and cities." },
                  ].map(item => (
                    <li key={item.text} className="flex items-center">
                      {item.icon}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/docs">View API Documentation</Link>
                </Button>
              </div>
              <div className="lg:w-1/2">
                <Image 
                  src="https://picsum.photos/600/400" 
                  alt="API illustration" 
                  width={600} 
                  height={400} 
                  className="rounded-lg shadow-xl"
                  data-ai-hint="API code" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Elevate Your Address Handling?
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-primary-foreground/90">
              Join Address Data today and experience the difference accurate, structured address data can make.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/login">Access Portal</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
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

